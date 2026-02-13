import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStudentAuth } from '../context/StudentAuthContext';

const ProtectedStudentRoute = () => {
    const { isAuthenticated, loading } = useStudentAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic animate-pulse">
                        Verifying Session...
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login if not authenticated, but remember where they wanted to go
        return <Navigate to="/student-login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedStudentRoute;
