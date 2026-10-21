import React from "react";
// import "./CompaniesSection.css";

const companies = [
  { name: "Google", abbr: "G" },
  { name: "Microsoft", abbr: "M" },
  { name: "Amazon", abbr: "A" },
  { name: "Flipkart", abbr: "F" },
  { name: "Razorpay", abbr: "R" },
  { name: "Swiggy", abbr: "S" },
  { name: "TATA", abbr: "T" },
  { name: "Infosys", abbr: "In" },
  { name: "Wipro", abbr: "W" },
  { name: "Zomato", abbr: "Z" },
  { name: "TechNishal", abbr: "T"},
  { name: "TechCraft", abbr: "TC"},
];

const CompaniesSection = () => {
  return (
    <section className="companies-section">
      <div className="container">
        <p className="section-subtitle">
          Trusted by 2,500+ Companies Across India
        </p>
        
        <div className="logos-wrapper">
          {companies.map((co) => (
            <div key={co.name} className="company-item">
              <div className="abbr-box">
                {co.abbr}
              </div>
              <span className="company-name">
                {co.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompaniesSection;