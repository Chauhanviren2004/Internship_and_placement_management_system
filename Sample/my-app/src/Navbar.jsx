import { Link, useNavigate } from "react-router-dom";
import { clearAuthSession, dashboardPathForRole, useAuthState } from "./auth";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthState();

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  const dashboardPath = dashboardPathForRole(user?.role);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo-group">
          <div className="logo-icon"></div>
          <span className="logo-text">
            Intelliplace<span className="teal-text"></span>
          </span>
        </Link>

        <div className="nav-links">
          <Link to="/internship">Internships</Link>

          <Link to="/AiAssistant">AI- Assistant⚡</Link>
          {isAuthenticated && <Link to={dashboardPath}>Dashboard</Link>}
          <Link to="/feedback">Feedback</Link>
        </div>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span>{user.full_name}</span>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary">
              Sign In
            </Link>




          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
