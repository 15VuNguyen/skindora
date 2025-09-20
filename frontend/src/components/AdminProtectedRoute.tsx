import { Loader2 } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/contexts/auth.context";
import { logger } from "@/utils/logger";

const AdminProtectedRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="text-primary h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    logger.info("Unauthorized access attempt to admin route", {
      location: location.pathname,
    });
    return <Navigate to="/auth/login" replace state={{ from: location, reason: "unauthorized" }} />;
  }

  if (user?.role !== "ADMIN") {
    logger.info("Forbidden access attempt to admin route", {
      location: location.pathname,
      userRole: user?.role,
    });
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-red-600">403</h1>
          <h2 className="mb-2 text-2xl font-semibold">Truy cập bị từ chối</h2>
          <p className="text-muted-foreground mb-4">Bạn không có quyền truy cập vào trang quản trị này.</p>
          <p className="text-muted-foreground">Chỉ có quản trị viên mới có thể truy cập trang này.</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
