import React from "react";
import { ArrowRight, GraduationCap, Building2 } from "lucide-react";
// import "./CTASection.css";

const CTASection = () => {
  return (
    <section className="cta-section">
      {/* Background Glows */}
      <div className="cta-glow-1"></div>
      <div className="cta-glow-2"></div>

      <div className="container cta-content">
        <p className="cta-label">Get Started Today</p>
        <h2 className="cta-title">
          Ready to Find Your Dream Internship?
        </h2>
        <p className="cta-desc">
          Join 85,000+ students who've already kickstarted their careers. 
          Sign up free and start applying today.
        </p>

        <div className="cta-button-group">
          <button className="cta-btn-primary">
            <GraduationCap size={20} />
            I'm a Student
            <ArrowRight size={18} />
          </button>
          
          <button className="cta-btn-outline">
            <Building2 size={20} />
            I'm a Company
          </button>
        </div>

        <p className="cta-footer-note">
          Free to join · No credit card required · Start applying in minutes
        </p>
      </div>
    </section>
  );
};

export default CTASection;