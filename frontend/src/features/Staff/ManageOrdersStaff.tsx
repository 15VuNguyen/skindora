import { Loader2, Package, Star } from "lucide-react";
import React, { useEffect } from "react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useHeader } from "@/contexts/header.context";
import { useFetchOrderStatics } from "@/hooks/Orders/useFetchOrderStatis";
import { useFetchOrder } from "@/hooks/Orders/useFetchOrders";

import { PaginationDemo } from "../Admin/components/Pagination";
import type { FilterOptionsProps } from "../Admin/components/TableCustom";
import { DataTable } from "../Admin/components/TableCustom";
import { orderColumn } from "./orderStaffColumn";

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
    <div className="flex flex-col gap-6">
      <div>
        <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">Tổng đơn hàng</p>
                  <p className="text-3xl font-bold">{orderStatics?.total}</p>
                </div>
                <Package className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
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
        </div>
      </div>

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
