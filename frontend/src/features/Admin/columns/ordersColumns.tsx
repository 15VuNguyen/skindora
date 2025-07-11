import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Typography from "@/components/Typography";
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
import { useUpdateStatus } from "@/hooks/Orders/useUpdateStatus";
import type { Order } from "@/types/order";

export const ActionsCell = ({ row, refechData }: { row: { original: Order }; refechData: () => void }) => {
  const navigate = useNavigate();
  const { _id } = row.original;
  const { updateStatus } = useUpdateStatus(String(_id));
  const handleUpdateStatus = () => {
    updateStatus(refechData);
    // window.location.reload();
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
          <DropdownMenuItem onClick={() => navigate(`/admin/order-detail/${_id}`)}>Xem chi tiết</DropdownMenuItem>
          {/* <DropdownMenuItem onClick={() => navigate("")}>Chỉnh sửa</DropdownMenuItem> */}
          <DropdownMenuItem onClick={() => handleUpdateStatus()}>Cập nhật</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export const orderColumn = (refechData: () => void): ColumnDef<Order, unknown>[] => [
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

  // Cột Địa chỉ giao hàng
  {
    accessorKey: "ShipAddress",

    header: "Địa chỉ giao hàng",
    cell: ({ row }) => {
      const address = row.getValue("ShipAddress") as string;

      return (
        <div title={address} className="max-w-[250px] truncate">
          {address}
        </div>
      );
    },
  },

  {
    accessorKey: "RequireDate",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Ngày yêu cầu <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const dateString = row.getValue("RequireDate") as string;

      try {
        return <p className="px-3">{new Date(dateString).toLocaleDateString("vi-VN")}</p>;
      } catch (e) {
        return <p className="text-center">{dateString}</p>;
      }
    },
  },

  // Cột Trạng thái
  {
    accessorKey: "Status",
    header: "Trạng thái đơn hàng",
    cell: ({ row }) => {
      const status = row.getValue("Status") as Order["Status"];

      const variant =
        status === "DELIVERED"
          ? "complete"
          : status === "CANCELLED"
            ? "danger"
            : status === "RETURNED"
              ? "default"
              : status === "SHIPPING"
                ? "waiting"
                : "secondary";

      return <Badge variant={variant}>{status}</Badge>;
    },

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <Typography>Cập nhật</Typography>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const dateString = row.getValue("updatedAt") as string;

      return <Typography className="ml-3">{new Date(dateString).toLocaleString("vi-VN")}</Typography>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return <ActionsCell row={row} refetchData={refechData} />;
    },
  },
];
