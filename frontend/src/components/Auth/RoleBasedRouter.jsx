import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * RoleBasedRouter - Intelligently routes users to appropriate dashboards
 * based on their role and current authentication state
 */
const RoleBasedRouter = () => {
  const { isAuthenticated, user, isLoading, getDashboardRoute } = useAuth();

  // Show loading while determining authentication state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-avalanche-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Determining your dashboard...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Get the appropriate dashboard route based on role
  const dashboardRoute = getDashboardRoute();
  
  return <Navigate to={dashboardRoute} replace />;
};

export default RoleBasedRouter;
