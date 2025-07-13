import { AlertCircle, ArrowLeft, Calendar, CheckCircle, Edit, Loader2, Tag } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useFetchVoucherByID } from "@/hooks/Voucher/useFetchVoucherById";
import { useToggleStatusVoucher } from "@/hooks/Voucher/useToggleStatusVoucher";

const VoucherDetail = () => {
  const { _id } = useParams<{ _id: string }>();
  const { fetchAllVoucherByID, voucher, loading } = useFetchVoucherByID(String(_id));
  const navigate = useNavigate();
  const { updateStatusVoucher } = useToggleStatusVoucher(String(_id));
  const handleUpdateStatus = () => {
    updateStatusVoucher();
    window.location.reload();
  };
  useEffect(() => {
    fetchAllVoucherByID();
  }, [fetchAllVoucherByID]);

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(value));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <span className="text-lg">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="container mx-auto p-8 text-center">
        <AlertCircle className="text-destructive mx-auto h-12 w-12" />
        <h1 className="mt-4 text-2xl font-bold">Không tìm thấy voucher</h1>
        <p className="text-muted-foreground mt-2">Voucher với ID "{_id}" không tồn tại hoặc đã bị xóa.</p>
      </div>
    );
  }

  const usagePercentage = (Number(voucher.usedCount) / Number(voucher.usageLimit)) * 100;
  const isExpired = new Date(voucher.endDate) < new Date();

  return (
    <div>
      <div className="mt-3 ml-10">
        <Button
          variant="ghost"
          onClick={() => {
            navigate("/admin/voucher");
          }}
        >
          <ArrowLeft />
          Quay lại
        </Button>
      </div>
      <div className="container mx-auto p-4 md:p-8">
        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-3xl font-bold">
                  <Tag className="text-primary h-8 w-8" />
                  {voucher.code}
                </CardTitle>
                <CardDescription className="text-md mt-2">{voucher.description}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {isExpired ? (
                  <Badge variant="destructive" className="text-sm">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    Đã hết hạn
                  </Badge>
                ) : voucher.isActive ? (
                  <Badge variant="default" className="bg-green-500 text-sm text-white">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Đang hoạt động
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-sm">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    Không hoạt động
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold">Thống kê sử dụng</h3>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Lượt sử dụng</span>
                <span className="font-mono text-sm">
                  {voucher.usedCount} / {voucher.usageLimit}
                </span>
              </div>
              <Progress value={usagePercentage} className="w-full" />
              <p className="text-muted-foreground mt-2 text-sm">
                Mỗi người dùng có thể sử dụng tối đa <span className="font-bold">{voucher.userUsageLimit}</span> lần.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="border-b pb-2 text-lg font-semibold">Thông tin giảm giá</h3>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loại giảm giá:</span>
                  <Badge variant="outline">
                    {voucher.discountType === "percentage" ? "Phần trăm" : "Số tiền cố định"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mức giảm:</span>
                  <span className="text-primary font-semibold">
                    {voucher.discountType === "percentage"
                      ? `${voucher.discountValue}%`
                      : formatCurrency(voucher.discountValue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giảm tối đa:</span>
                  <span className="font-semibold">{formatCurrency(voucher.maxDiscountAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Đơn hàng tối thiểu:</span>
                  <span className="font-semibold">{formatCurrency(voucher.minOrderValue)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="border-b pb-2 text-lg font-semibold">Thời gian hiệu lực</h3>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Ngày bắt đầu:
                  </span>
                  <span className="font-semibold">{formatDate(voucher.startDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Ngày kết thúc:
                  </span>
                  <span className="font-semibold">{formatDate(voucher.endDate)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ngày tạo:</span>
                  <span className="">{new Date(voucher.createdAt).toLocaleString("vi-VN")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cập nhật lần cuối:</span>
                  <span className="">{new Date(voucher.updatedAt).toLocaleString("vi-VN")}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                navigate(`/admin/update-voucher/${voucher._id}`);
              }}
            >
              <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
            </Button>
            {voucher.isActive ? (
              <Button className="font-bold text-red-600 focus:text-red-600" onClick={() => handleUpdateStatus()}>
                <Edit className="mr-2 h-4 w-4" /> Inactive
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="font-bold text-green-600 focus:text-green-600"
                onClick={() => handleUpdateStatus()}
              >
                Active
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VoucherDetail;
