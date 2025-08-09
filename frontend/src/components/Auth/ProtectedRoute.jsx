import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';
import { AlertCircle, Lock } from 'lucide-react';

const ProtectedRoute = ({ 
  children, 
  requiredPermissions = [], 
  requiredRoles = [],
  requireAuth = true,
  fallback = null 
}) => {
  const { isAuthenticated, isLoading, user, canAccess } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check permissions and roles
  if (isAuthenticated && (requiredPermissions.length > 0 || requiredRoles.length > 0)) {
    if (!canAccess(requiredPermissions, requiredRoles)) {
      // Show access denied page or fallback component
      if (fallback) {
        return fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="w-full max-w-md mx-auto text-center">
            <div className="p-8 bg-white rounded-lg shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <Lock className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">Access Denied</h1>
              <p className="mb-6 text-gray-600">
                You don't have permission to access this page.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p><strong>Your Role:</strong> {user?.role || 'Unknown'}</p>
                {requiredRoles.length > 0 && (
                  <p><strong>Required Roles:</strong> {requiredRoles.join(', ')}</p>
                )}
                {requiredPermissions.length > 0 && (
                  <p><strong>Required Permissions:</strong> {requiredPermissions.join(', ')}</p>
                )}
              </div>
              <div className="mt-6">
                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-2 text-white transition-colors rounded-lg bg-avalanche-600 hover:bg-avalanche-700"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
