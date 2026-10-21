import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import api, { getApiError } from "../api";
import CompanySidebar from "./CompanySidebar";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const CompanyAnalytics = () => {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        const [jobsResponse, applicationsResponse] = await Promise.all([
          api.get("/jobs"),
          api.get("/applications/received"),
        ]);
        const jobs = jobsResponse.data;
        const applications = applicationsResponse.data;
        
        setReport({
          totalJobs: jobs.length,
          activeJobs: jobs.filter(job => job.status === "approved").length,
          pendingJobs: jobs.filter(job => job.status === "pending").length,
          totalApplications: applications.length,
          shortlisted: applications.filter(item => item.status === "shortlisted").length,
          rejected: applications.filter(item => item.status === "rejected").length,
        });
      } catch (requestError) {
        setError(getApiError(requestError, "Unable to load analytics data."));
      }
    };

    loadReport();
  }, []);

  const chartData = report
    ? [
        { name: "Total Jobs", value: report.totalJobs },
        { name: "Active Jobs", value: report.activeJobs },
        { name: "Applications", value: report.totalApplications },
        { name: "Shortlisted", value: report.shortlisted },
        { name: "Rejected", value: report.rejected },
      ]
    : [];

  return (
    <div className="dashboard-container">
      <CompanySidebar />
      <main className="main-content">
        <div className="report-analysis">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2>Company Analytics</h2>
              <p>Monitor your internship posts and application metrics.</p>
            </div>
          </div>
          
          {error && <p className="resume-message error">{error}</p>}
          
          {report && (
            <div style={{ padding: '20px', borderRadius: '10px', marginTop: '20px' }} className="analytics-card">
              <div className="report-cards">
                <div className="report-card">
                  <div className="report-info">
                    <h3>Total Jobs Posted</h3>
                    <p>Total posts: {report.totalJobs}</p>
                    <span className="status completed">Completed</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${Math.min(report.totalJobs * 10, 100)}%` }} />
                  </div>
                </div>

                <div className="report-card">
                  <div className="report-info">
                    <h3>Active Jobs</h3>
                    <p>Approved posts: {report.activeJobs}</p>
                    <span className="status completed">Completed</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${Math.min(report.activeJobs * 10, 100)}%` }} />
                  </div>
                </div>

                <div className="report-card">
                  <div className="report-info">
                    <h3>Total Applications</h3>
                    <p>Received: {report.totalApplications}</p>
                    <span className="status pending">Pending</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${Math.min(report.totalApplications * 10, 100)}%` }} />
                  </div>
                </div>

                <div className="report-card">
                  <div className="report-info">
                    <h3>Shortlisted</h3>
                    <p>Total candidates: {report.shortlisted}</p>
                    <span className="status in-progress">In Progress</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${Math.min(report.shortlisted * 10, 100)}%` }} />
                  </div>
                </div>
              </div>

              <div className="chart-container" style={{ marginTop: '40px', textAlign: 'center', width: '100%', overflowX: 'auto' }}>
                <h3 style={{ marginBottom: '20px' }}>Metrics Overview</h3>
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '40px' }}>
                  <div>
                    <h4 style={{ marginBottom: '10px' }}>Histogram</h4>
                    <BarChart width={500} height={350} data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#4f46e5" radius={[5, 5, 0, 0]} isAnimationActive={false} />
                    </BarChart>
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '10px' }}>Distribution</h4>
                    <PieChart width={400} height={350}>
                      <Pie
                        data={chartData}
                        cx={200}
                        cy={150}
                        labelLine={false}
                        label={({ percent }) => percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                        isAnimationActive={false}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompanyAnalytics;
