import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfessionals } from '../hooks/useProfessionals';
import { ProfessionalCard } from './ProfessionalCard';
import './ProfessionalSearch.css';

export const ProfessionalSearch: React.FC = () => {
  const navigate = useNavigate();
  const { professionals, isLoading, error, searchProfessionals } = useProfessionals();

  const [filters, setFilters] = useState({
    service: '',
    city: '',
    minRating: 0,
    sortBy: 'rating' as 'rating' | 'reviews' | 'recent',
  });

  useEffect(() => {
    // Initial search
    searchProfessionals(filters);
  }, []);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: name === 'minRating' ? parseFloat(value) : value,
    };
    setFilters(newFilters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchProfessionals(filters);
  };

  const handleSelectProfessional = (professionalId: string) => {
    navigate(`/professional/${professionalId}`);
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h1>Find Pool Professionals</h1>
        <p>Browse and book trusted professionals in your area</p>
      </div>

      <form className="search-filters" onSubmit={handleSearch}>
        <div className="filter-group">
          <label htmlFor="service">Service Type</label>
          <input
            id="service"
            type="text"
            name="service"
            placeholder="e.g., Pool Cleaning, Maintenance"
            value={filters.service}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            name="city"
            placeholder="e.g., Miami, Tampa"
            value={filters.city}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="minRating">Minimum Rating</label>
          <select
            id="minRating"
            name="minRating"
            value={filters.minRating}
            onChange={handleFilterChange}
          >
            <option value="0">All Ratings</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sortBy">Sort By</label>
          <select
            id="sortBy"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
          >
            <option value="rating">Highest Rating</option>
            <option value="reviews">Most Reviews</option>
            <option value="recent">Recently Active</option>
          </select>
        </div>

        <button type="submit" className="search-btn">
          Search
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="professionals-grid">
        {isLoading ? (
          <div className="loading">Loading professionals...</div>
        ) : professionals.length > 0 ? (
          professionals.map((professional) => (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
              onSelect={handleSelectProfessional}
            />
          ))
        ) : (
          <div className="no-results">
            <p>No professionals found matching your criteria.</p>
            <p>Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
