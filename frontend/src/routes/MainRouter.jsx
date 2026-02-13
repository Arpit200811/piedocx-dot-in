import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PublicRoutes } from "./PublicRoutes";
import { AdminRoutes } from "./AdminRoutes";
import { EmployeeRoutes } from "./EmployeeRoutes";

const RootLayout = lazy(() => import("../Components/RootLayout"));
const StudentDetails = lazy(() => import("../Components/StudentDetails"));
const StudentDashboard = lazy(() => import("../Components/StudentDashboard"));
const TestInterface = lazy(() => import("../Components/Student/TestInterface"));
const WaitingRoom = lazy(() => import("../Components/Student/WaitingRoom"));
const FeedbackForm = lazy(() => import("../Components/Student/FeedbackForm"));
const VerifyCertificate = lazy(() => import("../Components/VerifyCertificate"));
const ProtectedStudentRoute = lazy(() => import("../Components/ProtectedStudentRoute"));
const DashboardLayout = lazy(() => import("../layouts/DashboardLayout"));

const MainRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        {PublicRoutes}
      </Route>

      {/* Student Portal (Protected) */}
      <Route element={<ProtectedStudentRoute />}>
        <Route path="/student-dashboard" element={<DashboardLayout />}>
          <Route index element={<StudentDashboard />} />
          {/* You can add more sub-routes here if needed */}
          <Route path="exams" element={<StudentDashboard />} /> 
          <Route path="resources" element={<StudentDashboard />} />
          <Route path="certificates" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentDashboard />} />
        </Route>
        
        {/* These might need to be outside the layout depending on UI needs */}
        <Route path="/test-interface" element={<TestInterface />} />
        <Route path="/waiting-room" element={<WaitingRoom />} />
        <Route path="/feedback" element={<FeedbackForm />} />
      </Route>

      <Route path="/verify/:id" element={<VerifyCertificate />} />

      {/* Special Individual Pages */}
      <Route path="/student/:id" element={<StudentDetails />} />

      {/* Employee Dashboard */}
      {EmployeeRoutes}

      {/* Admin Panel */}
      {AdminRoutes}

      {/* Catch-all for undefined routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default MainRouter;

