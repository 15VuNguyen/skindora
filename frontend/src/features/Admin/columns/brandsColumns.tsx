import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
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
import { useUpdateStatusBrand } from "@/hooks/Brand/useUpdateStatusBrand";
import type { Brand } from "@/types/brand";

// const formatCurrency = (amount: number | string) => {
//   return new Intl.NumberFormat("vi-VN", {
//     style: "currency",
//     currency: "VND",
//   }).format(Number(amount));
// };
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};

export const ActionsCell = ({ row }: { row: { original: Brand } }) => {
  const { _id, option_name, state } = row.original;

  const navigate = useNavigate();
  const payload = {
    state: state === "ACTIVE" ? "INACTIVE" : "ACTIVE",
  };
  const { updateStateBrand, loading } = useUpdateStatusBrand({
    id: String(_id),
    payload,
  });
  const handleUpdateStatus = () => {
    updateStateBrand();
    window.location.reload();
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
          <DropdownMenuItem onClick={() => navigate(`/admin/${_id}/detail-brand`)}>Xem chi tiết</DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(`/admin/${_id}/update-brand`)}>Chỉnh sửa</DropdownMenuItem>
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

export const brandsColumn: ColumnDef<Brand>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "_id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Mã Voucher <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <div className="pl-2 font-medium text-blue-600">{row.getValue("_id")}</div>;
    },
  },

  {
    accessorKey: "option_name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Tên thương hiệu <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <div className="pl-2 font-medium text-blue-600">{row.getValue("option_name")}</div>;
    },
  },
  // Cột Trạng thái
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

  // Cột Ngày hiệu lực
  {
    accessorKey: "created_at",
    header: "Thời gian hiệu lực",
    cell: ({ row }) => {
      const { created_at } = row.original;
      return <div>{`${formatDate(created_at)}`}</div>;
    },
  },

  // Cột Actions
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
