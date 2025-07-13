import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
import { useApproveCancelRequest } from "@/hooks/CancelRequest/useApproveCancelRequest";
import { useRejectCancelRequest } from "@/hooks/CancelRequest/useRejectCancelRequest";
import type { CancelRequest } from "@/types/cancelRequest";

const formatCurrency = (amount: number | string) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(amount));
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

export const ActionsCell = ({ row }: { row: { original: CancelRequest } }) => {
  const { _id, UserID } = row.original;
  const navigate = useNavigate();
  const { appproveCancelRequest } = useApproveCancelRequest(String(_id));
  const { rejectedCancelRequest } = useRejectCancelRequest(String(_id));
  const handleApprove = () => {
    console.log("Approving request:", _id);
    appproveCancelRequest();
    toast.success("Thành công!", {
      description: "Thông tin đơn hàng đã được cập nhật",
    });
    window.location.reload();
  };

  const handleReject = () => {
    console.log("Rejecting request:", _id);
    rejectedCancelRequest();
    toast.success("Thành công!", {
      description: "Thông tin đơn hàng đã được cập nhật",
    });
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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(UserID)}>Copy Mã người dùng</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate(`/admin/order-detail/${_id}`)}>Xem chi tiết</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleApprove()}>Chấp nhận</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleReject()}>Từ chối</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const cancelRequestColumns: ColumnDef<CancelRequest>[] = [
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
    header: "Mã Đơn Hàng",
    cell: ({ row }) => {
      return (
        <div>
          <span className="font-medium text-blue-600 hover:text-blue-800">{row.getValue("_id")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "UserID",
    // header: ({ column }) => (
    //   <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
    //     Mã Người Dùng <ArrowUpDown className="ml-2 h-4 w-4" />
    //   </Button>
    // ),
    header: "Mã Người Dùng ",
    cell: ({ row }) => {
      return (
        <div>
          <span className="font-medium text-indigo-600 hover:text-indigo-800">{row.getValue("UserID")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "TotalPrice",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="w-full max-w-[120px] truncate px-2 text-sm"
      >
        Tổng Tiền <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("TotalPrice"));
      return (
        // <div className="pl-3 whitespace-nowrap">
        //   <span className="font-medium text-green-600"> {formatCurrency(amount)}</span>
        // </div>
        <div className="pl-3">
          <span className="font-medium text-green-600">{formatCurrency(amount)}</span>
        </div>
      );
    },
    size: 120,
  },
  {
    accessorFn: (row) => row.CancelRequest.requestedAt,
    id: "requestedAt",
    header: "Ngày Yêu Cầu",
    cell: ({ row }) => {
      return (
        <div className="pl-3">
          <span>{formatDate(row.original.CancelRequest.requestedAt)}</span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.CancelRequest.status,
    id: "requestStatus",
    header: "Trạng thái Yêu cầu",
    cell: ({ row }) => {
      const status = row.original.CancelRequest.status;
      if (status === "APPROVED") {
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Đã chấp thuận</Badge>;
      }
      if (status === "REJECTED") {
        return <Badge variant="destructive">Đã từ chối</Badge>;
      }
      return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Đang chờ</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
