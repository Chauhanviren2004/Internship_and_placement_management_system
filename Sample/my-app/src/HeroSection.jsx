import React from "react";
import { Search, MapPin, ChevronRight, ArrowRight } from "lucide-react";
// import "./HeroSection.css";

const categories = ["Software Engineering", "Marketing", "Finance", "Design", "Data Science", "Research"];

const HeroSection = () => {
  return (
    <section className="hero-section">
      {/* Background Glow Decorations */}
      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>

      <div className="container">
        <div className="hero-grid">
          
          {/* Left Content */}
          <div className="hero-text-content">
            <div className="stats-badge">
              <span className="pulse-dot"></span>
              <span className="stats-text">500+ New internships this week</span>
            </div>

            <div className="title-area">
              <h1 className="hero-title">
                Launch Your Career with the
                <span className="teal-gradient-text">Right Internship</span>
              </h1>
              <p className="hero-description">
                IntelliPlace connects college students with top companies offering meaningful 
                internship experiences. Find, apply, and track — all in one place.
              </p>
            </div>

            {/* Search Bar Group */}
            {/* <div className="search-wrapper">
              <div className="search-input-group">
                <Search size={18} className="icon-gray" />
                <input type="text" placeholder="Job title, skills..." />
              </div>
              <div className="search-input-group border-left">
                <MapPin size={18} className="icon-gray" />
                <input type="text" placeholder="City or Remote..." />
              </div>
              <button className="search-btn">
                Search <ArrowRight size={18} />
              </button>
            </div> */}

            {/* Popular Categories */}
            <div className="categories-area">
              <p className="categories-label">Popular Categories:</p>
              <div className="category-tags">
                {categories.map((cat) => (
                  <button key={cat} className="tag">
                    {cat} <ChevronRight size={14} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="hero-visual">
            <div className="main-image-wrapper">
              {/* Replace the src with your image path or a placeholder */}
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80" 
                alt="Students collaborating" 
                className="hero-img"
              />
              
              {/* Floating Card 1 (Google) */}
              <div className="floating-card card-top">
                <div className="logo-box-g">G</div>
                <div>
                  <p className="card-title">Google LLC</p>
                  <p className="card-subtitle">SWE Intern · Remote</p>
                </div>
              </div>

              {/* Floating Card 2 (Stats) */}
              <div className="floating-card card-bottom">
                <p className="card-subtitle">Applications Today</p>
                <p className="stat-number">1,248</p>
                <p className="stat-trend">↑ 12% vs yesterday</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;