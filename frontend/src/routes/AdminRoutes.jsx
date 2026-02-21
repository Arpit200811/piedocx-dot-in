import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import { ADMIN_PATH } from "../utils/info";

const AdminLogin = lazy(() => import("../components/AdminLogin"));
const ProtectedAdminRoute = lazy(() => import("../components/ProtectedAdminRoute"));
const AdminDashboard = lazy(() => import("../components/AdminDashboard"));
const AdminPanel = lazy(() => import("../components/AdminPanel"));
const AdminCertificateManager = lazy(() => import("../components/AdminCertificateManager"));
const AdminHome = lazy(() => import("../components/AdminHome"));
const AdminDataHub = lazy(() => import("../components/AdminDataHub"));
const AnalyticsOverview = lazy(() => import("../components/AnalyticsOverview"));
const AdminTestManager = lazy(() => import("../components/AdminTestManager"));
const AdminContentManager = lazy(() => import("../components/AdminContentManager"));
const AdminResultArchives = lazy(() => import("../components/AdminResultArchives"));
const AdminResultDetails = lazy(() => import("../components/AdminResultDetails"));
const RiskFeedPanel = lazy(() => import("../components/RiskFeedPanel"));
const AdminFeedback = lazy(() => import("../components/AdminFeedback"));

const AdminWrapper = ({ children }) => (
  <ProtectedAdminRoute>
    <AdminDashboard>
      {children}
    </AdminDashboard>
  </ProtectedAdminRoute>
);

export const AdminRoutes = (
  <>
    <Route path="/admin-login" element={<AdminLogin />} />

    {/* Admin Protected Routes */}
    <Route path={ADMIN_PATH} element={<AdminWrapper><AdminPanel /></AdminWrapper>} />
    <Route path="/admin-dashboard" element={<AdminWrapper><AdminHome /></AdminWrapper>} />
    <Route path="/admin-data" element={<AdminWrapper><AdminDataHub /></AdminWrapper>} />
    <Route path="/admin-analytics" element={<AdminWrapper><AnalyticsOverview /></AdminWrapper>} />
    <Route path="/admin-tests" element={<AdminWrapper><AdminTestManager /></AdminWrapper>} />
    <Route path="/admin-content" element={<AdminWrapper><AdminContentManager /></AdminWrapper>} />
    <Route path="/admin-monitor" element={<AdminWrapper><RiskFeedPanel /></AdminWrapper>} />
    <Route path="/admin-certificates" element={<AdminWrapper><AdminCertificateManager /></AdminWrapper>} />
    <Route path="/admin-results" element={<AdminWrapper><AdminResultArchives /></AdminWrapper>} />
    <Route path="/admin-feedback" element={<AdminWrapper><AdminFeedback /></AdminWrapper>} />
    <Route path="/admin-result-details/:id" element={<AdminWrapper><AdminResultDetails /></AdminWrapper>} />
  </>
);
