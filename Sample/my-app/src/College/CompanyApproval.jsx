import { useEffect, useState } from "react";
// import { useEffect,useState } from "react";

import api, { getApiError } from "../api";
import CollegeSidebar from "./Collegesidebar";

const CompanyApproval = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  const loadJobs = async () => {
    try {
      const { data } = await api.get("/jobs");
      setJobs(data);
      setError("");
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to load job approvals."));
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const updateStatus = async (jobId, status) => {
    try {
      await api.patch(`/jobs/${jobId}/status`, { status });
      await loadJobs();
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to update job status."));
    }
  };

  return (
    <div className="dashboard-container">
      <CollegeSidebar />
      <main className="main-content">
        <div className="company-approval-container">
          <h2>Company Approval</h2>
          {error && <p className="resume-message error">{error}</p>}
          <table className="company-approval-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.company_name}</td>
                  <td>{job.title}</td>
                  <td>
                    <span className={`status-badge ${job.status}`}>{job.status}</span>
                  </td>
                  <td>
                    <button className="btn-approve" onClick={() => updateStatus(job.id, "approved")}>
                      Approve
                    </button>
                    <button className="btn-reject" onClick={() => updateStatus(job.id, "rejected")}>
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default CompanyApproval;
