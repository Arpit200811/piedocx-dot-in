import { lazy } from "react";
import { Route } from "react-router-dom";

const Dashboard = lazy(() => import("../components/Dashboard"));
const Profile = lazy(() => import("../components/Profile"));
const DashboardProject = lazy(() => import("../components/DashboardProject"));

export const EmployeeRoutes = (
    <Route path="/employee" element={<Dashboard />}>
        <Route path="profile" element={<Profile />} />
        <Route path="dashboard-project" element={<DashboardProject />} />
    </Route>
);
