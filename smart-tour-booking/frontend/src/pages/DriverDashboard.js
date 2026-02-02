import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { bookingsAPI } from '../services/api';
import './Home.css';
import { FaCalendarAlt, FaMapMarkerAlt, FaBus, FaUser, FaRupeeSign, FaEye, FaCheckCircle, FaClock, FaExclamationTriangle, FaPhone, FaTimes } from 'react-icons/fa';

const DriverDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && user.role === 'driver') {
      fetchDriverBookings();
    }
  }, [user]);

  const fetchDriverBookings = async () => {
    try {
      setLoading(true);
      // We'll need to create a new API endpoint for driver bookings
      const response = await bookingsAPI.getDriverBookings();
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching driver bookings:', error);
      setMessage('Failed to load your assigned bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'in-progress': return '#17a2b8';
      case 'cancelled': return '#dc3545';
      case 'completed': return '#6f42c1';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <FaCheckCircle />;
      case 'pending': return <FaClock />;
      case 'in-progress': return <FaBus />;
      case 'cancelled': return <FaTimes />;
      case 'completed': return <FaCheckCircle />;
      default: return <FaExclamationTriangle />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
  };

  const handleCloseDetails = () => {
    setSelectedBooking(null);
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await bookingsAPI.updateBookingStatus(bookingId, status);
      setMessage('Booking status updated successfully!');
      fetchDriverBookings(); // Refresh the list
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage('Failed to update booking status');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (!user) {
    return (
      <div className="driver-dashboard">
        <div className="container">
          <div className="not-logged-in">
            <h1>Please Login</h1>
            <p>You need to be logged in as a driver to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== 'driver') {
    return (
      <div className="driver-dashboard">
        <div className="container">
          <div className="access-denied">
            <h1>Access Denied</h1>
            <p>This page is only accessible to drivers.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="driver-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome, {user.name}!</h1>
          <p>Manage your assigned bookings</p>
        </div>

        {message && (
          <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading your bookings...</p>
          </div>
        ) : (
          <>
            {bookings.length === 0 ? (
              <div className="no-bookings">
                <h3>No Bookings Assigned</h3>
                <p>You don't have any bookings assigned yet.</p>
              </div>
            ) : (
              <div className="bookings-grid">
                {bookings.map((booking) => (
                  <div key={booking._id} className="booking-card">
                    <div className="booking-header">
                      <div className="booking-id">
                        <h3>{booking.bookingId}</h3>
                        <span
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(booking.status) }}
                        >
                          {getStatusIcon(booking.status)} {booking.status}
                        </span>
                      </div>
                      <div className="booking-date">
                        <FaCalendarAlt /> {formatDate(booking.createdAt)}
                      </div>
                    </div>

                    <div className="booking-content">
                      <div className="booking-info">
                        <div className="info-item">
                          <FaMapMarkerAlt className="info-icon" />
                          <div>
                            <label>Tour</label>
                            <p>{booking.tourId?.name || 'N/A'}</p>
                            <small>{booking.tourId?.location || ''}</small>
                          </div>
                        </div>

                        <div className="info-item">
                          <FaBus className="info-icon" />
                          <div>
                            <label>Vehicle</label>
                            <p>{booking.vehicleId?.model || 'N/A'}</p>
                            <small>{booking.vehicleId?.registrationNumber || ''}</small>
                          </div>
                        </div>

                        <div className="info-item">
                          <FaUser className="info-icon" />
                          <div>
                            <label>Customer</label>
                            <p>{booking.userId?.name || 'N/A'}</p>
                            <small>
                              <FaPhone /> {booking.userId?.phone || 'N/A'}
                            </small>
                          </div>
                        </div>
                      </div>

                      <div className="booking-dates">
                        <div className="date-range">
                          <div className="start-date">
                            <label>Start Date</label>
                            <p>{formatDate(booking.startDate)}</p>
                          </div>
                          <div className="end-date">
                            <label>End Date</label>
                            <p>{formatDate(booking.endDate)}</p>
                          </div>
                        </div>
                        <div className="duration">
                          <label>Duration</label>
                          <p>{booking.numberOfDays} day{booking.numberOfDays !== 1 ? 's' : ''}</p>
                        </div>
                      </div>

                      <div className="booking-amount">
                        <div className="amount-info">
                          <FaRupeeSign className="amount-icon" />
                          <div>
                            <label>Total Amount</label>
                            <p className="total-amount">₹{booking.costBreakdown?.totalAmount?.toLocaleString() || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="booking-actions">
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="btn-secondary"
                      >
                        <FaEye /> View Details
                      </button>
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(booking._id, 'in-progress')}
                          className="btn-primary"
                        >
                          <FaCheckCircle /> Start Trip
                        </button>
                      )}
                      {booking.status === 'in-progress' && (
                        <button
                          onClick={() => handleUpdateStatus(booking._id, 'completed')}
                          className="btn-success"
                        >
                          <FaCheckCircle /> Complete Trip
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="modal-overlay" onClick={handleCloseDetails}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Booking Details - {selectedBooking.bookingId}</h2>
                <button onClick={handleCloseDetails} className="close-btn">
                  <FaTimes />
                </button>
              </div>

              <div className="modal-body">
                <div className="details-grid">
                  <div className="detail-section">
                    <h3>Tour Information</h3>
                    <p><strong>Tour:</strong> {selectedBooking.tourId?.name}</p>
                    <p><strong>Location:</strong> {selectedBooking.tourId?.location}</p>
                    <p><strong>Duration:</strong> {selectedBooking.numberOfDays} days</p>
                  </div>

                  <div className="detail-section">
                    <h3>Vehicle Information</h3>
                    <p><strong>Vehicle:</strong> {selectedBooking.vehicleId?.model}</p>
                    <p><strong>Type:</strong> {selectedBooking.vehicleId?.type}</p>
                    <p><strong>Registration:</strong> {selectedBooking.vehicleId?.registrationNumber}</p>
                  </div>

                  <div className="detail-section">
                    <h3>Customer Information</h3>
                    <p><strong>Name:</strong> {selectedBooking.userId?.name}</p>
                    <p><strong>Email:</strong> {selectedBooking.userId?.email}</p>
                    <p><strong>Phone:</strong> {selectedBooking.userId?.phone}</p>
                  </div>

                  <div className="detail-section">
                    <h3>Booking Details</h3>
                    <p><strong>Passengers:</strong> {selectedBooking.numberOfPassengers}</p>
                    <p><strong>Start Date:</strong> {formatDate(selectedBooking.startDate)}</p>
                    <p><strong>End Date:</strong> {formatDate(selectedBooking.endDate)}</p>
                    <p><strong>Status:</strong> {selectedBooking.status}</p>
                    <div className="status-actions">
                      {selectedBooking.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(selectedBooking._id, 'in-progress')}
                          className="btn-primary"
                        >
                          <FaCheckCircle /> Start Trip
                        </button>
                      )}
                      {selectedBooking.status === 'in-progress' && (
                        <button
                          onClick={() => handleUpdateStatus(selectedBooking._id, 'completed')}
                          className="btn-success"
                        >
                          <FaCheckCircle /> Complete Trip
                        </button>
                      )}
                    </div>
                  </div>

                  {selectedBooking.passengers && selectedBooking.passengers.length > 0 && (
                    <div className="detail-section full-width">
                      <h3>Passenger Details</h3>
                      <div className="passengers-list">
                        {selectedBooking.passengers.map((passenger, index) => (
                          <div key={index} className="passenger-item">
                            <h4>Passenger {index + 1}</h4>
                            <p><strong>Name:</strong> {passenger.name}</p>
                            <p><strong>Age:</strong> {passenger.age}</p>
                            <p><strong>Gender:</strong> {passenger.gender}</p>
                            {passenger.contact && <p><strong>Contact:</strong> {passenger.contact}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedBooking.specialRequests && (
                    <div className="detail-section full-width">
                      <h3>Special Requests</h3>
                      <p>{selectedBooking.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;