import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

import PublicLayout from "@/layouts/publicLayout";

const CheckoutPage = lazy(() => import("@/features/Checkout"));

const CartPage = lazy(() => import("@/features/Cart"));
const ProfilePage = lazy(() => import("@/features/Profile"));
const TrackOrderPage = lazy(() => import("@/features/OrderTracking"));
const WishListPage = lazy(() => import("@/features/WishList"));
const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        path: "profile",
        children: [
          { index: true, element: <ProfilePage /> },
          { path: "wishlist", element: <WishListPage /> },
        ],
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "orders/tracking/:orderId",
        element: <TrackOrderPage />,
      },
    ],
  },
];

export default protectedRoutes;
