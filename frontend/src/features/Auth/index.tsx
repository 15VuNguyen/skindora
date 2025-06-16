import { ArrowLeft } from "lucide-react";
import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { LoginForm } from "./components/Forms/Login";
import { RegisterForm } from "./components/Forms/SignUp";
import { useAuthSwitcher } from "./hooks/useAuthSwitcher";

export default function AuthPage() {
  const LeftPanelVariant = useAuthSwitcher();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.state?.reason === "unauthorized") {
      toast.error("Access Denied", {
        description: "Please log in to view that page.",
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);
  let FormComponentToRender: React.JSX.Element | null = null;

  if (location.pathname === "/auth/login") {
    FormComponentToRender = <LoginForm />;
  } else if (location.pathname === "/auth/register") {
    FormComponentToRender = <RegisterForm />;
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
          Back to Home
        </Button>
      </Link>
    </div>
  );
};
