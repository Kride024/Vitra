import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../auth/AuthContext.jsx";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <style>{`
        .common-navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 5%;
          background: #0f172a;
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .common-logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
          text-decoration: none;
        }
        .common-logo span {
          background: linear-gradient(to right, #2dd4bf, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .common-nav-links {
          display: flex;
          gap: 20px;
          list-style: none;
          margin: 0;
          align-items: center;
          padding: 0;
        }
        .common-nav-links a {
          color: #cbd5e1;
          text-decoration: none;
          font-size: 0.9rem;
          transition: 0.3s;
          white-space: nowrap;
        }
        .common-nav-links a:hover {
          color: #fff;
        }
        .common-login-btn {
          background: #3b82f6;
          color: #fff;
          padding: 8px 16px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.85rem;
          white-space: nowrap;
          transition: 0.3s;
        }
        .common-login-btn:hover {
          background: #2563eb;
        }
        .common-user-menu {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #1e293b;
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid #334155;
        }
        .common-user-name {
          background: transparent;
          border: none;
          color: #fff;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          padding: 0;
        }
        .common-user-name:hover {
          color: #93c5fd;
        }
        .common-logout-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: 0.3s;
        }
        .common-logout-btn:hover {
          color: #ef4444;
        }
        .mobile-bottom-nav {
          display: none;
        }
        @media (max-width: 768px) {
          main {
            padding-bottom: 76px;
          }
          .common-navbar {
            padding: 0.8rem 1rem;
          }
          .common-nav-links {
            display: none;
          }
          .common-logo {
            font-size: 1.3rem;
          }
          .common-user-menu {
            padding: 6px 10px;
            gap: 8px;
          }
          .common-user-name {
            font-size: 0.75rem;
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .common-login-btn {
            padding: 6px 12px;
            font-size: 0.8rem;
          }
          .mobile-bottom-nav {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1100;
            display: flex;
            justify-content: space-around;
            align-items: center;
            background: #0f172a;
            border-top: 1px solid rgba(255,255,255,0.12);
            padding: 10px 8px calc(10px + env(safe-area-inset-bottom));
          }
          .mobile-bottom-link {
            color: #cbd5e1;
            text-decoration: none;
            font-size: 0.72rem;
            font-weight: 600;
            letter-spacing: 0.01em;
          }
          .mobile-bottom-link:hover {
            color: #fff;
          }
        }
      `}</style>

      <nav className="common-navbar">
        <Link to="/" className="common-logo">Vri<span>tra</span></Link>
        <ul className="common-nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/resources">Resource</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        {user ? (
          <div className="common-user-menu">
            <button onClick={() => navigate("/personal")} className="common-user-name" title="Open personal page">
              Hello, {user.firstName}
            </button>
            <button onClick={handleLogout} className="common-logout-btn" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="common-login-btn">Login</Link>
        )}
      </nav>

      <nav className="mobile-bottom-nav" aria-label="Mobile quick navigation">
        <Link to="/" className="mobile-bottom-link">Home</Link>
        <Link to="/about" className="mobile-bottom-link">About</Link>
        <Link to="/services" className="mobile-bottom-link">Services</Link>
        <Link to="/resources" className="mobile-bottom-link">Resources</Link>
        <Link to="/contact" className="mobile-bottom-link">Contact</Link>
      </nav>
    </>
  );
}

export default Navbar;
