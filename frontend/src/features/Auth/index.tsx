import { ArrowLeft } from "lucide-react";
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { LoginForm } from "./components/Forms/Login";
import { RequestResetForm } from "./components/Forms/RequestResetForm";
import { ResetPasswordForm } from "./components/Forms/ResetPasswordForm";
import { RegisterForm } from "./components/Forms/SignUp";
import { useAuthSwitcher } from "./hooks/useAuthSwitcher";

export default function AuthPage() {
  const LeftPanelVariant = useAuthSwitcher();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.reason === "unauthorized") {
      toast.error("Truy cập bị từ chối", {
        description: "Vui lòng đăng nhập để xem trang này.",
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  let FormComponentToRender: React.JSX.Element | null = null;

  if (location.pathname === "/auth/login") {
    FormComponentToRender = <LoginForm />;
  } else if (location.pathname === "/auth/register") {
    FormComponentToRender = <RegisterForm />;
  } else if (location.pathname === "/auth/forgot-password") {
    FormComponentToRender = <RequestResetForm />;
  } else if (location.pathname === "/auth/reset-password") {
    FormComponentToRender = <ResetPasswordForm />;
  }

  return (
    <div className="bg-background relative flex min-h-screen">
      <ReturnHomeButton />
      {LeftPanelVariant}
      <div className="relative flex w-full flex-col items-center justify-center p-4 sm:p-8 lg:w-1/2">
        <ReturnHomeButton className="hidden" />
        {FormComponentToRender}
      </div>
    </div>
  );
}

const ReturnHomeButton = ({ className = "" }): React.JSX.Element => {
  return (
    <div className={cn("group absolute top-4 left-4 z-10", className)}>
      <Link to="/">
        <Button variant="ghost" className="text-primary hover:bg-primary lg:text-white lg:hover:bg-white/20">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Về trang chủ
        </Button>
      </Link>
    </div>
  );
};
