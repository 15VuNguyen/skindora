import type { RouteObject } from "react-router-dom";

import Admin from "@/features/Admin";
import ManageUsers from "@/features/Admin/ManageCustomer";
import ManageOrders from "@/features/Admin/ManageOrders";
import ManageProducts from "@/features/Admin/ManageProduct";
import ManageStatics from "@/features/Admin/ManageStatics";
import ProfileAdmin from "@/features/Admin/ProfileAdmin";
import AdminLayout from "@/layouts/adminLayout";

const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Admin /> },
      {
        path: "customers",
        element: <ManageUsers />,
      },
      {
        path: "products",
        element: <ManageProducts />,
      },
      {
        path: "orders",
        element: <ManageOrders />,
      },
      {
        path: "profile",
        element: <ProfileAdmin />,
      },
      {
        path: "statics",
        element: <ManageStatics />,
      },
    ],
  },
];

export default adminRoutes;
