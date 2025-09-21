import { createBrowserRouter } from "react-router-dom";

import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import StaffProtectedRoute from "@/components/StaffProtectedRoute";
import NotFoundPage from "@/features/ErrorPage/404";
import RootLayout from "@/layouts/RootLayout";

import adminRoutes from "./adminRoutes";
import protectedRoutes from "./protectedRoutes";
import publicRoutes from "./publicRoutes";
import staffRoutes from "./staffRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      ...publicRoutes,
      {
        element: <ProtectedRoute />,
        children: [...protectedRoutes],
      },
      {
        element: <AdminProtectedRoute />,
        children: [...adminRoutes],
      },
      {
        element: <StaffProtectedRoute />,
        children: [...staffRoutes],
      },
    ],

    errorElement: <NotFoundPage />,
  },
]);
export default router;
