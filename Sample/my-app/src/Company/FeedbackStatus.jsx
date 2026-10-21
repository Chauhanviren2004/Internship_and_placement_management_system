import { useEffect, useState } from "react";

import api, { getApiError } from "../api";
import CompanySidebar from "./CompanySidebar";

function FeedbackStatus() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState({ error: "", success: "" });

  const loadData = async () => {
    try {
      const [feedbackResponse, applicationResponse] = await Promise.all([
        api.get("/communications/feedback"),
        api.get("/applications/received"),
      ]);
      setFeedbacks(feedbackResponse.data);
      setApplications(applicationResponse.data);
    } catch (requestError) {
      setStatus({
        error: getApiError(requestError, "Unable to load feedback."),
        success: "",
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openModal = (applicationId) => {
    setSelectedApplicationId(applicationId);
    const existingFeedback = feedbacks.find((item) => item.application_id === applicationId);
    setFeedbackText(existingFeedback?.message || "");
    setModalOpen(true);
    setStatus({ error: "", success: "" });
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedApplicationId("");
    setFeedbackText("");
  };

  const submitFeedback = async () => {
    const selectedApplication = applications.find((item) => item.id === selectedApplicationId);
    if (!selectedApplication) return;

    try {
      await api.post("/communications/feedback", {
        student_id: selectedApplication.student_id,
        application_id: selectedApplication.id,
        job_id: selectedApplication.job_id,
        type: "performance",
        rating: null,
        message: feedbackText,
      });
      setStatus({ error: "", success: "Feedback submitted." });
      await loadData();
      closeModal();
    } catch (requestError) {
      setStatus({
        error: getApiError(requestError, "Unable to submit feedback."),
        success: "",
      });
    }
  };

  return (
    <div className="dashboard-container">
      <CompanySidebar />
      <main className="main-content">
        <div className="company-approval-container">
          <h2>Feedback Status</h2>
          {status.error && <p className="resume-message error">{status.error}</p>}
          {status.success && <p className="resume-message success">{status.success}</p>}
          <table className="company-approval-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Internship</th>
                <th>Status</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => {
                const feedback = feedbacks.find((item) => item.application_id === application.id);
                return (
                  <tr key={application.id}>
                    <td>{application.student_name}</td>
                    <td>{application.job_title}</td>
                    <td>
                      <span className={feedback ? "submitted" : "pending"}>
                        {feedback ? "Submitted" : "Pending"}
                      </span>
                    </td>
                    <td>
                      <button className="add-feedback" onClick={() => openModal(application.id)}>
                        {feedback ? "Edit Feedback" : "Add Feedback"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {modalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>Add Feedback</h3>
              <textarea
                value={feedbackText}
                onChange={(event) => setFeedbackText(event.target.value)}
                placeholder="Write your feedback"
              />
              <div className="modal-buttons">
                <button className="submit" onClick={submitFeedback}>
                  Submit
                </button>
                <button className="cancel" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default FeedbackStatus;
