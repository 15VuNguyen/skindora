// src/pages/Admin/Admin.tsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import Typography from "@/components/Typography";
import { useHeader } from "@/contexts/header.context";

import ManageOrdersStaff from "./Order/ManageOrders";
// import ManageOrdersStaff from "../Staff/ManageOrdersStaff";
import { CardIcon } from "./components/CardIcon";

const Admin: React.FC = () => {
  const { setHeaderName, headerName } = useHeader();
  useEffect(() => {
    setHeaderName("Tổng quan");
  }, []);

  return (
    <div className="w-full gap-4 bg-gray-50 px-6 py-8">
      <Typography className="text-2xl font-bold">{headerName}</Typography>
      <div>
        <div className="w-full">
          <div className="mb-3 flex justify-between">
           
          </div>
          <div>
            <ManageOrdersStaff />
          </div>
        </div>
      </div>
      <div className="w-full gap-4 py-6">
        <div className="mb-4">
          <Typography className="text-lg font-medium">Truy cập nhanh</Typography>
        </div>
        <div className="mb-4 flex gap-4">
          <Link to="/admin/customers" className="w-full">
            <CardIcon icon="👥" title="Khách hàng" />
          </Link>
          <Link to="/admin/products" className="w-full">
            <CardIcon icon="📦" title="Sản phẩm" />
          </Link>
          <Link to="/admin/orders" className="w-full">
            <CardIcon icon="🛒" title="Đơn hàng" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Admin;
