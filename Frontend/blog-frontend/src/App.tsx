import React from 'react';
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import BlogList from './Components/BlogList';
import Home from './Components/Home';
import Register from './Components/Register';
import Login from './Components/Login';
import ProtectedRoute from './Components/ProtectedRoute';
import { AuthProvider } from './Contexts/AuthContext';
import Footer from './Components/Footer';
import Logout from './Components/Logout';
import PublicRoute from './Components/PublicRoute';
import CreateBlog from './Components/CreateBlog';
import { Header } from './Components/Header';

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
          <Header />
          <div style={{ marginTop: '64px', flexGrow: 1 }}> {/* Adjust marginTop to match header height */}
            <Routes>
              {/* Public routes accessible without authentication */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Protected routes accessible only after authentication */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/blogs" element={<BlogList />} />
                <Route path="/create-blog" element={<CreateBlog />} />
                <Route path="/logout" element={<Logout />} />
              </Route>

              {/* Catch-all route for non-authenticated users trying to access protected routes */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
