import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        const isExpired = decoded?.exp && decoded.exp * 1000 < Date.now();

        if (isExpired) {
          localStorage.removeItem("token");
        } else {
          setUser(decoded);
          setToken(storedToken);
        }
      } catch {
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
      }
    }

    setLoading(false);
  }, []);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);

    const decoded = jwtDecode(newToken);
    setUser(decoded);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = Boolean(user && token);
  const hasRole = (roles = []) => {
    if (!user?.role) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, token, isAuthenticated, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
