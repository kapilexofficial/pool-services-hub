import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthGuard } from '../components/AuthGuard';
import './DashboardPage.css';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <AuthGuard>
      <div className="dashboard-page">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn">
            Log Out
          </button>
        </header>

        <div className="dashboard-content">
          <div className="welcome-card">
            <h2>Welcome, {user?.profile.name || 'User'}!</h2>
            <p>Account Type: {user?.user_type === 'client' ? 'Client' : 'Professional'}</p>
          </div>

          <div className="dashboard-grid">
            {user?.user_type === 'client' ? (
              <>
                <div className="dashboard-card">
                  <h3>📅 My Bookings</h3>
                  <p>View and manage your service bookings</p>
                  <button onClick={() => navigate('/bookings')}>View Bookings</button>
                </div>

                <div className="dashboard-card">
                  <h3>🔍 Find Services</h3>
                  <p>Search for pool professionals near you</p>
                  <button onClick={() => navigate('/search')}>Search Now</button>
                </div>
              </>
            ) : (
              <>
                <div className="dashboard-card">
                  <h3>📋 Service Requests</h3>
                  <p>View and manage booking requests from clients</p>
                  <button onClick={() => navigate('/requests')}>View Requests</button>
                </div>

                <div className="dashboard-card">
                  <h3>⭐ My Profile</h3>
                  <p>Update your professional profile and services</p>
                  <button onClick={() => navigate('/profile')}>Edit Profile</button>
                </div>

                <div className="dashboard-card">
                  <h3>💰 Earnings</h3>
                  <p>View your earnings and transaction history</p>
                  <button onClick={() => navigate('/earnings')}>View Earnings</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};
