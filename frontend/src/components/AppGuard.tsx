import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/contexts/auth.context";

const ADMIN_PATH = "/admin";
const STAFF_PATH = "/staff";

export const AppGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  let shouldRedirect = false;
  let redirectPath = "";

  if (!isLoading && isAuthenticated && user) {
    const isUserOnAdminPath = location.pathname.startsWith(ADMIN_PATH);
    const isUserOnStaffPath = location.pathname.startsWith(STAFF_PATH);

    if (user.role === "ADMIN" && !isUserOnAdminPath) {
      shouldRedirect = true;
      redirectPath = ADMIN_PATH;
    } else if (user.role === "STAFF" && !isUserOnStaffPath) {
      shouldRedirect = true;
      redirectPath = STAFF_PATH;
    }
  }
  useEffect(() => {
    if (shouldRedirect) {
      navigate(redirectPath, { replace: true });
    }
  }, [shouldRedirect, redirectPath, navigate]);
  if (isLoading || shouldRedirect) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="text-primary h-12 w-12 animate-spin" />
      </div>
    );
  }
  return <>{children}</>;
};
