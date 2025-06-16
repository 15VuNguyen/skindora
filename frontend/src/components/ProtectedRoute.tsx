import { Loader2 } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/contexts/auth.context";
import { logger } from "@/utils/logger";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="text-primary h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    logger.info("Unauthorized access attempt to protected route", {
      location: location.pathname,
    });
    return <Navigate to="/auth/login" replace state={{ from: location, reason: "unauthorized" }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
