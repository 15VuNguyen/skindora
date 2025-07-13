import { ChevronLeft, FileText, Loader2, Truck, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFetchOrderByID } from "@/hooks/Orders/useFetchOrderByID";
import { useUpdateStatus } from "@/hooks/Orders/useUpdateStatus";
import type { User } from "@/types/order";

const OrderDetailStaffPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { loading, data, FetchProductByID } = useFetchOrderByID(String(orderId));
  const { updateStatus } = useUpdateStatus(String(orderId));

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);

  const handleUpdateStatus = () => {
    updateStatus();
    window.location.reload();
  };

  const handleShowCustomerDetails = (user: User) => {
    setSelectedCustomer(user);
    setIsCustomerModalOpen(true);
  };

  useEffect(() => {
    FetchProductByID();
  }, [FetchProductByID]);

  if (loading || !data || !data.order || !data.orderDetail) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <span className="text-lg">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  const { order, orderDetail } = data;

  const variant =
    order.Status === "DELIVERED"
      ? "complete"
      : order.Status === "CANCELLED"
        ? "danger"
        : order.Status === "RETURNED"
          ? "default"
          : order.Status === "SHIPPING"
            ? "waiting"
            : "secondary";

  return (
    <div className="bg-muted/40 flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {/* Header */}
          <div className="mx-auto grid w-full max-w-6xl flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => navigate("/staff/orders")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h1 className="flex-1 shrink-0 text-xl font-semibold tracking-tight whitespace-nowrap sm:grow-0">
                Chi tiết đơn hàng
              </h1>

              <Badge variant={variant}>{order.Status}</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle>Đơn hàng #{order._id.slice(-6).toUpperCase()}</CardTitle>
                    <CardDescription>
                      Ngày yêu cầu: {new Date(order.RequireDate).toLocaleDateString("vi-VN")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <FileText className="text-muted-foreground h-6 w-6" />
                      <div>
                        <p className="font-medium">Mô tả / Ghi chú</p>
                        <p className="text-muted-foreground text-sm">{order.Description || "Không có ghi chú."}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin giao hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      <UserIcon className="text-muted-foreground h-6 w-6 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Khách hàng</p>
                        <p className="text-muted-foreground text-sm">
                          {order.User.first_name} {order.User.last_name} (ID: {order.User._id})
                        </p>

                        <Button
                          variant="link"
                          className="h-auto p-0 text-sm"
                          onClick={() => handleShowCustomerDetails(order.User)}
                        >
                          Xem chi tiết khách hàng
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Truck className="text-muted-foreground h-6 w-6 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Địa chỉ giao hàng</p>
                        <p className="text-muted-foreground text-sm">{order.ShipAddress}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sản phẩm trong đơn hàng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {orderDetail.map((item: any) => (
                        <div key={item._id} className="flex items-center gap-4">
                          <img
                            src={item.Products.image}
                            alt={item.Products.name}
                            className="aspect-square rounded-md object-cover"
                            width={64}
                            height={64}
                          />
                          <div className="grid gap-1">
                            <p className="font-medium">{item.Products.name}</p>
                            <p className="text-muted-foreground text-sm">
                              Số lượng: {item.Quantity} x{" "}
                              {parseInt(item.UnitPrice).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </p>
                          </div>
                          <div className="ml-auto font-medium">
                            {(parseInt(item.Quantity) * parseInt(item.UnitPrice)).toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center justify-between border-t pt-4 font-semibold">
                        <span>Tổng cộng:</span>
                        <span>
                          {parseInt(order.TotalPrice).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {order.CancelRequest && (
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle>Yêu cầu hủy đơn hàng</CardTitle>
                      <CardDescription>
                        Trạng thái:{" "}
                        <Badge variant={order.CancelRequest.status === "APPROVED" ? "complete" : "danger"}>
                          {order.CancelRequest.status}
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-4">
                        <FileText className="text-muted-foreground h-6 w-6 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Lý do hủy</p>
                          <p className="text-muted-foreground text-sm">{order.CancelRequest.reason}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <UserIcon className="text-muted-foreground h-6 w-6 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Được yêu cầu bởi nhân viên</p>
                          <p className="text-muted-foreground text-sm">{order.CancelRequest.staffId}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <FileText className="text-muted-foreground h-6 w-6 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Thời gian yêu cầu</p>
                          <p className="text-muted-foreground text-sm">
                            {new Date(order.CancelRequest.requestedAt).toLocaleString("vi-VN")}
                          </p>
                        </div>
                      </div>
                      {order.CancelRequest.approvedAt && (
                        <div className="flex items-start gap-4">
                          <FileText className="text-muted-foreground h-6 w-6 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Thời gian chấp thuận</p>
                            <p className="text-muted-foreground text-sm">
                              {new Date(order.CancelRequest.approvedAt).toLocaleString("vi-VN")}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Hành động</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={handleUpdateStatus}
                        disabled={["FAILED", "RETURNED", "CANCELLED"].includes(order.Status)}
                      >
                        <span>Thay đổi trạng thái</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button variant="outline" size="sm" className="w-full">
                Hủy
              </Button>
              <Button size="sm" className="w-full">
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={isCustomerModalOpen} onOpenChange={setIsCustomerModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết khách hàng</DialogTitle>
            <DialogDescription>Thông tin chi tiết về khách hàng này.</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium">ID:</span>
                <span className="col-span-3">{selectedCustomer._id}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium">Tên:</span>
                <span className="col-span-3">
                  {selectedCustomer.first_name} {selectedCustomer.last_name}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium">Email:</span>
                <span className="col-span-3">{selectedCustomer.email}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium">Username:</span>
                <span className="col-span-3">{selectedCustomer.username}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium">Số điện thoại:</span>
                <span className="col-span-3">{selectedCustomer.phone_number || "Không có"}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium">Địa chỉ:</span>
                <span className="col-span-3">{selectedCustomer.location || "Không có"}</span>
              </div>
              {selectedCustomer.avatar && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-right font-medium">Ảnh đại diện:</span>
                  <div className="col-span-3">
                    <img src={selectedCustomer.avatar} alt="Avatar" className="h-16 w-16 rounded-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderDetailStaffPage;
