import { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

import api, { getApiError } from "../api";
import CollegeSidebar from "./Collegesidebar";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ReportAnalysis = () => {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const reportRef = useRef(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const [jobsResponse, applicationsResponse, feedbackResponse] = await Promise.all([
          api.get("/jobs"),
          api.get("/applications/received"),
          api.get("/communications/feedback"),
        ]);
        const jobs = jobsResponse.data;
        const applications = applicationsResponse.data;
        const feedback = feedbackResponse.data;
        setReport(
          {
            approvedJobs: jobs.filter((job) => job.status === "approved").length,
            pendingJobs: jobs.filter((job) => job.status === "pending").length,
            totalApplications: applications.length,
            shortlisted: applications.filter((item) => item.status === "shortlisted").length,
            feedbackCount: feedback.length,
          });
      } catch (requestError) {
        setError(getApiError(requestError, "Unable to load report data."));
      }
    };

    loadReport();
  }, []);

  const handleDownloadPdf = () => {
    const element = reportRef.current;
    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: `college_report_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleExportCSV = () => {
    if (!report) return;
    const headers = "Metric,Value\n";
    const csvData = [
      `Approved Jobs,${report.approvedJobs}`,
      `Pending Jobs,${report.pendingJobs}`,
      `Applications,${report.totalApplications}`,
      `Shortlisted,${report.shortlisted}`,
      `Feedback,${report.feedbackCount}`
    ].join("\n");

    const blob = new Blob([headers + csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `college_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartData = report
    ? [
      { name: "Approved Jobs", value: report.approvedJobs },
      { name: "Pending Jobs", value: report.pendingJobs },
      { name: "Applications", value: report.totalApplications },
      { name: "Shortlisted", value: report.shortlisted },
      { name: "Feedback", value: report.feedbackCount },
    ]
    : [];

  return (
    <div className="dashboard-container">
      <CollegeSidebar />
      <main className="main-content">
        <div className="report-analysis">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2>Report Analysis</h2>
              <p>Monitor approvals, applications, and platform activity from one place.</p>
            </div>
            {report && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleExportCSV}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Export to Excel
                </button>
                <button
                  onClick={handleDownloadPdf}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Download PDF Report
                </button>
              </div>
            )}
          </div>

          {error && <p className="resume-message error">{error}</p>}

          {report && (
            <div ref={reportRef} style={{ padding: '20px', backgroundColor: 'var(--bg-primary)', borderRadius: '10px', marginTop: '20px' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h2 style={{ display: 'none' }} className="pdf-title">Intelliplace College Report</h2>
                <p style={{ display: 'none' }} className="pdf-date">Generated on: {new Date().toLocaleDateString()}</p>
              </div>

              <div className="report-cards">
                <div className="report-card">
                  <div className="report-info">
                    <h3>Approved Jobs</h3>
                    <p>Total approved internships: {report.approvedJobs}</p>
                    <span className="status completed">Completed</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${Math.min(report.approvedJobs * 10, 100)}%` }} />
                  </div>
                </div>

                <div className="report-card">
                  <div className="report-info">
                    <h3>Pending Jobs</h3>
                    <p>Pending approvals: {report.pendingJobs}</p>
                    <span className="status pending">Pending</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${Math.min(report.pendingJobs * 10, 100)}%` }} />
                  </div>
                </div>

                <div className="report-card">
                  <div className="report-info">
                    <h3>Applications</h3>
                    <p>Total submitted applications: {report.totalApplications}</p>
                    <span className="status completed">Completed</span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{ width: `${Math.min(report.totalApplications * 10, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="report-card">
                  <div className="report-info">
                    <h3>Shortlisted</h3>
                    <p>Total shortlisted candidates: {report.shortlisted}</p>
                    <span className="status in-progress">In Progress</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${Math.min(report.shortlisted * 10, 100)}%` }} />
                  </div>
                </div>

                <div className="report-card">
                  <div className="report-info">
                    <h3>Feedback Entries</h3>
                    <p>Total feedback records: {report.feedbackCount}</p>
                    <span className="status completed">Completed</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${Math.min(report.feedbackCount * 10, 100)}%` }} />
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
      <style>{`
        /* CSS to show title only in PDF */
        @media print {
          .pdf-title, .pdf-date {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportAnalysis;
