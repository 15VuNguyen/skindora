import React, { useEffect } from "react";

import Typography from "@/components/Typography";
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
  const { loading, fetchOrder, data, params, setParams, changePage } = useFetchOrder();
  useEffect(() => {
    fetchOrder();
    console.log(data);
    console.log(params.page);
    console.log(params.limit);
  }, [params.page]);
  const handlePageChange = (page: number) => {
    changePage(page);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1">
        <div className="mx-auto bg-white px-8 py-15 pt-4">
          <div>
            <DataTable columns={orderColumn} data={data} filterColumnId="_id" filterPlaceholder="Tìm khách hàng" />
          </div>
          <div className="mt-4">
            <PaginationDemo
              totalPages={params.totalPages ?? 1}
              currentPage={params.page ?? 1}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageOrdersStaff;
