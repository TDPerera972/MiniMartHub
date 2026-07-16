import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;