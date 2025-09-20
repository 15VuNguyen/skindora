import type { RouteObject } from "react-router-dom";

import CreatePost from "@/features/Admin/Post/CreatePost";
import ManagePosts from "@/features/Admin/Post/ManagePost";
import PostDetail from "@/features/Admin/Post/PostDetail";
import ProfilePage from "@/features/Admin/Profile/ProfileAdmin";
import ProfileStaffPage from "@/features/Admin/Profile/ProfileStaff";
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
      { index: true, element: <ProfileStaffPage /> },
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
      {
        path: "posts",
        element: <ManagePosts userRole={"STAFF"} />,
      },
      {
        path: "posts/create",
        element: <CreatePost />,
      },
      {
        path: "posts/:slug/:id",
        element: <PostDetail />,
      },
    ],
  },
];

export default staffRoutes;
