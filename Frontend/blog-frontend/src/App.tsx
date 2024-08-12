import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import BlogList from './Components/BlogList';
import Home from './Components/Home';
import Register from './Components/Register';
import Login from './Components/Login';
import ProtectedRoute from './Components/ProtectedRoute';
import { AuthProvider } from './Contexts/AuthContext';
import Footer from './Components/Footer';
import Logout from './Components/Logout';
import PublicRoute from './Components/PublicRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Routes>
            {/* Public routes */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/blogs" element={<BlogList />} />
            </Route>

            {/* Logout route */}
            <Route path="/logout" element={<Logout />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
