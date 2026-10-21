import { useEffect, useState } from "react";

import api, { getApiError } from "../api";
import Sidebar from "./Sidebar";


const ApplicationStatus = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const { data } = await api.get("/applications/mine");
        setApplications(data);
      } catch (requestError) {
        setError(getApiError(requestError, "Unable to load applications."));
      }
    };

    loadApplications();
  }, []);

  const getBadge = (status) => {
    if (status === "pending") return "badge pending";
    if (status === "shortlisted") return "badge success";
    if (status === "rejected") return "badge danger";
    return "badge";
  };

  const filteredApps = applications
    .filter((app) => (filter === "All" ? true : app.status === filter.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "company") return a.company_name.localeCompare(b.company_name);
      return 0;
    });

  return (
    <>
      <Sidebar />

      <div className="app-container">
        <h2 className="title">My Applications</h2>

        <div className="controls">
          <div>
            <label>Filter</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All</option>
              <option>pending</option>
              <option>shortlisted</option>
              <option>rejected</option>
            </select>
          </div>

          <div>
            <label>Sort</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date">Applied Date</option>
              <option value="company">Company</option>
            </select>
          </div>
        </div>

        {error && <p className="resume-message error">{error}</p>}

        {filteredApps.length === 0 ? (
          <p className="no-data">No applications found.</p>
        ) : (
          <div className="applications-grid" style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', marginTop: '20px' }}>
            {filteredApps.map((app) => (
              <div key={app.id} style={{ padding: '20px', backgroundColor: 'var(--card-bg, #2c2f42)', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: 'var(--accent, #0dcaf0)' }}>{app.job_title}</h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary, #cfd1d9)', fontSize: '0.9rem' }}>{app.company_name}</p>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #cfd1d9)' }}>
                    {new Date(app.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <p style={{ fontSize: '0.85rem', marginBottom: '10px', color: 'var(--text-primary, #e0e0e0)' }}>Application Tracking:</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '10px', left: '10%', right: '10%', height: '2px', backgroundColor: 'var(--border-color, #4a4d60)', zIndex: 0 }}></div>

                    {/* Step 1: Applied */}
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#0dcaf0', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#1f2230', fontSize: '12px' }}>✓</div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-primary, #e0e0e0)' }}>Applied</span>
                    </div>

                    {/* Step 2: Under Review */}
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: app.status !== 'pending' ? '#0dcaf0' : 'var(--border-color, #4a4d60)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#1f2230', fontSize: '12px' }}>
                        {app.status !== 'pending' ? '✓' : ''}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: app.status !== 'pending' ? 'var(--text-primary, #e0e0e0)' : 'var(--text-secondary, #cfd1d9)' }}>Reviewed</span>
                    </div>

                    {/* Step 3: Decision */}
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                      <div style={{
                        width: '20px', height: '20px', borderRadius: '50%',
                        backgroundColor: app.status === 'shortlisted' ? '#28a745' : app.status === 'rejected' ? '#dc3545' : 'var(--border-color, #4a4d60)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '12px'
                      }}>
                        {app.status === 'shortlisted' ? '✓' : app.status === 'rejected' ? '✕' : ''}
                      </div>
                      <span style={{
                        fontSize: '0.75rem',
                        color: app.status === 'shortlisted' ? '#28a745' : app.status === 'rejected' ? '#dc3545' : 'var(--text-secondary, #cfd1d9)',
                        fontWeight: app.status !== 'pending' ? 'bold' : 'normal'
                      }}>
                        {app.status === 'pending' ? 'Decision' : app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ApplicationStatus;
