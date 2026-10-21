import React from "react";
import { Quote } from "lucide-react";
// import "./TestimonialsSection.css";

const testimonials = [
  {
    name: "Priya Sharma",
    college: "IIT Delhi · Computer Science",
    quote: "HireHub helped me land a Google internship in just 3 weeks! The process was smooth and the platform is super intuitive.",
    avatar: "PS",
    company: "Google",
  },
  {
    name: "Arjun Mehta",
    college: "NIT Trichy · Electronics",
    quote: "I applied to 10 companies and got 4 interview calls within a week. The filtering options are really helpful for finding the right fit.",
    avatar: "AM",
    company: "Microsoft",
  },
  {
    name: "Sneha Reddy",
    college: "BITS Pilani · MBA",
    quote: "As a business student, I found amazing marketing and finance internships. HireHub genuinely understands what students need.",
    avatar: "SR",
    company: "Flipkart",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="testimonials-section">
      <div className="container">
        {/* Header */}
        <div className="testi-header">
          <p className="teal-label">Student Stories</p>
          <h2 className="testi-title">Real Success Stories</h2>
          <p className="testi-desc">Students who found their perfect internship through HireHub</p>
        </div>

        <div className="testi-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testi-card">
              <Quote className="quote-icon" size={24} />
              <p className="testi-quote">
                "{t.quote}"
              </p>
              
              <div className="user-info-row">
                {/* User Avatar */}
                <div className="user-avatar">
                  {t.avatar}
                </div>
                
                {/* User Text Details */}
                <div className="user-details">
                  <p className="user-name">{t.name}</p>
                  <p className="user-college">{t.college}</p>
                </div>
                
                {/* Company Initial Badge */}
                <div className="company-badge">
                  {t.company[0]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;