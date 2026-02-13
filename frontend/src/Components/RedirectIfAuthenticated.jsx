import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStudentAuth } from '../context/StudentAuthContext';

const RedirectIfAuthenticated = () => {
    const { isAuthenticated, loading } = useStudentAuth();

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // If already logged in, skip the login/registration page
    if (isAuthenticated) {
        return <Navigate to="/student-dashboard" replace />;
    }

    return <Outlet />;
};

export default RedirectIfAuthenticated;
