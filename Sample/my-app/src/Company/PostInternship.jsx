import { useEffect, useState } from "react";

import api, { getApiError } from "../api";
import CompanySidebar from "./CompanySidebar";

const initialForm = {
  title: "",
  location: "",
  mode: "remote",
  duration: "",
  stipend: "",
  eligibility: "",
  openings: 1,
  deadline: "",
  description: "",
};

const PostInternship = () => {
  const [formData, setFormData] = useState(initialForm);
  const [internships, setInternships] = useState([]);
  const [status, setStatus] = useState({ error: "", success: "" });

  const loadInternships = async () => {
    try {
      const { data } = await api.get("/jobs");
      setInternships(data);
    } catch (requestError) {
      setStatus({
        error: getApiError(requestError, "Unable to load internships."),
        success: "",
      });
    }
  };

  useEffect(() => {
    loadInternships();
  }, []);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post("/jobs", {
        ...formData,
        openings: Number(formData.openings),
        deadline: formData.deadline || null,
      });
      setStatus({
        error: "",
        success: "Internship posted. It will appear after admin approval.",
      });
      setFormData(initialForm);
      await loadInternships();
    } catch (requestError) {
      setStatus({
        error: getApiError(requestError, "Unable to post internship."),
        success: "",
      });
    }
  };

  return (
    <div className="dashboard-container">
      <CompanySidebar />
      <main className="main-content">
        <div className="post-internship-container">
          <h2>Post Internship</h2>
          <form className="internship-form" onSubmit={handleSubmit}>
            <input name="title" placeholder="Role title" value={formData.title} onChange={handleChange} required />
            <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
            <select name="mode" value={formData.mode} onChange={handleChange}>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">Onsite</option>
            </select>
            <input name="duration" placeholder="Duration" value={formData.duration} onChange={handleChange} />
            <input name="stipend" placeholder="Stipend" value={formData.stipend} onChange={handleChange} />
            <input
              name="eligibility"
              placeholder="Eligibility"
              value={formData.eligibility}
              onChange={handleChange}
            />
            <input
              name="openings"
              type="number"
              min="1"
              placeholder="Openings"
              value={formData.openings}
              onChange={handleChange}
            />
            <input name="deadline" type="date" value={formData.deadline} onChange={handleChange} />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
            />

            {status.error && <p className="resume-message error">{status.error}</p>}
            {status.success && <p className="resume-message success">{status.success}</p>}

            <button type="submit" className="submit-btn">
              Post Internship
            </button>
          </form>

          <div className="internship-list">
            <h3>Posted Internships</h3>
            {internships.length === 0 && <p>No internships posted yet.</p>}
            {internships.map((internship) => (
              <div key={internship.id} className="internship-card">
                <h4>{internship.title}</h4>
                <p>
                  <strong>Location:</strong> {internship.location || "Not specified"}
                </p>
                <p>
                  <strong>Mode:</strong> {internship.mode || "Not specified"}
                </p>
                <p>
                  <strong>Stipend:</strong> {internship.stipend || "Not specified"}
                </p>
                <p>
                  <strong>Status:</strong> {internship.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostInternship;
