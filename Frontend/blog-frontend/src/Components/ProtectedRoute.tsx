import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { Header } from './Header';
import { Box } from '@mui/material';

const ProtectedRoute: React.FC = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header />
      <Box sx={{ marginTop: '64px', padding: '16px' }}> {/* Adjust marginTop to match header height */}
        <Outlet />
      </Box>
    </>
  );
};

export default ProtectedRoute;
