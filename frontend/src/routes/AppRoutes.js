// frontend/src/routes/AppRoutes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';

const isAuthenticated = () => !!localStorage.getItem('token');

const isAdmin = () => {
  const userJson = localStorage.getItem('user');
  if (!userJson) return false;
  try {
    const user = JSON.parse(userJson);
    return user.role === 'admin';
  } catch (error) {
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated() || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
