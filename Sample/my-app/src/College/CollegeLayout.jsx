import React from "react";
import { Outlet } from "react-router-dom";
import CollegeSidebar from "./Collegesidebar";



const CollegeLayout = () => {
  return (
    <div className="college-layout">

      {/* Sidebar */}
      <CollegeSidebar/>

      {/* Page Content */}
      <div className="college-content">
        <Outlet />
      </div>

    </div>
  );
};

export default CollegeLayout;