import React, { useEffect } from "react";

import { useHeader } from "@/contexts/header.context";

import ManageOrdersStaff from "../Staff/ManageOrdersStaff";

const ManageOrders: React.FC = () => {
  const { setHeaderName } = useHeader();
  useEffect(() => {
    setHeaderName("Quản Lý Sản phẩm");
  }, []);
  return (
    <div>
      <ManageOrdersStaff />
    </div>
  );
};

export default ManageOrders;
