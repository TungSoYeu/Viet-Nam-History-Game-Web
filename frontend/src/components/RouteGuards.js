import React from 'react';
import { Navigate } from 'react-router-dom';

// Protects routes that require authentication
export function AuthGuard({ children }) {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Protects admin-only routes
export function AdminGuard({ children }) {
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');
  if (!userId) {
    return <Navigate to="/" replace />;
  }
  if (role !== 'admin') {
    return <Navigate to="/modes" replace />;
  }
  return children;
}
