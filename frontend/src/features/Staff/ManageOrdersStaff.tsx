import React, { useEffect } from "react";

import { Loader } from "@/components/ui/loader";
import { useHeader } from "@/contexts/header.context";
import { useFetchOrder } from "@/hooks/useFetchOrders";

import { orderColumn } from "../Admin/columns/ordersColumns";
import { PaginationDemo } from "../Admin/components/Pagination";
import { DataTable } from "../Admin/components/TableCustom";

const ManageOrdersStaff: React.FC = () => {
  const { setHeaderName } = useHeader();
  useEffect(() => {
    setHeaderName("Quản Lý Khách Hàng");
  }, []);
  const { fetchOrder, data, params, changePage, changeStatus, loading } = useFetchOrder();
  useEffect(() => {
    fetchOrder();
    console.log(data);
    console.log(params.page);
    console.log(params.limit);
  }, [params.page, params.status]);
  const handlePageChange = (page: number) => {
    changePage(page);
  };

  const filterOptions = [
    { value: "failed", label: "FAILED" as const },
    { value: "shipping", label: "SHIPPING" as const },
    { value: "delivered", label: "DELIVERED" as const },
    { value: "cancelled", label: "CANCELLED" as const },
    { value: "returned", label: "RETURNED" as const },
    { value: "processing", label: "PROCESSING" as const },
  ];

  return (
    <div>
      {loading ? (
        <div className="text-primary flex h-[300px] w-full items-center justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        <div>
          <div className="flex min-h-screen bg-white">
            <div className="flex-1">
              <div className="mx-auto bg-white px-8 py-15 pt-4">
                <div>
                  <DataTable
                    columns={orderColumn}
                    data={data}
                    filterColumnId="_id"
                    filterPlaceholder="Tìm khách hàng"
                    isHaveFilter={true}
                    filterOptions={filterOptions}
                    callBackFunction={changeStatus}
                  />
                </div>
                <div className="mt-4">
                  <PaginationDemo
                    totalPages={Number(params.totalPages) ?? 1}
                    currentPage={Number(params.page) ?? 1}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrdersStaff;
