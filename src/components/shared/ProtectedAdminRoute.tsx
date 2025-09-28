import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  children,
}) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // Check if user is authenticated and is admin
  // Check for admin role or specific admin email
  const isAdmin =
    user &&
    (user.role === 'admin' ||
      user.role === 'ADMIN' ||
      user.email === 'admin@library.local');

  if (!user || !isAdmin) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};
