import { Navigate, Outlet } from "react-router-dom";

type roles = "user" | "admin" | "guest";
function ProtectedRoute({ allowedRoles = undefined }: { allowedRoles?: roles[] }): React.JSX.Element {
  const isAuthenticated = true;
  const userRoles: roles[] = ["user"];

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.some((role: roles) => userRoles.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
