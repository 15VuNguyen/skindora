// src/layouts/PrivateLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";

import AppSidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { HeaderProvider, useHeader } from "@/contexts/header.context";
import HeaderAdmin from "@/features/Admin/components/Header";

const LayoutContent = () => {
  const { headerName } = useHeader();

  return (
    <div className="flex min-h-screen bg-white">
      <SidebarProvider>
        <AppSidebar />
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

const AdminLayout: React.FC = () => {
  return (
    <HeaderProvider>
      <LayoutContent />
    </HeaderProvider>
  );
};

export default AdminLayout;
