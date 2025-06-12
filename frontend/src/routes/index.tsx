import { createBrowserRouter } from "react-router-dom";

import NotFoundPage from "@/features/ErrorPage/404";
import RootLayout from "@/layouts/RootLayout";

import privateRoutes from "./adminRoutes";
import adminRoutes from "./adminRoutes";
import protectedRoutes from "./protectedRoutes";
import publicRoutes from "./publicRoutes";
import staffRoutes from "./staffRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [...publicRoutes, ...privateRoutes, ...protectedRoutes, ...adminRoutes, ...staffRoutes],
    errorElement: <NotFoundPage />,
  },
]);
export default router;
