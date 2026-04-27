import { useState } from "react";
import { loginUser } from "../api/auth.api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PATIENT");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();

    try {
      const response = await loginUser({ email, password, role });
      console.log("LOGIN RESPONSE:", response.data);
      login(response.data.token);
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f6fa",
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "30px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Login
        </h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            background: "#fff",
          }}
        >
          <option value="PATIENT">Patient</option>
          <option value="DOCTOR">Doctor</option>
        </select>

        <button
          type="button"
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "10px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Login
        </button>

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#2563eb" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
