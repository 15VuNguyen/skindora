// src/layouts/PrivateLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";

import AppSidebar from "@/components/Sidebar";
import StaffSidebar from "@/components/StaffSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth.context";
import { HeaderProvider, useHeader } from "@/contexts/header.context";
import HeaderAdmin from "@/features/Admin/components/Header";
import { Loader } from "@/features/Admin/components/Loader";
import NotFoundPage from "@/features/ErrorPage/404";

const LayoutContent = () => {
  const { headerName } = useHeader();

  return (
    <div className="flex min-h-screen bg-white">
      <SidebarProvider>
        <StaffSidebar />
        <div className="flex-1">
          <div className="relative">
            <HeaderAdmin name={headerName} />
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
