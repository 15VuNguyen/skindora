import type { RouteObject } from "react-router-dom";

import ManageUsers from "@/features/Admin/ManageCustomer";
import ManageStatics from "@/features/Admin/ManageStatics";
import ProfileAdmin from "@/features/Admin/ProfileAdmin";
import ManageOrdersStaff from "@/features/Staff/ManageOrdersStaff";
import ManageProduct from "@/features/Staff/ManageProductStaff";
import StaffLayout from "@/layouts/staffLayout";

const staffRoutes: RouteObject[] = [
  {
    path: "/staff",
    element: <StaffLayout />,
    children: [
      { index: true, element: <ProfileAdmin /> },
      {
        path: "customers",
        element: <ManageUsers />,
      },
      {
        path: "products",
        element: <ManageProduct />,
      },
      {
        path: "orders",
        element: <ManageOrdersStaff />,
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

export default staffRoutes;
