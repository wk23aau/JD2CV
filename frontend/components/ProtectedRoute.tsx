
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  isLoggedIn: boolean;
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    // User not logged in, redirect them to the home page.
    return <Navigate to="/" replace />;
  }

  return children; // User is logged in, render the protected component
};

export default ProtectedRoute;
