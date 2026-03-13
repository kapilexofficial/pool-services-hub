import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <header className="home-header">
        <nav className="navbar">
          <h1 className="logo">🏊 Pool Services Hub</h1>
          <div className="nav-links">
            {isAuthenticated ? (
              <>
                <button onClick={() => navigate('/search')} className="nav-link">
                  Find Services
                </button>
                <button onClick={() => navigate('/dashboard')} className="nav-link">
                  Dashboard
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="nav-link">
                  Log In
                </button>
                <button onClick={() => navigate('/signup')} className="nav-link signup-link">
                  Sign Up
                </button>
              </>
            )}
          </div>
        </nav>

        <div className="hero">
          <h2>Find Trusted Pool Professionals</h2>
          <p>Book pool cleaning, maintenance, and repair services with confidence</p>
          <button
            onClick={() => navigate(isAuthenticated ? '/search' : '/signup')}
            className="cta-btn"
          >
            Get Started
          </button>
        </div>
      </header>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3>Find Professionals</h3>
          <p>Search and filter by location, service type, and ratings</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3>Easy Booking</h3>
          <p>Schedule appointments at your convenience</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⭐</div>
          <h3>Verified Reviews</h3>
          <p>See ratings from real customers</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">💳</div>
          <h3>Secure Payments</h3>
          <p>Pay safely with Stripe integration</p>
        </div>
      </section>
    </div>
  );
};
