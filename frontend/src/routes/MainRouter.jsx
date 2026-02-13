import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
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

const MainRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        {PublicRoutes}
      </Route>

      {/* Standalone Dashboard Pages */}
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/test-interface" element={<TestInterface />} />
      <Route path="/waiting-room" element={<WaitingRoom />} />
      <Route path="/feedback" element={<FeedbackForm />} />
      <Route path="/verify/:id" element={<VerifyCertificate />} />

      {/* Special Individual Pages */}
      <Route path="/student/:id" element={<StudentDetails />} />

      {/* Employee Dashboard */}
      {EmployeeRoutes}

      {/* Admin Panel */}
      {AdminRoutes}
    </Routes>
  );
};

export default MainRouter;
