import { useEffect, useState } from "react";

import api, { getApiError } from "../api";
import Sidebar from "./Sidebar";

const InternshipList = () => {
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState({ error: "", loading: true, success: "" });
  const [coverLetters, setCoverLetters] = useState({});

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const { data } = await api.get("/jobs");
        setJobs(data);
        setStatus({ error: "", loading: false, success: "" });
      } catch (requestError) {
        setStatus({
          error: getApiError(requestError, "Unable to load internships."),
          loading: false,
          success: "",
        });
      }
    };

    loadJobs();
  }, []);

  const applyToJob = async (jobId) => {
    try {
      await api.post(`/applications/jobs/${jobId}`, {
        cover_letter: coverLetters[jobId] || "",
      });
      setStatus({ error: "", loading: false, success: "Application submitted successfully." });
    } catch (requestError) {
      setStatus({
        error: getApiError(requestError, "Unable to submit application."),
        loading: false,
        success: "",
      });
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-content">
        <h2>Available internships</h2>
        {status.error && <p className="resume-message error">{status.error}</p>}
        {status.success && <p className="resume-message success">{status.success}</p>}
        {status.loading ? (
          <p>Loading internships...</p>
        ) : (
          <div className="internship-cards">
            {jobs.map((job) => (
              <div className="internship-card" key={job.id}>
                <h3>{job.title}</h3>
                <p>{job.company_name}</p>
                <p>{job.location || "Location not provided"}</p>
                <p>{job.description}</p>
                <textarea
                  placeholder="Optional cover letter"
                  value={coverLetters[job.id] || ""}
                  onChange={(event) =>
                    setCoverLetters((current) => ({
                      ...current,
                      [job.id]: event.target.value,
                    }))
                  }
                />
                <button className="apply-btn" onClick={() => applyToJob(job.id)}>
                  Apply Now
                </button>
              </div>
            ))}
            {jobs.length === 0 && <p>No approved internships are available right now.</p>}
          </div>
        )}
      </main>
    </div>
  );
};

export default InternshipList;
