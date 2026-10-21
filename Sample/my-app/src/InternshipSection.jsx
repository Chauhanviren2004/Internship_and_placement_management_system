import React from "react";
import { Filter, SlidersHorizontal, MapPin, Calendar, Clock, ArrowUpRight } from "lucide-react";
// import "./InternshipsSection.css";

const internships = [
  { company: "Google", logo: "G", role: "Software Engineering Intern", location: "Remote / Bangalore", type: "Full-time", stipend: "₹80,000/mo", duration: "6 Months", tags: ["React", "Python", "ML"], isNew: true, isFeatured: true },
  { company: "Microsoft", logo: "M", role: "Product Management Intern", location: "Hyderabad", type: "Full-time", stipend: "₹70,000/mo", duration: "4 Months", tags: ["Product", "Strategy"], isNew: true },
  { company: "Flipkart", logo: "F", role: "Data Science Intern", location: "Bangalore", type: "Hybrid", stipend: "₹55,000/mo", duration: "3 Months", tags: ["Python", "SQL"] },
  { company: "Razorpay", logo: "R", role: "UX Design Intern", location: "Remote", type: "Remote", stipend: "₹45,000/mo", duration: "6 Months", tags: ["Figma", "UI/UX"], isNew: true },
  { company: "Swiggy", logo: "S", role: "Operations Intern", location: "Mumbai", type: "On-site", stipend: "₹40,000/mo", duration: "3 Months", tags: ["Excel", "Logistics"] },
  { company: "Zepto", logo: "Z", role: "Growth Intern", location: "Remote", type: "Remote", stipend: "₹35,000/mo", duration: "4 Months", tags: ["Marketing", "SEO"] },
];

const filters = ["All", "Technology", "Finance", "Design", "Marketing", "Operations"];

const InternshipsSection = () => {
  return (
    <section className="internships-section" id="internships">
      <div className="container">
        
        {/* Header Area */}
        <div className="section-header">
          <div className="header-text">
            <p className="teal-label">Browse Opportunities</p>
            <h2 className="section-title">Featured Internships</h2>
            <p className="section-desc">Handpicked opportunities from top companies</p>
          </div>
          <div className="header-controls">
            <button className="btn-outline-small"><SlidersHorizontal size={16}/> Filters</button>
            <button className="btn-outline-small"><Filter size={16}/> Sort</button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="filter-pills">
          {filters.map((filter, i) => (
            <button key={filter} className={i === 0 ? "pill active" : "pill"}>
              {filter}
            </button>
          ))}
        </div>

        {/* Grid of Cards */}
        <div className="internship-grid">
          {internships.map((job, i) => (
            <div key={i} className={`job-card ${job.isFeatured ? 'featured' : ''}`}>
              <div className="card-top">
                <div className="company-info">
                  <div className="job-logo">{job.logo}</div>
                  <div>
                    <h4 className="job-company-name">{job.company}</h4>
                    {job.isNew && <span className="new-badge">New</span>}
                  </div>
                </div>
                <button className="btn-icon"><ArrowUpRight size={18}/></button>
              </div>

              <h3 className="job-role-title">{job.role}</h3>

              <div className="job-meta-grid">
                <div className="meta-item"><MapPin size={14}/> {job.location}</div>
                <div className="meta-item"><Clock size={14}/> {job.duration}</div>
                <div className="meta-item"><Calendar size={14}/> {job.type}</div>
              </div>

              <div className="job-tags">
                {job.tags.map(tag => <span key={tag} className="job-tag">{tag}</span>)}
              </div>

              <div className="card-footer">
                <span className="stipend-amount">{job.stipend}</span>
                <button className="apply-btn">Apply Now</button>
              </div>
            </div>
          ))}
        </div>

        <div className="load-more-container">
          <button className="view-all-btn">View All 2,500+ Internships →</button>
        </div>
      </div>
    </section>
  );
};

export default InternshipsSection;