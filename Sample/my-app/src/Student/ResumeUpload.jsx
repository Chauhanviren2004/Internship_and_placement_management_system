import { useState } from "react";
import axios from "axios";

import { BACKEND_ROOT_URL, getApiError } from "../api";
import { getToken } from "../auth";
import Sidebar from "./Sidebar";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [resumeLink, setResumeLink] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(selectedFile.type)) {
      setMessage("Only PDF or Word files are allowed!");
      setMessageType("error");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setMessage("");
    setMessageType("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first!");
      setMessageType("error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${BACKEND_ROOT_URL}/student/upload-resume`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setMessage(`File "${file.name}" uploaded successfully!`);
      setMessageType("success");
      setResumeLink({
        name: file.name,
        url: res.data.resume_url,
      });
      setFile(null);
    } catch (err) {
      setMessage(getApiError(err, "Failed to upload file. Please try again."));
      setMessageType("error");
    }
  };

  return (
    <>
      <Sidebar />
      <div className="resume-container">
        <h2>Upload Your Resume</h2>

        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />

        {file && <div className="resume-preview">Selected File: {file.name}</div>}

        {resumeLink && (
          <div className="resume-link">
            Uploaded File:{" "}
            <a href={resumeLink.url} target="_blank" rel="noopener noreferrer">
              {resumeLink.name}
            </a>
          </div>
        )}

        {message && (
          <div className={`resume-message ${messageType === "success" ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <button className="resume-button" onClick={handleUpload}>
          Upload Resume
        </button>
      </div>
    </>
  );
};

export default ResumeUpload;
