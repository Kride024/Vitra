import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

function PersonalRoute() {
  const { user } = useAuth();

  if (user?.role === "DOCTOR") {
    return <Navigate to="/doctor" replace />;
  }

  return <Navigate to="/patient" replace />;
}

export default PersonalRoute;
