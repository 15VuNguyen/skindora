import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowUpDown, Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
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
import type { Post } from "@/types/post";

// Map trạng thái từ backend sang tiếng Việt
const getStatusBadge = (status: string) => {
  switch (status.toUpperCase()) {
    case "PUBLISHED":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
          Đã xuất bản
        </Badge>
      );
    case "DRAFT":
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
          Bản nháp
        </Badge>
      );
    case "ARCHIVED":
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
          Đã lưu trữ
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// Hàm format ngày tháng
const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
  } catch (error) {
    return "N/A";
  }
};

// Hàm cắt ngắn nội dung
const truncateContent = (content: string, maxLength: number = 100) => {
  if (!content) return "N/A";
  return content.length > maxLength ? `${content.substring(0, maxLength)}...` : content;
};

export const postColumns: ColumnDef<Post>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Chọn tất cả"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Chọn dòng"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold"
      >
        Tiêu đề
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <div className="max-w-[300px]">
          <div className="truncate font-medium" title={title}>
            {title}
          </div>
          <div className="text-muted-foreground mt-1 text-sm">Slug: {row.original.slug}</div>
        </div>
      );
    },
  },

  {
    accessorKey: "content",
    header: "Nội dung",
    cell: ({ row }) => {
      const content = row.getValue("content") as { rawHtml: string; plainText: string };
      return (
        <div className="max-w-[200px]">
          <div className="text-muted-foreground text-sm" title={content.plainText}>
            {truncateContent(content.plainText, 30)}
          </div>
        </div>
      );
    },
  },

  // Cột Trạng thái
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold"
      >
        Trạng thái
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return getStatusBadge(status);
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  // Cột Tác giả
  {
    accessorKey: "authorId",
    header: "Tác giả",
    cell: ({ row }) => {
      const authorId = row.getValue("authorId") as string;
      return <div className="font-medium">{authorId ? `ID: ${authorId.substring(0, 8)}...` : "N/A"}</div>;
    },
  },

  // Cột Ngày xuất bản
  {
    accessorKey: "publishedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold"
      >
        Ngày xuất bản
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const publishedAt = row.getValue("publishedAt") as string;
      return <div className="text-sm">{publishedAt ? formatDate(publishedAt) : "Chưa xuất bản"}</div>;
    },
  },

  // Cột Ngày tạo
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold"
      >
        Ngày tạo
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as string;
      return <div className="text-sm">{formatDate(createdAt)}</div>;
    },
  },

  // Cột Tags/Filters (hiển thị số lượng)
  {
    id: "filters",
    header: "Tags",
    cell: ({ row }) => {
      const post = row.original;
      const totalFilters = [
        ...(post.filter_brand || []),
        ...(post.filter_dac_tinh || []),
        ...(post.filter_hsk_ingredients || []),
        ...(post.filter_hsk_product_type || []),
        ...(post.filter_hsk_size || []),
        ...(post.filter_hsk_skin_type || []),
        ...(post.filter_hsk_uses || []),
        ...(post.filter_origin || []),
      ].length;

      return totalFilters > 0 ? (
        <Badge variant="outline" className="text-xs">
          {totalFilters} tags
        </Badge>
      ) : (
        <span className="text-muted-foreground text-sm">Không có</span>
      );
    },
  },

  // Cột Actions
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const post = row.original;
      const navigate = useNavigate();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                console.log("Xem bài viết:", post._id);
                navigate(`/admin/posts/${post.slug}/${post._id}`);
              }}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                console.log("Chỉnh sửa bài viết:", post._id);
              }}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            {post.status.toUpperCase() !== "ARCHIVED" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    // TODO: Implement delete post
                    console.log("Xóa bài viết:", post._id);
                  }}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa bài viết
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
