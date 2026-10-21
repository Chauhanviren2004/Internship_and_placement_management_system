import React from 'react';


const progressList = [
  { id: 1, role: "Frontend Intern", company: "TechNova", progress: 60 },
  { id: 2, role: "React Intern", company: "InnoSoft", progress: 30 },
  { id: 3, role: "Backend Intern", company: "CodeCraft", progress: 85 },
];

const InternshipProgress = () => {
  const getProgressColor = (progress) => {
    if (progress < 40) return '#e74c3c'; // Red
    if (progress < 70) return '#f1c40f'; // Yellow
    return '#0dcaf0'; // Teal
  };

  return (
    <div className="internship-progress-container">
      <h4>Internship Progress</h4>
      {progressList.map(p => (
        <div key={p.id} className="progress-item">
          <div className="progress-header">
            <span className="role">{p.role}</span> @ <span className="company">{p.company}</span>
            <span className="percentage">{p.progress}%</span>
          </div>
          <div className="progress-bar-wrapper">
            <div
              className="progress-bar-inner"
              style={{ width: `${p.progress}%`, backgroundColor: getProgressColor(p.progress) }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InternshipProgress;
