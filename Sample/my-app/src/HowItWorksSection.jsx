import React from "react";
import { UserCircle, Search, FileText, CheckCircle2 } from "lucide-react";
// import "./HowItWorksSection.css";

const steps = [
  {
    step: "01",
    icon: UserCircle,
    title: "Create Your Profile",
    description: "Sign up as a student or company. Build your profile with your skills, education, and career goals in minutes.",
    type: "neutral", // Used for CSS styling
  },
  {
    step: "02",
    icon: Search,
    title: "Discover Opportunities",
    description: "Browse thousands of internship listings filtered by domain, location, stipend, and duration tailored to you.",
    type: "teal",
  },
  {
    step: "03",
    icon: FileText,
    title: "Apply in One Click",
    description: "Use your intelliplace profile to apply instantly. No repetitive forms — your profile is your application.",
    type: "neutral",
  },
  {
    step: "04",
    icon: CheckCircle2,
    title: "Track & Get Placed",
    description: "Monitor your application status, communicate with recruiters, and land your dream internship.",
    type: "teal",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="container">
        {/* Header */}
        <div className="how-header">
          <p className="teal-label">Simple Process</p>
          <h2 className="how-title">How Intelliplace Works</h2>
          <p className="how-desc">
            From profile creation to internship placement in four simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="steps-grid">
          {/* Connector line for desktop */}
          <div className="desktop-connector"></div>

          {steps.map((item, i) => (
            <div key={i} className="step-card">
              {/* Step number badge */}
              <div className="step-badge">{item.step}</div>

              {/* Icon Container */}
              <div className={`icon-container ${item.type}`}>
                <item.icon size={28} />
              </div>

              <h3 className="step-title">{item.title}</h3>
              <p className="step-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;