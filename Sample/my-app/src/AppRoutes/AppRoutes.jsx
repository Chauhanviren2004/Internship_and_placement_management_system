import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Navbar from "../Navbar";
import HeroSection from "../HeroSection";
import StatsSection from "../StatsSection";
import CompaniesSection from "../Companiessection";
import InternshipsSection from "../InternshipSection";
import HowItWorksSection from "../HowItWorksSection";
import TestimonialsSection from "../TestimonialsSection";
import CTASection from "../CTASection";
import Footer from "../Footer";
import Feedback from "../Feedback";
import InternshipPage from "../InternshipPage";
import Login from "../Login";
import Register from "../Register";
import { dashboardPathForRole, getStoredAuth } from "../auth";
import CompanyDashboard from "../Company/CompanyDashboard";
import CompanyAnalytics from "../Company/CompanyAnalytics";
import Chat from "../Company/Chat";
import FeedbackStatus from "../Company/FeedbackStatus";
import PostInternship from "../Company/PostInternship";
import ShortlistStudents from "../Company/ShortlistStudents";
import StudentResumeList from "../Company/StudentResumeList";
import CollegeDashboard from "../College/CollegeDashboard";
import CompanyApproval from "../College/CompanyApproval";
import ReportAnalysis from "../College/ReportAnalysis";
import StudentManagement from "../College/StudentManagement";
import ApplicationStatus from "../Student/Applicationstatus";
import InternshipList from "../Student/InternshipList";
import Messages from "../Student/Messages";
import ProfilePage from "../Student/ProfilePage";
import ResumeUpload from "../Student/ResumeUpload";
import StudentDashboard from "../Student/StudentDashboard";
import AiAssistant from "../Ai-Assistant";


const ProtectedRoute = ({ allowedRoles, children }) => {
  const auth = getStoredAuth();
  if (!auth?.token || !auth?.user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(auth.user.role)) {
    return <Navigate to={dashboardPathForRole(auth.user.role)} replace />;
  }
  return children;
};

const Home = () => (
  <>
    <Navbar />
    <HeroSection />
    <CompaniesSection />
    <InternshipsSection />
    <HowItWorksSection />
    <TestimonialsSection />
    <CTASection />
    <StatsSection />
    <Footer />
  </>
);

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/internship" element={<InternshipPage />} />
      <Route path="/AiAssistant" element={<AiAssistant />} />


      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/internship-list"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <InternshipList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/application-status"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <ApplicationStatus />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["student", "company"]}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume-upload"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <ResumeUpload />
          </ProtectedRoute>
        }
      />

      <Route
        path="/company-dashboard"
        element={
          <ProtectedRoute allowedRoles={["company"]}>
            <CompanyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/analytics"
        element={
          <ProtectedRoute allowedRoles={["company"]}>
            <CompanyAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/post-internship"
        element={
          <ProtectedRoute allowedRoles={["company"]}>
            <PostInternship />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/student-resumes"
        element={
          <ProtectedRoute allowedRoles={["company"]}>
            <StudentResumeList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/shortlist"
        element={
          <ProtectedRoute allowedRoles={["company"]}>
            <ShortlistStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/feedback"
        element={
          <ProtectedRoute allowedRoles={["company"]}>
            <FeedbackStatus />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/chat"
        element={
          <ProtectedRoute allowedRoles={["company"]}>
            <Chat />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CollegeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company-approval"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CompanyApproval />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-management"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <StudentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report-analysis"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ReportAnalysis />
          </ProtectedRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
