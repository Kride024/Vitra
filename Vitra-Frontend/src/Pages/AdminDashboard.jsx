import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: "720px", margin: "40px auto", padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome {user?.firstName}. You are logged in as <strong>{user?.role}</strong>.</p>
      <p>Use this area for admin-only functionality.</p>
      <button
        type="button"
        onClick={handleLogout}
        style={{
          marginTop: "16px",
          padding: "10px 14px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          background: "#dc2626",
          color: "#fff",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;
