// src/layouts/PrivateLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";

import StaffSidebar from "@/components/StaffSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { HeaderProvider, useHeader } from "@/contexts/header.context";
import HeaderStaff from "@/features/Admin/components/HeaderStaff";

const LayoutContent = () => {
  const { headerName } = useHeader();
  return (
    <div className="flex min-h-screen bg-white">
      <SidebarProvider>
        <StaffSidebar />
        <div className="flex-1">
          <div className="relative">
            <HeaderStaff name={headerName} />
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

const StaffLayout: React.FC = () => {
  return (
    <HeaderProvider>
      <LayoutContent />
    </HeaderProvider>
  );
};

export default StaffLayout;
