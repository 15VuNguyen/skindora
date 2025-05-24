import { createBrowserRouter } from "react-router-dom";

import RootLayout from "@/layouts/RootLayout";

import privateRoutes from "./adminRoutes";
import protectedRoutes from "./protectedRoutes";
import publicRoutes from "./publicRoutes";

const router = createBrowserRouter([
  { path: "/", element: <RootLayout />, children: [...publicRoutes, ...privateRoutes, ...protectedRoutes] },
]);
export default router;
