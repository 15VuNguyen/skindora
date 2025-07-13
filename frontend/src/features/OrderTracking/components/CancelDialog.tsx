import { LoaderCircle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

interface CancelDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  reason: string;
  setReason: (reason: string) => void;
  isCancelling: boolean;
}

export const CancelDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  reason,
  setReason,
  isCancelling,
}: CancelDialogProps) => (
  <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Bạn có chắc muốn hủy đơn hàng này?</AlertDialogTitle>
        <AlertDialogDescription>Vui lòng nhập lý do hủy đơn hàng.</AlertDialogDescription>
      </AlertDialogHeader>
      <div className="overflow-auto py-2">
        <Textarea placeholder="Nhập lý do của bạn..." value={reason} onChange={(e) => setReason(e.target.value)} />
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel>Quay lại</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} disabled={!reason.trim() || isCancelling}>
          {isCancelling ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : "Xác nhận hủy đơn"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
