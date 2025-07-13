// src/features/Admin/columns/originColumn.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateStatusOrigin } from "@/hooks/Origin/useUpdateStatusOrigin";
import type { Origin } from "@/types/Filter/origin";

export const ActionsCell = ({ row, refetchData }: { row: { original: Origin }; refetchData: () => void }) => {
  const navigate = useNavigate();
  const { _id, state } = row.original;
  const payload = {
    state: state === "ACTIVE" ? "INACTIVE" : "ACTIVE",
  };
  const { updateStateOrigin, loading } = useUpdateStatusOrigin({ id: String(_id), payload });
  const handleUpdateStatus = () => {
    updateStateOrigin(refetchData);
  };
  return (
    <div className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(_id)}>Copy mã voucher</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate(`/admin/${_id}/origin-detail`)}>Xem chi tiết</DropdownMenuItem>
          {state === "ACTIVE" ? (
            <DropdownMenuItem onClick={() => navigate(`/admin/${_id}/update-origin`)}>Chỉnh sửa</DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => navigate(`/admin/${_id}/update-origin`)} disabled>
              Chỉnh sửa
            </DropdownMenuItem>
          )}

          {state === "ACTIVE" ? (
            <DropdownMenuItem
              disabled={loading}
              onClick={() => handleUpdateStatus()}
              className="font-bold text-red-600 focus:text-red-600"
            >
              {loading ? "Đang xử lý..." : "Vô hiệu hóa"}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              disabled={loading}
              onClick={() => handleUpdateStatus()}
              className="font-bold text-green-600 focus:text-green-600"
            >
              {loading ? "Đang xử lý..." : "Kích hoạt"}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};
export const originColumn = (refetchData: () => void): ColumnDef<Origin>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <>
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </>
    ),
    cell: ({ row }) => (
      <>
        <Checkbox
          className="ml-0"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "_id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Mã Đơn Hàng <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      // Có thể cắt ngắn ID nếu quá dài
      const id = row.getValue("_id") as string;
      return <div className="pl-2 font-medium text-blue-600">{id.substring(0, 10)}...</div>;
    },
  },
  {
    accessorKey: "option_name",
    header: ({ column }) => (
      <ShadcnButton variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Tên Xuất xứ
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </ShadcnButton>
    ),
    cell: ({ row }) => <div className="pl-2 font-medium text-blue-600">{row.getValue("option_name")}</div>,
  },

  {
    accessorKey: "state",
    header: "Trạng thái",
    cell: ({ row }) => {
      const state = row.getValue("state");
      if (state === "ACTIVE") {
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Đang hoạt động</Badge>;
      }
      return <Badge variant="danger">Không hoạt động</Badge>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Thời gian hiệu lực",
    cell: ({ row }) => {
      const { created_at } = row.original;
      return <div>{`${formatDate(created_at)}`}</div>;
    },
  },

  {
    accessorKey: "updated_at",
    header: "Cập nhật lần cuối",
    cell: ({ row }) => {
      const { updated_at } = row.original;
      return <div>{`${formatDate(updated_at)}`}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <ActionsCell row={row} refetchData={refetchData} />;
    },
  },
];
