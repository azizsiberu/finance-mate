import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Komponen untuk mengelola public routes (login, register)
// Jika pengguna sudah login, redirect ke homepage
const PublicRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return !isAuthenticated ? <>{element}</> : <Navigate to="/" />;
};

// Komponen untuk mengelola private routes (homepage, dll)
// Jika pengguna belum login, redirect ke login page
const PrivateRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? <>{element}</> : <Navigate to="/login" />;
};

// Komponen routes yang menggunakan context
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute element={<Login />} />} />
      <Route path="/register" element={<PublicRoute element={<Register />} />} />
      <Route path="/" element={<PrivateRoute element={<Homepage />} />} />
      {/* Add other routes here */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Wrapper untuk AuthProvider dan Router
const AuthenticatedApp: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

// Root component
const App: React.FC = () => {
  return (
    <Router>
      <CssBaseline />
      <AuthenticatedApp />
    </Router>
  );
};

export default App;
