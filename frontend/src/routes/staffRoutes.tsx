import type { RouteObject } from "react-router-dom";

import ProfilePage from "@/features/Admin/Profile/ProfileAdmin";
import ManageStatics from "@/features/Admin/Statics/ManageStatics";
import ManageOrdersStaff from "@/features/Staff/ManageOrdersStaff";
import ManageProduct from "@/features/Staff/ManageProductStaff";
import OrderDetailStaffPage from "@/features/Staff/OrderStaffDetail";
import ProductDetail from "@/features/Staff/Product/ProductDetailStaff";
import StaffLayout from "@/layouts/staffLayout";

const staffRoutes: RouteObject[] = [
  {
    path: "/staff",
    element: <StaffLayout />,
    children: [
      { index: true, element: <ProfilePage /> },
      {
        path: "products",
        element: <ManageProduct />,
      },
      {
        path: "orders",
        element: <ManageOrdersStaff />,
      },
      {
        path: ":orderId/order-detail",
        element: <OrderDetailStaffPage />,
      },
      {
        path: ":id/detail",
        element: <ProductDetail />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "statics",
        element: <ManageStatics />,
      },
    ],
  },
];

export default staffRoutes;
