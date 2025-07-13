import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
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
  const { _id, UserID, CancelRequest } = row.original;
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [staffNote, setStaffNote] = useState<string>("");

  const { appproveCancelRequest } = useApproveCancelRequest({
    id: String(_id),
    staffNote: staffNote,
  });
  const { rejectedCancelRequest } = useRejectCancelRequest({
    id: String(_id),
    staffNote: staffNote,
  });

  const handleAction = async () => {
    if (actionType === "approve") {
      console.log("Approving request:", _id, "with note:", staffNote);
      await appproveCancelRequest();
      toast.success("Thành công!", {
        description: "Thông tin đơn hàng đã được cập nhật",
      });
    } else if (actionType === "reject") {
      console.log("Rejecting request:", _id, "with note:", staffNote);
      await rejectedCancelRequest();
      toast.success("Thành công!", {
        description: "Thông tin đơn hàng đã được cập nhật",
      });
    }
    setDialogOpen(false);
    // You might still want to reload the page or refetch data after a successful action
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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(UserID)}>Copy Mã người dùng</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate(`/admin/order-detail/${_id}`)}>Xem chi tiết</DropdownMenuItem>
          {CancelRequest.status === "REQUESTED" ? (
            <>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setActionType("approve");
                      setDialogOpen(true);
                    }}
                  >
                    Chấp nhận
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setActionType("reject");
                      setDialogOpen(true);
                    }}
                  >
                    Từ chối
                  </DropdownMenuItem>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {actionType === "approve" ? "Chấp nhận yêu cầu hủy đơn" : "Từ chối yêu cầu hủy đơn"}
                    </DialogTitle>
                    <DialogDescription>Vui lòng nhập lý do/ghi chú của nhân viên cho hành động này.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Textarea
                      id="staffNote"
                      placeholder="Nhập lý do hoặc ghi chú..."
                      value={staffNote}
                      onChange={(e) => setStaffNote(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Hủy</Button>
                    </DialogClose>
                    <Button onClick={handleAction}>Xác nhận</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <div>
              <DropdownMenuItem disabled>Chấp nhận</DropdownMenuItem>
              <DropdownMenuItem disabled>Từ chối</DropdownMenuItem>
            </div>
          )}
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
    accessorFn: (row) => row.CancelRequest.reason,
    id: "reason",
    header: "Lý do hủy",
    cell: ({ row }) => {
      const reason = row.original.CancelRequest.reason;

      return (
        <div className="">
          <span>{reason || "Không có"}</span>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.CancelRequest.reason,
    id: "staffNote",
    header: "Staff Note",
    cell: ({ row }) => {
      const staffnNote = row.original.CancelRequest.staffNote;

      return (
        <div className="">
          <span>{staffnNote || "Không có"}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
