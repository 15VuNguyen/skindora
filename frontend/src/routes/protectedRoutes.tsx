import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const ProfilePage = lazy(() => import("@/features/Profile"));

const protectedRoutes: RouteObject[] = [
  {
    path: "profile",
    element: <ProfilePage />,
  },
];

export default protectedRoutes;
