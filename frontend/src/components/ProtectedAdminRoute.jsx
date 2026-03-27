import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    if (decoded?.role !== 'admin' || (decoded?.exp && decoded.exp <= now)) {
      localStorage.removeItem('adminToken');
      return <Navigate to="/admin-login" replace />;
    }
  } catch {
    localStorage.removeItem('adminToken');
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
