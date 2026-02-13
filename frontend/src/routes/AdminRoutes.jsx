import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import { ADMIN_PATH } from "../utils/info";

const AdminLogin = lazy(() => import("../Components/AdminLogin"));
const ProtectedAdminRoute = lazy(() => import("../Components/ProtectedAdminRoute"));
const AdminDashboard = lazy(() => import("../Components/AdminDashboard"));
const AdminPanel = lazy(() => import("../Components/AdminPanel"));
const AdminCertificateManager = lazy(() => import("../Components/AdminCertificateManager"));
const AdminHome = lazy(() => import("../Components/AdminHome"));
const AdminDataHub = lazy(() => import("../Components/AdminDataHub"));
const AnalyticsOverview = lazy(() => import("../Components/AnalyticsOverview"));
const AdminTestManager = lazy(() => import("../Components/AdminTestManager"));
const AdminContentManager = lazy(() => import("../Components/AdminContentManager"));
const AdminResultArchives = lazy(() => import("../Components/AdminResultArchives"));
const AdminResultDetails = lazy(() => import("../Components/AdminResultDetails"));
const RiskFeedPanel = lazy(() => import("../Components/RiskFeedPanel"));

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
    <Route path="/admin-result-details/:id" element={<AdminWrapper><AdminResultDetails /></AdminWrapper>} />
  </>
);
