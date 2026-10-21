import { useEffect, useState } from "react";

import api from "../api";
import Sidebar from "./Sidebar";

const StudentDashboard = () => {
  const [state, setState] = useState({
    studentName: "Student",
    jobs: [],
    applications: [],
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [userResponse, jobsResponse, applicationsResponse] = await Promise.all([
          api.get("/users/me"),
          api.get("/jobs/public"),
          api.get("/applications/mine"),
        ]);
        setState({
          studentName: userResponse.data.full_name || "Student",
          jobs: jobsResponse.data,
          applications: applicationsResponse.data,
        });
      } catch {
        setState({
          studentName: "Student",
          jobs: [],
          applications: [],
        });
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <div className="welcome-card">
          <h1>Welcome, {state.studentName}</h1>
          <p>Track your profile, internship applications, and ongoing conversations.</p>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Approved Internships</h3>
            <p>{state.jobs.length}</p>
          </div>
          <div className="stat-card">
            <h3>Applications Sent</h3>
            <p>{state.applications.length}</p>
          </div>
          <div className="stat-card">
            <h3>Shortlisted</h3>
            <p>{state.applications.filter((item) => item.status === "shortlisted").length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
