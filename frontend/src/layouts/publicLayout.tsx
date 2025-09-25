import { Outlet } from "react-router-dom";

import Topbar from "@/features/Homepage/components/Topbar";

const PublicLayout = () => {
  return (
    <>
      <Topbar
        branding="Skindora"
        navItems={[
          { displayText: "Trang chủ", path: "" },
          { displayText: "Sản phẩm", path: "products" },
          { displayText: "Giới thiệu", path: "about" },
          { displayText: "Liên hệ", path: "contact" },
          { displayText: "Blog", path: "blog" },
        ]}
      />
      <Outlet />
    </>
  );
};
export default PublicLayout;
