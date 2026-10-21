import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api, { getApiError } from "./api";
import Navbar from "./Navbar";
import { getUser } from "./auth";

const InternshipPage = () => {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const user = getUser();

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const { data } = await api.get("/jobs/public");
        setJobs(data);
      } catch (requestError) {
        setError(getApiError(requestError, "Unable to load internships."));
      }
    };

    loadJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const search = query.toLowerCase();
    return (
      job.title.toLowerCase().includes(search) ||
      job.company_name.toLowerCase().includes(search) ||
      job.location.toLowerCase().includes(search)
    );
  });

  return (
    <>
      <Navbar />
      <div className="internship-page">
        <h1>Explore internships</h1>
        <input
          type="text"
          placeholder="Search by role, company, or location"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        {error && <p className="resume-message error">{error}</p>}

        <div className="internship-list">
          {filteredJobs.map((job) => (
            <div key={job.id} className="internship-card">
              <h3>{job.title}</h3>
              <p>{job.company_name}</p>
              <p>{job.location || "Location not provided"}</p>
              <p>{job.mode}</p>
              <p>{job.stipend || "Stipend not provided"}</p>
              <p>{job.description}</p>
              <Link to={user?.role === "student" ? "/internship-list" : "/login"}>
                {user?.role === "student" ? "Apply from dashboard" : "Sign in to apply"}
              </Link>
            </div>
          ))}
          {!error && filteredJobs.length === 0 && <p>No internships found.</p>}
        </div>
      </div>
    </>
  );
};

export default InternshipPage;
