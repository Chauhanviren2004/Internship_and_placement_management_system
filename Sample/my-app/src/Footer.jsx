import React from "react";
import { Briefcase, Twitter, Linkedin, Instagram, Mail } from "lucide-react";
// import "./Footer.css";

const footerLinks = {
  Students: ["Browse Internships", "Create Profile", "Application Tracker", "Resume Builder", "Career Resources"],
  Companies: ["Post Internship", "Find Talent", "Employer Dashboard", "Pricing Plans", "Success Stories"],
  Platform: ["About IntelliPlace", "Blog", "Press Kit", "Contact Us", "Sitemap"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility"],
};

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">
          
          {/* Brand Column */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon-box">
                <Briefcase size={18} className="icon-white" />
              </div>
              <span className="logo-text">
                Intelli<span className="teal-text">Place</span>
              </span>
            </div>
            <p className="brand-desc">
              Connecting college students with the best internship opportunities across India and beyond.
            </p>
            <div className="social-icons">
              {[Twitter, Linkedin, Instagram, Mail].map((Icon, i) => (
                <a key={i} href="#" className="social-link">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="footer-column">
              <h4 className="column-title">{category}</h4>
              <ul className="footer-list">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="footer-link">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="copyright">© 2025 Intelliplace. All rights reserved. Made with ❤️ for students.</p>
          <p className="footer-badges">
            In Serving colleges across India · 2,500+ Partner Companies
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;