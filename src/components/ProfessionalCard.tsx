import React from 'react';
import { Professional } from '../lib/supabase';
import './ProfessionalCard.css';

interface ProfessionalCardProps {
  professional: Professional;
  onSelect?: (id: string) => void;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  professional,
  onSelect,
}) => {
  const renderStars = (rating: number) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= Math.round(rating) ? 'filled' : 'empty'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="professional-card">
      <div className="card-header">
        {professional.avatar_url && (
          <img
            src={professional.avatar_url}
            alt={professional.name}
            className="avatar"
          />
        )}
        <div className="card-header-info">
          <h3>{professional.name}</h3>
          <p className="bio">{professional.bio || 'Professional pool service provider'}</p>
        </div>
      </div>

      <div className="card-body">
        <div className="rating-section">
          {renderStars(professional.rating || 0)}
          <span className="rating-text">
            {professional.rating?.toFixed(1) || 'No'} / 5.0
          </span>
          <span className="reviews">
            ({professional.reviews_count || 0} reviews)
          </span>
        </div>

        {professional.services && professional.services.length > 0 && (
          <div className="services-section">
            <h4>Services Offered:</h4>
            <ul className="services-list">
              {professional.services.slice(0, 3).map((service) => (
                <li key={service.id}>
                  <span className="service-name">{service.name}</span>
                  <span className="service-price">
                    ${service.price_min} - ${service.price_max}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="location-section">
          {professional.city && professional.state && (
            <p>
              📍 {professional.city}, {professional.state}
            </p>
          )}
        </div>

        {professional.response_time && (
          <div className="response-time">
            <p>⏱️ Responds in ~{professional.response_time} min</p>
          </div>
        )}
      </div>

      {onSelect && (
        <div className="card-footer">
          <button
            className="select-btn"
            onClick={() => onSelect(professional.id)}
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
};
