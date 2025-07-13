import {
  // For "Quản lý Product Type"
  Droplet,
  // For "Quản lý Skin Type" (distinct from 'Leaf' used for 'loại da')
  FileX2,
  // For "Quản lý đặc tính" (Features/Attributes)
  FlaskConical,
  Globe2,
  Home,
  // For "Quản lý Ingredient"
  Layers,
  Leaf,
  ListChecks,
  Package,
  Shield,
  ShoppingCart,
  // New icons for the updated items
  SlidersHorizontal,
  TicketPercent,
  User2,
  UsersRound,
} from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import logo from "@/assets/logo.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Hồ sơ", url: "/admin", icon: User2 },
  { title: "Tổng quan", url: "/admin/dashboard", icon: Home },
  { title: "Khách hàng", url: "/admin/customers", icon: UsersRound },
  // {
  //   title: "Thống kê",
  //   url: "/admin/statics",
  //   icon: BarChart4,
  // },
  {
    title: "Quản lý voucher",
    url: "/admin/voucher",
    icon: TicketPercent,
  },
  {
    title: "Quản lý đơn hủy",
    url: "/admin/cancel-request",
    icon: FileX2, // This icon is good for "cancel request"
  },
  { title: "Quản lý sản phẩm", url: "/admin/products", icon: Package },
  { title: "Quản lý đơn hàng", url: "/admin/orders", icon: ShoppingCart },
  { title: "Quản lý công dụng", url: "/admin/uses", icon: ListChecks },
  { title: "Quản lý xuất xứ", url: "/admin/origin", icon: Globe2 },
  {
    title: "Quản lý thương hiệu",
    url: "/admin/brand",
    icon: Shield,
  },
  {
    title: "Quản lý size",
    url: "/admin/size",
    icon: Leaf,
  },

  {
    title: "Quản lý đặc tính",
    url: "/admin/dac-tinh",
    icon: SlidersHorizontal,
  },
  {
    title: "Quản lý Ingredient",
    url: "/admin/ingredient",
    icon: FlaskConical,
  },
  {
    title: "Quản lý Product Type",
    url: "/admin/product-type",
    icon: Layers,
  },
  {
    title: "Quản lý loại da",
    url: "/admin/skin-type",
    icon: Droplet,
  },
];
const AppSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="py-10">
            <div className="p-2">
              <Link to="/" aria-label="Go to homepage">
                <img src={logo} alt="Skindora - Premium Skincare Products" title={"Skindora"} loading="eager" />
              </Link>
              <p className="mt-1 text-sm">Quản lý Dược Mỹ Phẩm</p>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-4 gap-1">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.url)}
                      className={`justify-start gap-3 border-0 bg-transparent ${isActive ? "bg-primary/20 text-primary" : ""} `}
                    >
                      <item.icon className="h-5 w-8" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
