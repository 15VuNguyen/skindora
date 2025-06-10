import React, { useEffect } from "react";

import { useHeader } from "@/contexts/header.context";
import AppTable from "@/features/Admin/components/Table";

import TableCustomer from "./components/TableCustomer";

const ManageCustomer: React.FC = () => {
  const { setHeaderName } = useHeader();
  useEffect(() => {
    setHeaderName("Quản Lý Khách Hàng");
  }, []);
  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1">
        <div className="mx-auto bg-white px-8 py-15 pt-4">
          {/* <div>
            <Typography className="text-2xl font-bold">Quản lý khách hàng</Typography>
          </div> */}
          <div className="mt-8">
            <TableCustomer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCustomer;
