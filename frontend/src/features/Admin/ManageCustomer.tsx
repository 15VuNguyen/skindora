import React, { useEffect } from "react";

import Typography from "@/components/Typography";
import { useHeader } from "@/contexts/header.context";
import { useFetchUser } from "@/hooks/useFetchUser";

import { userColumn } from "./columns/usersColums";
import { DataTable } from "./components/TableCustom";

const ManageCustomer: React.FC = () => {
  const { setHeaderName } = useHeader();

  const { fetchUser, data, params, setParams } = useFetchUser();
  useEffect(() => {
    setHeaderName("Quản Lý Khách Hàng");
  }, []);
  // useEffect(() => {
  //   fetchUser();
  //   console.log("Data is " + data);
  // }, []);

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1">
        <div className="mx-auto bg-white px-8 py-15 pt-4">
          <div>
            <Typography className="text-2xl font-bold">Danh sách khách hàng</Typography>
          </div>
          <div className="mt-8">
            <DataTable columns={userColumn} data={data} filterColumnId="username" filterPlaceholder="Tìm khách hàng" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCustomer;
