// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const ApplyInternship = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     contact: "",
//     address: "",
//     company: "",
//     role: "",
//     experience: "",
//     skills: []
//   });

//   const [skillInput, setSkillInput] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const companies = [
//     "TechNova Pvt Ltd",
//     "InnoSoft",
//     "CodeCraft",
//     "DevSolutions",
//     "SoftEdge",
//     "Webify",
//     "NextGen Tech",
//     "AlphaApps",
//     "ByteWorks",
//     "CloudNine"
//   ];

//   const experiences = ["Fresher", "1 Year", "2 Years", "3+ Years"];

//   // Handle normal input change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Add skill when Enter or comma pressed
//   const handleSkillKeyDown = (e) => {
//     if (e.key === "Enter" || e.key === ",") {
//       e.preventDefault();
//       const skill = skillInput.trim();
//       if (skill && !formData.skills.includes(skill)) {
//         setFormData({
//           ...formData,
//           skills: [...formData.skills, skill]
//         });
//       }
//       setSkillInput("");
//     }
//   };

//   // Remove skill
//   const removeSkill = (skillToRemove) => {
//     setFormData({
//       ...formData,
//       skills: formData.skills.filter((s) => s !== skillToRemove)
//     });
//   };

//   // Handle form submit
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Basic validation
//     const emailRegex = /\S+@\S+\.\S+/;
//     if (!emailRegex.test(formData.email)) {
//       alert("Please enter a valid email.");
//       return;
//     }
//     if (formData.contact.length < 10) {
//       alert("Please enter a valid contact number.");
//       return;
//     }

//     const newApplication = {
//       id: Date.now(),
//       ...formData,
//       date: new Date().toLocaleDateString(),
//       status: "Pending"
//     };

//     const existingApps = JSON.parse(localStorage.getItem("applications")) || [];
//     localStorage.setItem("applications", JSON.stringify([...existingApps, newApplication]));

//     // Success message
//     setSuccessMessage("✅ Application submitted successfully!");

//     // Reset form
//     setFormData({
//       name: "",
//       email: "",
//       contact: "",
//       address: "",
//       company: "",
//       role: "",
//       experience: "",
//       skills: []
//     });
//     setSkillInput("");

//     // Auto clear message after 3 seconds
//     setTimeout(() => setSuccessMessage(""), 3000);

//     // Optionally redirect after 1s
//     setTimeout(() => navigate("/student-dashboard/application-status"), 1000);
//   };

//   return (
//     <div className="container mt-4">
//       <h4>Apply for Internship</h4>

//       {successMessage && (
//         <div className="alert-success">{successMessage}</div>
//       )}

//       <form onSubmit={handleSubmit} className="mt-3">
//         <div className="mb-3">
//           <label className="form-label">Full Name</label>
//           <input
//             type="text"
//             name="name"
//             className="form-control"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Email</label>
//           <input
//             type="email"
//             name="email"
//             className="form-control"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Contact Number</label>
//           <input
//             type="tel"
//             name="contact"
//             className="form-control"
//             value={formData.contact}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Address</label>
//           <textarea
//             name="address"
//             className="form-control"
//             value={formData.address}
//             onChange={handleChange}
//             required
//           ></textarea>
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Select Company</label>
//           <input
//             type="text"
//             className="form-control mb-2"
//             placeholder="Search company..."
//             onChange={(e) => setFormData({ ...formData, companySearch: e.target.value })}
//           />
//           <select
//             name="company"
//             className="form-select"
//             value={formData.company}
//             onChange={handleChange}
//             required
//           >
//             <option value="">-- Select Company --</option>
//             {companies
//               .filter((c) =>
//                 c.toLowerCase().includes((formData.companySearch || "").toLowerCase())
//               )
//               .map((c, index) => (
//                 <option key={index} value={c}>
//                   {c}
//                 </option>
//               ))}
//           </select>
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Internship Role / Position</label>
//           <input
//             type="text"
//             name="role"
//             className="form-control"
//             value={formData.role}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Experience</label>
//           <select
//             name="experience"
//             className="form-select"
//             value={formData.experience}
//             onChange={handleChange}
//             required
//           >
//             <option value="">-- Select Experience --</option>
//             {experiences.map((exp, index) => (
//               <option key={index} value={exp}>
//                 {exp}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Skills (press Enter or Comma)</label>
//           <input
//             type="text"
//             className="form-control"
//             value={skillInput}
//             onChange={(e) => setSkillInput(e.target.value)}
//             onKeyDown={handleSkillKeyDown}
//             placeholder="Add skills one by one"
//           />
//           <div className="skills-tags mt-2">
//             {formData.skills.map((skill, index) => (
//               <span key={index} className="skill-tag" onClick={() => removeSkill(skill)}>
//                 {skill} ×
//               </span>
//             ))}
//           </div>
//         </div>

//         <button type="submit" className="btn btn-primary">
//           Submit Application
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ApplyInternship;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const ApplyInternship = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    company: "",
    role: "",
    experience: "",
    resume: "",
    skills: []
  });

  const [skillInput, setSkillInput] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const companies = [
    "TechNova Pvt Ltd",
    "InnoSoft",
    "CodeCraft",
    "DevSolutions",
    "SoftEdge",
    "Webify",
    "NextGen Tech",
    "AlphaApps",
    "ByteWorks",
    "CloudNine"
  ];

  const experiences = ["Fresher", "1 Year", "2 Years", "3+ Years"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, resume: file.name });
    }
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const skill = skillInput.trim();

      if (skill && !formData.skills.includes(skill)) {
        setFormData({
          ...formData,
          skills: [...formData.skills, skill]
        });
      }

      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newApplication = {
      id: Date.now(),
      ...formData,
      date: new Date().toLocaleDateString(),
      status: "Pending"
    };

    const existingApps =
      JSON.parse(localStorage.getItem("applications")) || [];

    localStorage.setItem(
      "applications",
      JSON.stringify([...existingApps, newApplication])
    );

    setSuccessMessage("✅ Application submitted successfully!");

    setTimeout(() => {
      navigate("/student-dashboard/application-status");
    }, 1200);
  };

  return (
    <>
    <Sidebar/>
    <div className="container mt-4">
      <h4>Apply for Internship</h4>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="mt-3">

        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contact Number</label>
          <input
            type="tel"
            name="contact"
            className="form-control"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea
            name="address"
            className="form-control"
            value={formData.address}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Select Company</label>
          <select
            name="company"
            className="form-select"
            value={formData.company}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Company --</option>

            {companies.map((company, index) => (
              <option key={index} value={company}>
                {company}
              </option>
            ))}

          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Internship Role</label>
          <input
            type="text"
            name="role"
            className="form-control"
            value={formData.role}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Experience</label>

          <select
            name="experience"
            className="form-select"
            value={formData.experience}
            onChange={handleChange}
          >
            <option value="">Select Experience</option>

            {experiences.map((exp, i) => (
              <option key={i}>{exp}</option>
            ))}

          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Resume</label>

          <input
            type="file"
            className="form-control"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Skills (Press Enter)</label>

          <input
            type="text"
            className="form-control"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            placeholder="Add skills"
          />

          <div className="mt-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="badge bg-secondary me-2"
                onClick={() => removeSkill(skill)}
                style={{ cursor: "pointer" }}
              >
                {skill} ×
              </span>
            ))}
          </div>

        </div>

        <button type="submit" className="btn btn-primary">
          Submit Application
        </button>

      </form>
    </div>
    </>
  );
};

export default ApplyInternship;