import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F5]">
        <div className="text-[#2D50A1] font-semibold text-lg">Loading...</div>
      </div>
    );
  }

  if (!admin) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;