import { NavLink, useNavigate } from "react-router-dom";

import { clearAuthSession } from "../auth";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  return (
    <aside className="dashboard-sidebar">
      <h2>Student Panel</h2>
      <NavLink to="/student-dashboard">Dashboard</NavLink>
      <NavLink to="/profile">Profile</NavLink>
      <NavLink to="/internship-list">Available Internships</NavLink>
      <NavLink to="/application-status">Applications</NavLink>
      <NavLink to="/messages">Messages</NavLink>
      <NavLink to="/resume-upload">Resume Upload</NavLink>
      <button className="btn-logout" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
