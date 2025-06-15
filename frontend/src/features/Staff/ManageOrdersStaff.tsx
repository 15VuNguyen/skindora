import React, { useEffect } from "react";

import Typography from "@/components/Typography";
import { useHeader } from "@/contexts/header.context";
import { useFetchOrder } from "@/hooks/useFetchOrders";

import { orderColumn } from "../Admin/columns/ordersColumns";
import { DataTable } from "../Admin/components/TableCustom";

const ManageOrdersStaff: React.FC = () => {
  const { setHeaderName } = useHeader();
  useEffect(() => {
    setHeaderName("Quản Lý Khách Hàng");
  }, []);
  const { loading, fetchOrder, data, params, setParams } = useFetchOrder();
  useEffect(() => {
    fetchOrder();
  }, []);
  useEffect(() => console.log(data));
  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1">
        <div className="mx-auto bg-white px-8 py-15 pt-4">
          <div>
            <Typography className="text-2xl font-bold">Quản lý khách hàng</Typography>
          </div>
          <div>
            <DataTable columns={orderColumn} data={data} filterColumnId="_id" filterPlaceholder="Tìm khách hàng" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageOrdersStaff;
