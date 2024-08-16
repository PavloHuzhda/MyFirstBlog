import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
