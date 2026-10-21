import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const StudentLayout = () => {
  return (
    <div className="student-dashboard">
      <Sidebar />
      <div className="student-content">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;