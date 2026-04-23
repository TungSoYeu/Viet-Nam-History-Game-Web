import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTeacherRole, normalizeRole } from '../utils/roleUtils';

export function AuthGuard({ children }) {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export function TeacherGuard({ children }) {
  const userId = localStorage.getItem('userId');
  const role = normalizeRole(localStorage.getItem('role'));
  if (!userId) {
    return <Navigate to="/" replace />;
  }
  if (!isTeacherRole(role)) {
    return <Navigate to="/home" replace />;
  }
  return children;
}

export const AdminGuard = TeacherGuard;
