"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

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

// 1. Định nghĩa interface cho Order dựa trên dữ liệu bạn cung cấp

// Helper để định dạng Status cho đẹp hơn
const getStatusVariant = (status: Order["Status"]) => {
  switch (status) {
    case "DELIVERED":
      return "success"; // Giả sử bạn có variant 'success' màu xanh lá
    case "SHIPPING":
      return "secondary";
    case "CANCELLED":
      return "destructive";
    case "PENDING":
    default:
      return "outline";
  }
};

// 2. Định nghĩa các cột cho bảng Order
export const orderColumn: ColumnDef<Order, unknown>[] = [
  // Cột Checkbox (giống hệt ví dụ user)
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
    id: "stt", // Đặt một ID duy nhất cho cột vì không dùng accessorKey
    header: () => <div className="text-center">STT</div>, // Header là text tĩnh, căn giữa
    cell: ({ row, table }) => {
      // Lấy thông tin về phân trang từ table instance
      const { pageIndex, pageSize } = table.getState().pagination;
      // Tính số thứ tự dựa trên trang hiện tại
      const index = pageIndex * pageSize + row.index + 1;
      return <div className="text-center font-medium">{index}</div>;
    },
    enableSorting: false, // Không cho phép sort cột này
    enableHiding: false, // Không cho phép ẩn cột này
  },

  // Cột Mã đơn hàng (_id)

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
      return <div className="font-mono">{id.substring(0, 10)}...</div>;
    },
  },

  // Cột Địa chỉ giao hàng
  {
    accessorKey: "ShipAddress",
    // Thường không sort theo địa chỉ, nên để header tĩnh
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
    header: "Trạng thái",
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
        Cập nhật <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const dateString = row.getValue("updatedAt") as string;
      // Định dạng lại ngày tháng cho dễ đọc
      return new Date(dateString).toLocaleString("vi-VN");
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
