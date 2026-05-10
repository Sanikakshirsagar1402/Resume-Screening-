import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UploadResume from "./pages/UploadResume";
import CreateJob from "./pages/CreateJob";
import JobsList from "./pages/JobsList";
import ManageJobs from "./pages/ManageJobs";
import JobApplicants from "./pages/JobApplicants";
import Dashboard from "./pages/Dashboard";
import SearchCandidates from "./pages/SearchCandidates";
import CandidateDashboard from "./pages/CandidateDashboard";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import CandidateProfile from "./pages/CandidateProfile";

import Home from "./pages/Home";
import DashboardLayout from "./components/DashboardLayout";

export default function App() {
  return (
    // <Home />
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: 'white',
              color: 'green',
            },
          },
          error: {
            style: {
              background: 'white',
              color: 'red',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Candidate Routes */}
        <Route path="/upload" element={<DashboardLayout><UploadResume /></DashboardLayout>} />
        <Route path="/candidate-dashboard" element={<DashboardLayout><CandidateDashboard /></DashboardLayout>} />
        <Route path="/jobs" element={<DashboardLayout><JobsList /></DashboardLayout>} />
        <Route path="/resume-analysis" element={<DashboardLayout><ResumeAnalysis /></DashboardLayout>} />
        <Route path="/candidate-profile" element={<DashboardLayout><CandidateProfile /></DashboardLayout>} />

        {/* Recruiter Routes */}
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/create-job" element={<DashboardLayout><CreateJob /></DashboardLayout>} />
        <Route path="/manage-jobs" element={<DashboardLayout><ManageJobs /></DashboardLayout>} />
        <Route path="/job-applicants/:jobId" element={<DashboardLayout><JobApplicants /></DashboardLayout>} />
        <Route path="/search" element={<DashboardLayout><SearchCandidates /></DashboardLayout>} />

      </Routes>
    </BrowserRouter>
  );
}

