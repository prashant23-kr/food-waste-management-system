import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/donor/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          Unauthorized
        </h1>
        <p className="text-secondary-500">
          You don't have permission to access this page.
        </p>
        <a
          href={user.role === "donor" ? "/donor/dashboard" : "/ngo/dashboard"}
          className="btn-primary"
        >
          Go to Dashboard
        </a>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
