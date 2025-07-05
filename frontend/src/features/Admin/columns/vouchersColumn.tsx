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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Đảm bảo đã import type này
import { useToggleStatusVoucher } from "@/hooks/Voucher/useToggleStatusVoucher";
// 1. Import định nghĩa type Voucher
import type { Voucher } from "@/types/voucher";

// Đặt component này ở trên cùng file vouchersColumns.tsx

const formatCurrency = (amount: number | string) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(amount));
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};

const ActionsCell = ({ row }: { row: { original: Voucher } }) => {
  const { _id, isActive, code } = row.original;
  console.log(_id);
  const { updateStatusVoucher, loading } = useToggleStatusVoucher(String(_id));
  const handleUpdateStatus = () => {
    updateStatusVoucher();
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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(code)}>Copy mã voucher</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
          <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
          {isActive ? (
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
// 2. Định nghĩa các cột cho bảng Voucher
export const vouchersColumns: ColumnDef<Voucher>[] = [
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
    accessorKey: "code",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Mã Voucher <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <div className="pl-2 font-medium text-blue-600">{row.getValue("code")}</div>;
    },
  },

  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-[250px] truncate" title={description}>
          {description}
        </div>
      );
    },
  },
  {
    id: "discount",
    header: "Mức giảm giá",
    cell: ({ row }) => {
      const { discountValue, maxDiscountAmount, discountType } = row.original;
      if (discountType === "PERCENTAGE") {
        let discountText = discountValue;
        if (Number(maxDiscountAmount) > 0) {
          discountText += `% (tối đa ${formatCurrency(maxDiscountAmount)})`;
        }
        return <div>{discountText}</div>;
      }
      if (discountType === "FIXED") {
        return <div> Giảm tối đa {formatCurrency(discountValue)}</div>;
      }
    },
  },
  {
    accessorKey: "minOrderValue",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Đơn tối thiểu <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <div className="pl-3 font-semibold text-green-500">{formatCurrency(row.getValue("minOrderValue"))}</div>;
    },
  },

  {
    id: "usage",
    header: "Sử dụng",
    cell: ({ row }) => {
      const { usedCount, usageLimit } = row.original;
      return (
        <div>
          {usedCount} / {usageLimit}
        </div>
      );
    },
  },

  // Cột Trạng thái
  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      const { startDate, endDate } = row.original;
      const now = new Date();
      const isExpired = new Date(endDate) < now;
      const isNotStarted = new Date(startDate) > now;

      // if (isExpired) {
      //   return <Badge variant="destructive">Hết hạn</Badge>;
      // }
      // if (isNotStarted) {
      //   return <Badge variant="secondary">Chưa bắt đầu</Badge>;
      // }
      if (isActive) {
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Đang hoạt động</Badge>;
      }
      return <Badge variant="secondary">Không hoạt động</Badge>;
    },
  },

  // Cột Ngày hiệu lực
  {
    accessorKey: "startDate",
    header: "Thời gian hiệu lực",
    cell: ({ row }) => {
      const { startDate, endDate } = row.original;
      return <div>{`${formatDate(startDate)} - ${formatDate(endDate)}`}</div>;
    },
  },

  // Cột Actions
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
