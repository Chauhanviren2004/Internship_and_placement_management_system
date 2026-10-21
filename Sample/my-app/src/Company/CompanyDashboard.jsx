import { useEffect, useState } from "react";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import api, { getApiError } from "../api";
import CompanySidebar from "./CompanySidebar";

const CompanyDashboard = () => {
  const [state, setState] = useState({
    user: null,
    jobs: [],
    applications: [],
    messages: [],
    error: "",
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [userResponse, jobsResponse, applicationsResponse, messagesResponse] =
          await Promise.all([
            api.get("/users/me"),
            api.get("/jobs"),
            api.get("/applications/received"),
            api.get("/communications/messages"),
          ]);
        setState({
          user: userResponse.data,
          jobs: jobsResponse.data,
          applications: applicationsResponse.data,
          messages: messagesResponse.data,
          error: "",
        });
      } catch (requestError) {
        setState((current) => ({
          ...current,
          error: getApiError(requestError, "Unable to load company dashboard."),
        }));
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="dashboard-container">
      <CompanySidebar />
      <main className="dashboard-content">
        <div className="welcome-card">
          <h1>
            Welcome, {state.user?.profile?.company_name || state.user?.full_name || "ABC Company"}
          </h1>
          <p>Manage internships, student applications, feedback, and messages from one place.</p>
        </div>

        {state.error && <p className="resume-message error">{state.error}</p>}

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Internships</h3>
            <p>{state.jobs.length}</p>
          </div>
          <div className="stat-card">
            <h3>Applications Received</h3>
            <p>{state.applications.length}</p>
          </div>
          <div className="stat-card">
            <h3>Shortlisted</h3>
            <p>{state.applications.filter((item) => item.status === "shortlisted").length}</p>
          </div>
          <div className="stat-card">
            <h3>Messages</h3>
            <p>{state.messages.length}</p>
          </div>
        </div>

        <div className="chart-container" style={{ marginTop: '40px', padding: '20px', backgroundColor: 'var(--card-bg, #2c2f42)', borderRadius: '10px' }}>
          <h3 style={{ marginBottom: '20px' }}>Dashboard Overview</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={[
                  { name: "Total Jobs", value: state.jobs.length },
                  { name: "Applications", value: state.applications.length },
                  { name: "Shortlisted", value: state.applications.filter((item) => item.status === "shortlisted").length },
                  { name: "Messages", value: state.messages.length },
                ]}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" stroke="var(--text-color, #e0e0e0)" />
                <YAxis stroke="var(--text-color, #e0e0e0)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-color, #1f2230)', border: 'none', color: 'var(--text-color, #e0e0e0)' }} />
                <Bar dataKey="value" fill="#0dcaf0" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;
