"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import Typography from "@/components/Typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateStatus } from "@/hooks/useUpdateStatus";
import type { Order } from "@/types/order";

export const orderColumn: ColumnDef<Order, unknown>[] = [
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
      return <div className="ml-3 py-3 font-mono">{id.substring(0, 10)}...</div>;
    },
  },

  // Cột Địa chỉ giao hàng
  {
    accessorKey: "ShipAddress",

    header: "Địa chỉ giao hàng",
    cell: ({ row }) => {
      const address = row.getValue("ShipAddress") as string;
      // Cắt ngắn địa chỉ để hiển thị cho gọn
      return (
        <div title={address} className="max-w-[250px] truncate">
          {address}
        </div>
      );
    },
  },

  // Cột Ngày yêu cầu
  {
    accessorKey: "RequireDate",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Ngày yêu cầu <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const dateString = row.getValue("RequireDate") as string;
      // Định dạng lại ngày tháng cho nhất quán
      try {
        return <p className="px-3">{new Date(dateString).toLocaleDateString("vi-VN")}</p>;
      } catch (e) {
        return <p className="text-center">{dateString}</p>; // Hiển thị nguyên gốc nếu không parse được
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
    // Cho phép filter theo cột này
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  // Cột Ngày cập nhật
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
      // Định dạng lại ngày tháng cho dễ đọc
      return <Typography className="ml-3">{new Date(dateString).toLocaleString("vi-VN")}</Typography>;
    },
  },

  // Cột Actions
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      const { loading, updateStatus } = useUpdateStatus();
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order._id)}>
                Copy Mã đơn hàng
              </DropdownMenuItem>
              <DropdownMenu>
                <DropdownMenuItem
                  onClick={() => updateStatus({ orderID: order._id })} // ✅ Gọi hàm xử lý sự kiện
                  disabled={loading} // Tùy chọn: vô hiệu hóa nút khi đang xử lý
                >
                  {loading ? "Đang cập nhật..." : "Cập nhật trạng thái đơn hàng"}
                </DropdownMenuItem>
              </DropdownMenu>
              <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Hủy đơn hàng</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
