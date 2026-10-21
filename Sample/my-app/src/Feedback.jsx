import { useState } from "react";

import api, { getApiError } from "./api";
import Navbar from "./Navbar";
import { getUser } from "./auth";

const Feedback = () => {
  const user = getUser();
  const [form, setForm] = useState({
    name: user?.full_name || "",
    email: user?.email || "",
    type: "general",
    message: "",
    rating: "",
  });
  const [status, setStatus] = useState({ error: "", success: "", submitting: false });

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ error: "", success: "", submitting: true });

    try {
      const payload = {
        ...form,
        rating: form.rating ? Number(form.rating) : null,
      };
      if (user) {
        await api.post("/communications/feedback", payload);
      } else {
        await api.post("/communications/public-feedback", payload);
      }
      setStatus({ error: "", success: "Feedback submitted successfully.", submitting: false });
      setForm((current) => ({ ...current, message: "", rating: "" }));
    } catch (requestError) {
      setStatus({
        error: getApiError(requestError, "Unable to submit feedback."),
        success: "",
        submitting: false,
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2>Send feedback</h2>
        <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
          <input name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Your email" value={form.email} onChange={handleChange} required />
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="general">General feedback</option>
            <option value="internship">Internship issue</option>
            <option value="bug">Website bug</option>
          </select>
          <input
            name="rating"
            type="number"
            min="1"
            max="5"
            placeholder="Rating out of 5"
            value={form.rating}
            onChange={handleChange}
          />
          <textarea
            name="message"
            rows="4"
            placeholder="Write your feedback here"
            value={form.message}
            onChange={handleChange}
            required
          />
          {status.error && <p className="resume-message error">{status.error}</p>}
          {status.success && <p className="resume-message success">{status.success}</p>}
          <button type="submit" className="btn btn-info text-white" disabled={status.submitting}>
            {status.submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Feedback;
