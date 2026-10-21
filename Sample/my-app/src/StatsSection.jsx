import React from "react";
import { Users, Building2, CheckCircle, TrendingUp } from "lucide-react";
// import "./StatsSection.css";

const stats = [
  {
    icon: Building2,
    value: "2,500+",
    label: "Partner Companies",
    description: "Top employers actively hiring",
  },
  {
    icon: Users,
    value: "85,000+",
    label: "Student Profiles",
    description: "Verified college students",
  },
  {
    icon: CheckCircle,
    value: "34,000+",
    label: "Placements Made",
    description: "Successful internship matches",
  },
  {
    icon: TrendingUp,
    value: "92%",
    label: "Placement Rate",
    description: "Students placed within 60 days",
  },
];

const StatsSection = () => {
  return (
    <section className="stats-section">
      {/* Vertical Decorative Lines */}
      <div className="bg-lines">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      <div className="stats-container">
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon-box">
                <stat.icon size={24} className="teal-icon" />
              </div>
              <h2 className="stat-value">{stat.value}</h2>
              <h3 className="stat-label">{stat.label}</h3>
              <p className="stat-description">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;