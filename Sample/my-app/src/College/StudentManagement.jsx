import { useEffect, useState } from "react";

import api, { getApiError } from "../api";
import CollegeSidebar from "./Collegesidebar";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const { data } = await api.get("/users?role=student");
        setStudents(data);
      } catch (requestError) {
        setError(getApiError(requestError, "Unable to load students."));
      }
    };

    loadStudents();
  }, []);

  return (
    <div className="dashboard-container">
      <CollegeSidebar />
      <main className="main-content">
        <div className="student-management">
          <h2>Student Management</h2>
          <p>Review student details and mark a student as selected for follow-up.</p>
          {error && <p className="resume-message error">{error}</p>}
          <div className="student-list">
            {students.map((student) => (
              <div key={student.id} className="student-card">
                <div className="student-info">
                  <h3>{student.full_name}</h3>
                  <p>{student.email}</p>
                  <p>{student.profile.college || "College not set"}</p>
                </div>
                <button
                  className={`select-btn ${selectedId === student.id ? "selected-btn" : ""}`}
                  onClick={() => setSelectedId(student.id)}
                >
                  {selectedId === student.id ? "Selected" : "Select"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentManagement;
