import { Loader2, Package, Star } from "lucide-react";
import React, { useEffect } from "react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useHeader } from "@/contexts/header.context";
import { useFetchOrderStatics } from "@/hooks/Orders/useFetchOrderStatis";
import { useFetchOrder } from "@/hooks/Orders/useFetchOrders";

import { orderColumn } from "../columns/ordersColumns";
import { PaginationDemo } from "../components/Pagination";
import type { FilterOptionsProps } from "../components/TableCustom";
import { DataTable } from "../components/TableCustom";

const ManageOrdersStaff: React.FC = () => {
  const { setHeaderName } = useHeader();
  const { fetchOrder, data, params, changePage, changeStatus, loading } = useFetchOrder();
  const { data: orderStatics, fetchOrder: fetchOrderStatics } = useFetchOrderStatics();
  useEffect(() => {
    setHeaderName("Quản Lý Đơn Hàng");
  }, [setHeaderName]);

  useEffect(() => {
    fetchOrder();
  }, [params.page, params.status, fetchOrder]);
  useEffect(() => {
    fetchOrderStatics();
  }, [fetchOrderStatics]);
  const handlePageChange = (page: number) => {
    changePage(page);
  };
  const filterOptions: FilterOptionsProps[] = [
    { value: "", status: "ALL" as const, label: "Tất cả" },
    { value: "pending", status: "PENDING" as const, label: "Đang chờ" },
    { value: "confirmed", status: "CONFIRMED" as const, label: "Đã đồng ý" },
    { value: "shipping", status: "SHIPPING" as const, label: "Đang giao" },
    { value: "delivered", status: "DELIVERED" as const, label: "Đã giao" },
    { value: "cancelled", status: "CANCELLED" as const, label: "Đã hủy" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-muted-foreground flex items-center gap-3">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <span className="text-xl font-semibold">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-5">
      <div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {/* Card: Tổng đơn hàng */}
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">Tổng Đơn Hàng</p>
                  <p className="text-3xl font-bold">{orderStatics?.total || 0}</p>
                </div>
                <Package className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          {/* Card: Đang chờ (Pending) */}
          <Card className="bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-100">Đang Chờ</p>
                  <p className="text-3xl font-bold">{orderStatics?.statusCounts.PENDING || 0}</p>
                </div>
                <Package className="h-8 w-8 text-gray-200" />
              </div>
            </CardContent>
          </Card>

          {/* Card: Đang giao (Shipping) */}
          <Card className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-cyan-100">Đang Giao</p>
                  <p className="text-3xl font-bold">{orderStatics?.statusCounts.SHIPPING || 0}</p>
                </div>
                <Star className="h-8 w-8 text-cyan-200" />
              </div>
            </CardContent>
          </Card>

          {/* Card: Đã giao (Delivered) */}
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-100">Đã Giao</p>
                  <p className="text-3xl font-bold">{orderStatics?.statusCounts.DELIVERED || 0}</p>
                </div>
                <Package className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          {/* Card: Bị trả lại (Returned) */}
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-100">Bị Trả Lại</p>
                  <p className="text-3xl font-bold">{orderStatics?.statusCounts.RETURNED || 0}</p>
                </div>
                <Package className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          {/* Card: Đã hủy (Cancelled) */}
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-100">Đã Hủy</p>
                  <p className="text-3xl font-bold">{orderStatics?.statusCounts.CANCELLED || 0}</p>
                </div>
                <Package className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Phần Bảng dữ liệu */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Danh sách Đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={orderColumn(fetchOrder)}
            data={data}
            status={params.status}
            isHaveFilter={true}
            filterOptions={filterOptions}
            callBackFunction={changeStatus}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <PaginationDemo
            totalPages={Number(params.totalPages) || 1}
            currentPage={Number(params.page) || 1}
            onPageChange={handlePageChange}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default ManageOrdersStaff;
