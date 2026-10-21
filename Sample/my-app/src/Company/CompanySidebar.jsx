import { NavLink, useNavigate } from "react-router-dom";

import { clearAuthSession } from "../auth";

const CompanySidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  return (
    <aside className="dashboard-sidebar">
      <h2>Company Panel</h2>
      <NavLink to="/company-dashboard">Dashboard</NavLink>
      <NavLink to="/company/analytics">Analytics</NavLink>
      <NavLink to="/profile">Profile</NavLink>
      <NavLink to="/company/post-internship">Post Internship</NavLink>
      <NavLink to="/company/student-resumes">Student Resumes</NavLink>
      <NavLink to="/company/shortlist">Shortlist Students</NavLink>
      <NavLink to="/company/feedback">Feedback Status</NavLink>
      <NavLink to="/company/chat">Messages</NavLink>
      <button className="btn-logout" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
};

export default CompanySidebar;
