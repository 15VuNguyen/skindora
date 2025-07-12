import { LoaderCircle, TicketPercent } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useVouchersQuery } from "@/hooks/queries/useVouchersQuery";
import type { Voucher } from "@/types/voucher";

interface VoucherDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyVoucher: (voucher: Voucher) => void;
  selectedVoucherCode?: string | null;
  subtotal: number;
}

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-GB");

export const VoucherDialog = ({
  isOpen,
  onOpenChange,
  onApplyVoucher,
  selectedVoucherCode,
  subtotal,
}: VoucherDialogProps) => {
  const { data: voucherResponse, isLoading } = useVouchersQuery(true);
  const [locallySelectedCode, setLocallySelectedCode] = useState<string | null>(selectedVoucherCode ?? null);

  useEffect(() => {
    setLocallySelectedCode(selectedVoucherCode ?? null);
  }, [selectedVoucherCode]);

  const vouchers = voucherResponse?.data ?? [];

  const handleApply = () => {
    const selectedVoucher = vouchers.find((v: Voucher) => v.code === locallySelectedCode);
    if (selectedVoucher) {
      onApplyVoucher(selectedVoucher);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0">
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4">
          <DialogTitle className="text-xl font-bold">Ưu đãi & Mã giảm giá của tôi</DialogTitle>
          <DialogClose asChild />
        </DialogHeader>
        <Separator />
        <div className="p-6">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <LoaderCircle className="text-primary h-8 w-8 animate-spin" />
            </div>
          ) : (
            <RadioGroup value={locallySelectedCode || ""} onValueChange={setLocallySelectedCode}>
              <ScrollArea className="h-[50vh] pr-4">
                <div className="space-y-3">
                  {vouchers.map((voucher: Voucher) => {
                    const isApplicable = subtotal >= Number(voucher.minOrderValue);
                    const labelId = `voucher-${voucher.code}`;

                    return (
                      <label
                        key={voucher.code}
                        htmlFor={labelId}
                        className={`has-[:checked]:border-primary has-[:checked]:bg-primary/5 flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all ${!isApplicable ? "cursor-not-allowed bg-gray-50 opacity-50" : ""} `}
                      >
                        <div
                          className={`bg-primary/10 text-primary flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md ${!isApplicable ? "grayscale" : ""}`}
                        >
                          <TicketPercent className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{voucher.description}</p>

                          <p className={`text-xs ${isApplicable ? "text-gray-500" : "font-medium text-red-500"}`}>
                            Đơn tối thiểu: {Number(voucher.minOrderValue).toLocaleString("vi-VN")}₫
                          </p>
                          <p className="text-xs text-gray-500">Hết hạn: {formatDate(voucher.endDate)}</p>
                        </div>
                        <RadioGroupItem value={voucher.code} id={labelId} className="mt-1" disabled={!isApplicable} />
                      </label>
                    );
                  })}
                </div>
              </ScrollArea>
            </RadioGroup>
          )}
        </div>
        <Separator />
        <div className="flex items-center justify-between p-6">
          <span className="text-sm font-medium">
            {locallySelectedCode ? "Đã chọn 1 mã giảm giá" : "Chưa chọn mã giảm giá"}
          </span>
          <Button onClick={handleApply} disabled={!locallySelectedCode}>
            Áp dụng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
