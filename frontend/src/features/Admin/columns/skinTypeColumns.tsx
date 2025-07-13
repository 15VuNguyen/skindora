// src/features/Admin/columns/skinTypeColumn.tsx
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
import { useUpdateStatusSkinType } from "@/hooks/SkinType/useUpdateStatusSkinType";
import type { SkinType } from "@/types/Filter/skinType";

export const ActionsCell = ({ row, refetchData }: { row: { original: SkinType }; refetchData: () => void }) => {
  const { _id, option_name, state } = row.original;
  const navigate = useNavigate();
  const payload = {
    state: state === "ACTIVE" ? "INACTIVE" : "ACTIVE",
  };
  const { updateStateSkinType, loading } = useUpdateStatusSkinType({
    id: String(_id),
    payload,
  });
  const handleUpdateStatus = () => {
    updateStateSkinType(refetchData);
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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(option_name)}>Copy tên hãng</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate(`/admin/${_id}/skin-type-detail`)}>Xem chi tiết</DropdownMenuItem>
          {state === "ACTIVE" ? (
            <DropdownMenuItem onClick={() => navigate(`/admin/${_id}/update-skin-type`)}>Chỉnh sửa</DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => navigate(`/admin/${_id}/update-skin-type`)} disabled>
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
export const skinTypeColumn = (refetchData: () => void): ColumnDef<SkinType>[] => [
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
      <ShadcnButton variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </ShadcnButton>
    ),
    cell: ({ row }) => <div className="pl-2 font-medium text-blue-600">{row.getValue("_id")}</div>,
  },

  {
    accessorKey: "option_name",
    header: ({ column }) => (
      <ShadcnButton variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Tên Loại da
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
      return <Badge variant="secondary">Không hoạt động</Badge>;
    },
  },

  {
    accessorKey: "created_at",
    header: "Ngày được tạo",
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
    cell: ({ row }) => <ActionsCell row={row} refetchData={refetchData} />,
  },
];
