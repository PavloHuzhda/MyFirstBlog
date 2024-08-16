import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';

const PublicRoute: React.FC = () => {
    const { token } = useAuth();

    return token ? <Navigate to="/blogs" /> : <Outlet />;
};

export default PublicRoute;
