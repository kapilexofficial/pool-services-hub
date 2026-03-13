import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredUserType?: 'client' | 'professional';
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredUserType }) => {
  const { isAuthenticated, isLoading, user, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredUserType && user?.user_type !== requiredUserType) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
