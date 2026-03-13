import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Professional, Booking } from '../lib/supabase';
import { bookingAPI } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import './BookingForm.css';

interface BookingFormProps {
  professional: Professional;
  onSuccess?: (booking: Booking) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ professional, onSuccess }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    bookingDate: '',
    bookingTime: '09:00',
    service: professional.services?.[0]?.id || '',
    address: '',
    description: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || user.user_type !== 'client') {
      setError('Only clients can book appointments');
      return;
    }

    if (!formData.bookingDate || !formData.service || !formData.address) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const booking = await bookingAPI.createBooking({
        client_id: user.id,
        professional_id: professional.id,
        service_id: formData.service,
        booking_date: formData.bookingDate,
        booking_time: formData.bookingTime,
        address: formData.address,
        description: formData.description,
        status: 'pending',
      });

      if (onSuccess) {
        onSuccess(booking);
      }

      // Navigate to booking confirmation
      navigate(`/booking/${booking.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="booking-form-container">
      <div className="booking-form-card">
        <h2>Book {professional.name}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="service">Service</label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
            >
              <option value="">Select a service</option>
              {professional.services?.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - ${service.price_min} - ${service.price_max}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bookingDate">Date</label>
              <input
                id="bookingDate"
                type="date"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleChange}
                min={minDate}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bookingTime">Time</label>
              <input
                id="bookingTime"
                type="time"
                name="bookingTime"
                value={formData.bookingTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              name="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Additional Details</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe any specific pool conditions or requirements..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <div className="summary-item">
              <span>Professional:</span>
              <span>{professional.name}</span>
            </div>
            <div className="summary-item">
              <span>Date:</span>
              <span>
                {formData.bookingDate
                  ? new Date(formData.bookingDate).toLocaleDateString()
                  : 'Not selected'}
              </span>
            </div>
            <div className="summary-item">
              <span>Time:</span>
              <span>{formData.bookingTime}</span>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? 'Creating Booking...' : 'Book Now'}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="cancel-btn"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};
