import React from "react";
import { useLocation } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

export function useAuthSwitcher(): React.JSX.Element | null {
  const location = useLocation();
  const { pathname } = location;

  if (pathname === "/auth/login") {
    return <LoginPage />;
  }

  if (pathname === "/auth/register") {
    return <RegisterPage />;
  }
  if (pathname === "/auth/forgot-password") {
    return <ForgotPasswordPage />;
  }
  if (pathname === "/auth/reset-password") {
    return <ResetPasswordPage />;
  }
  return null;
}
