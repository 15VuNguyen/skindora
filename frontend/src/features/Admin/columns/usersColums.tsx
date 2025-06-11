// src/app/users/columns.tsx

"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

// src/app/users/columns.tsx

// src/app/users/columns.tsx

// src/app/users/columns.tsx

// src/app/users/columns.tsx

// 1. Định nghĩa interface User bạn đã cung cấp
export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  phone_number: string;
  avatar: string;
  roleid: number;
  verify: number;
  created_at: string;
  // Các trường khác không cần hiển thị có thể bỏ qua trong định nghĩa cột
  // password, email_verify_token, ...
}

// 2. Định nghĩa các cột cho bảng User
export const userColumn: ColumnDef<User>[] = [
  // Cột Checkbox
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

  // Cột Họ và Tên (kết hợp avatar)
  {
    accessorKey: "first_name", // Dùng một key chính để sort
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Họ và Tên <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const user = row.original;
      const fullName = `${user.first_name} ${user.last_name}`;
      const fallback = user.first_name.charAt(0) + user.last_name.charAt(0);

      return (
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={user.avatar} alt={fullName} />
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{fullName}</div>
        </div>
      );
    },
  },

  // Cột Email
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Email <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  // Cột Username
  {
    accessorKey: "username",
    header: "Tên người dùng",
  },

  // Cột Vai trò
  {
    accessorKey: "roleid",
    header: "Vai trò",
    cell: ({ row }) => {
      const roleid = row.getValue("roleid");
      // Chuyển đổi roleid số thành chuỗi có ý nghĩa
      const roleText = roleid === 1 ? "Admin" : roleid === 2 ? "Moderator" : "User";
      const variant = roleid === 1 ? "destructive" : roleid === 2 ? "secondary" : "default";

      return <Badge variant={variant}>{roleText}</Badge>;
    },
  },

  // Cột Trạng thái xác thực
  {
    accessorKey: "verify",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isVerified = row.getValue("verify") === 1;
      return (
        <span className={isVerified ? "text-green-600" : "text-yellow-600"}>
          {isVerified ? "Đã xác thực" : "Chờ xác thực"}
        </span>
      );
    },
  },

  // Cột Actions
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user._id)}>Copy User ID</DropdownMenuItem>
              <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Xóa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
