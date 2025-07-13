import React from "react";
import { useEffect } from "react";

import { useHeader } from "@/contexts/header.context";

const ManageStatics: React.FC = () => {
  const { setHeaderName } = useHeader();
  useEffect(() => {
    setHeaderName("Quản Lý Doanh Thu");
  }, []);
  return <div className="flex min-h-screen bg-white"></div>;
};

export default ManageStatics;
