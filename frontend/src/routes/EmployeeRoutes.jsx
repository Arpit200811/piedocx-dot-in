import { lazy } from "react";
import { Route } from "react-router-dom";

const Dashboard = lazy(() => import("../Components/Dashboard"));
const Profile = lazy(() => import("../Components/Profile"));
const DashboardProject = lazy(() => import("../Components/DashboardProject"));

export const EmployeeRoutes = (
    <Route path="/" element={<Dashboard />}>
        <Route path="profile" element={<Profile />} />
        <Route path="dashboard-project" element={<DashboardProject />} />
    </Route>
);
