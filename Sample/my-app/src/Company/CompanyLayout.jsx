// import React from "react";
// import CompanySidebar from "./CompanySidebar";

// function CompanyLayout({ children }) {
//   return (
//     <div className="company-layout">
//       <CompanySidebar />
//       <div className="company-content">
//         {children}
//       </div>
//     </div>
//   );
// }

// export default CompanyLayout;


import React from "react";
import { Outlet } from "react-router-dom";
import CompanySidebar from "./CompanySidebar";
import "./CompanyLayout.css";

const CompanyLayout = () => {
  return (
    <div className="company-dashboard-container">
      <CompanySidebar />
      <main className="company-main-content">
        <Outlet /> {/* Render route content here */}
      </main>
    </div>
  );
};

export default CompanyLayout;