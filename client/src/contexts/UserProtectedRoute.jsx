import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const UserProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-green-600 font-semibold text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    // Redirect to user login if not authenticated
    return <Navigate to="/UserLogin" replace />;
  }

  return children;
};

export default UserProtectedRoute;