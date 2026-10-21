import { useEffect, useState } from "react";

import api, { getApiError } from "../api";
import CompanySidebar from "./CompanySidebar";

function ShortlistStudents() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  const loadApplications = async () => {
    try {
      const { data } = await api.get("/applications/received");
      setApplications(data);
      setError("");
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to load applications."));
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const updateStatus = async (applicationId, status) => {
    try {
      await api.patch(`/applications/${applicationId}/status`, { status });
      await loadApplications();
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to update application status."));
    }
  };

  return (
    <div className="dashboard-container">
      <CompanySidebar />
      <main className="main-content">
        <h2>Shortlist Students</h2>
        {error && <p className="resume-message error">{error}</p>}
        <div className="cards-container">
          {applications.map((application) => (
            <div className="student-card" key={application.id}>
              <h3>{application.student_name}</h3>
              <p>{application.student_email}</p>
              <p>{application.job_title}</p>
              <p>
                Status: <span className={`status ${application.status}`}>{application.status}</span>
              </p>
              {application.resume_url && (
                <a className="resume-link" href={application.resume_url} target="_blank" rel="noreferrer">
                  View Resume
                </a>
              )}
              <div className="buttons">
                <button className="approve" onClick={() => updateStatus(application.id, "shortlisted")}>
                  Shortlist
                </button>
                <button className="reject" onClick={() => updateStatus(application.id, "rejected")}>
                  Reject
                </button>
              </div>
            </div>
          ))}
          {applications.length === 0 && <p>No applications received yet.</p>}
        </div>
      </main>
    </div>
  );
}

export default ShortlistStudents;
