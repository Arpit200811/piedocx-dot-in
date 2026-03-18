import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PublicRoutes } from "./PublicRoutes";
import { AdminRoutes } from "./AdminRoutes";
import { EmployeeRoutes } from "./EmployeeRoutes";

const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.localStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.localStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        // Clear potential stuck PWA caches
        try {
          if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (let registration of registrations) {
              await registration.unregister();
            }
          }
        } catch (swErr) { }

        // A temporary load error, try refreshing the page once with a cache-buster
        window.localStorage.setItem('page-has-been-force-refreshed', 'true');
        const url = new URL(window.location.href);
        url.searchParams.set('reload', Date.now().toString());
        window.location.replace(url.toString());
        return new Promise(() => { }); // Never resolve, let page refresh take focus
      }

      // The error is real and persistent across reloads
      throw error;
    }
  });

const RootLayout = lazyWithRetry(() => import("../components/RootLayout"));
const StudentDetails = lazyWithRetry(() => import("../components/StudentDetails"));
const StudentDashboard = lazyWithRetry(() => import("../components/StudentDashboard"));
const TestInterface = lazyWithRetry(() => import("../components/Student/TestInterface"));
const WaitingRoom = lazyWithRetry(() => import("../components/Student/WaitingRoom"));
const ExamResults = lazyWithRetry(() => import("../components/Student/ExamResults"));
const FeedbackForm = lazyWithRetry(() => import("../components/Student/FeedbackForm"));
const VerifyCertificate = lazyWithRetry(() => import("../components/VerifyCertificate"));
const ProtectedStudentRoute = lazyWithRetry(() => import("../components/ProtectedStudentRoute"));
const DashboardLayout = lazyWithRetry(() => import("../layouts/DashboardLayout"));

const RedirectIfAuthenticated = lazyWithRetry(() => import("../components/RedirectIfAuthenticated"));
const StudentLogin = lazyWithRetry(() => import("../components/StudentLogin"));
const StudentRegistration = lazyWithRetry(() => import("../components/StudentRegistration"));
const PageNotfound = lazyWithRetry(() => import("../components/PageNotfound"));

const MainRouter = () => {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-blue-600/10 border-t-blue-600 animate-spin"></div>
        </div>
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

          {/* Catch-all for RootLayout */}
          <Route path="*" element={<PageNotfound />} />
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
        <Route path="*" element={<PageNotfound />} />
      </Routes>
    </Suspense>
  );
};

export default MainRouter;

