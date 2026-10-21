import { NavLink, useNavigate } from "react-router-dom";
import { clearAuthSession } from "../auth";

const CollegeSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  return (
    <aside className="college-sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/admin-dashboard">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/company-approval">Company Approval</NavLink>
        </li>
        <li>
          <NavLink to="/student-management">Student Management</NavLink>
        </li>
        <li>
          <NavLink to="/report-analysis">Report Analysis</NavLink>
        </li>
        <li>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default CollegeSidebar;
