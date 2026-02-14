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
const ExamResults = lazy(() => import("../Components/Student/ExamResults"));
const FeedbackForm = lazy(() => import("../Components/Student/FeedbackForm"));
const VerifyCertificate = lazy(() => import("../Components/VerifyCertificate"));
const ProtectedStudentRoute = lazy(() => import("../Components/ProtectedStudentRoute"));
const DashboardLayout = lazy(() => import("../layouts/DashboardLayout"));

const RedirectIfAuthenticated = lazy(() => import("../Components/RedirectIfAuthenticated"));
const StudentRegistration = lazy(() => import("../Components/StudentRegistration"));
const StudentLogin = lazy(() => import("../Components/StudentLogin"));

const MainRouter = () => {
  return (
    <Suspense fallback={
        <div className="h-screen flex items-center justify-center bg-[#f8fafc]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    }>
        <Routes>
          {/* Main Website Wrapper */}
          <Route path="/" element={<RootLayout />}>
            {PublicRoutes}
            
            {/* Guest Only Routes (Redirect to dashboard if logged in) */}
            <Route element={<RedirectIfAuthenticated />}>
              <Route path="student-login" element={<StudentLogin />} />
              <Route path="student-registration" element={<StudentRegistration />} />
            </Route>
          </Route>
    
          {/* Student Portal (Protected) */}
          <Route element={<ProtectedStudentRoute />}>
            <Route path="/student-dashboard" element={<DashboardLayout />}>
              <Route index element={<StudentDashboard />} />
              <Route path="exams" element={<StudentDashboard />} /> 
              <Route path="resources" element={<StudentDashboard />} />
              <Route path="certificates" element={<StudentDashboard />} />
              <Route path="profile" element={<StudentDashboard />} />
            </Route>
            
            <Route path="/test-interface" element={<TestInterface />} />
            <Route path="/waiting-room" element={<WaitingRoom />} />
            <Route path="/feedback" element={<FeedbackForm />} />
            <Route path="/student-results" element={<ExamResults />} />
          </Route>
    
          <Route path="/verify/:id" element={<VerifyCertificate />} />
          <Route path="/student/:id" element={<StudentDetails />} />
          {EmployeeRoutes}
          {AdminRoutes}
          
          {/* Universal Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </Suspense>
  );
};

export default MainRouter;

