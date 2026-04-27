import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

function ProtectedRoute({ allowedRoles = [] }) {
  const { loading, isAuthenticated, hasRole } = useAuth();

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Checking session...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length && !hasRole(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
