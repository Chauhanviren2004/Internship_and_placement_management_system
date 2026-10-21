import { useEffect, useState } from "react";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import api, { getApiError } from "../api";
import CollegeSidebar from "./Collegesidebar";

const CollegeDashboard = () => {
  const [state, setState] = useState({
    jobs: [],
    applications: [],
    students: [],
    error: "",
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [jobsResponse, applicationsResponse, studentsResponse] = await Promise.all([
          api.get("/jobs"),
          api.get("/applications/received"),
          api.get("/users?role=student"),
        ]);
        setState({
          jobs: jobsResponse.data,
          applications: applicationsResponse.data,
          students: studentsResponse.data,
          error: "",
        });
      } catch (requestError) {
        setState((current) => ({
          ...current,
          error: getApiError(requestError, "Unable to load admin dashboard."),
        }));
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="college-container">
      <CollegeSidebar />
      <main className="college-main-content">
        <div className="dashboard-header">
          <h1>College Dashboard</h1>
        </div>
        {state.error && <p className="resume-message error">{state.error}</p>}
        <div className="dashboard-body">
          <div className="report-cards">
            <div className="report-card">
              <div className="report-info">
                <h3>Total Jobs</h3>
                <p>{state.jobs.length}</p>
              </div>
            </div>
            <div className="report-card">
              <div className="report-info">
                <h3>Pending Approvals</h3>
                <p>{state.jobs.filter((job) => job.status === "pending").length}</p>
              </div>
            </div>
            <div className="report-card">
              <div className="report-info">
                <h3>Applications</h3>
                <p>{state.applications.length}</p>
              </div>
            </div>
            <div className="report-card">
              <div className="report-info">
                <h3>Students</h3>
                <p>{state.students.length}</p>
              </div>
            </div>
          </div>

          <div className="chart-container" style={{ marginTop: '40px', padding: '20px', backgroundColor: 'var(--card-bg, #2c2f42)', borderRadius: '10px' }}>
            <h3 style={{ marginBottom: '20px' }}>Dashboard Overview</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={[
                    { name: "Total Jobs", value: state.jobs.length },
                    { name: "Pending Approvals", value: state.jobs.filter((job) => job.status === "pending").length },
                    { name: "Applications", value: state.applications.length },
                    { name: "Students", value: state.students.length },
                  ]}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" stroke="var(--text-color, #e0e0e0)" />
                  <YAxis stroke="var(--text-color, #e0e0e0)" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-color, #1f2230)', border: 'none', color: 'var(--text-color, #e0e0e0)' }} />
                  <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollegeDashboard;
