import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { bookingsAPI } from '../services/api';
import './Home.css'; // Reuse existing styles
import { FaCalendarAlt, FaMapMarkerAlt, FaBus, FaUser, FaRupeeSign, FaEye, FaTimes, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getUserBookings();
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setMessage('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      case 'completed': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <FaCheckCircle />;
      case 'pending': return <FaClock />;
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

  if (!user) {
    return (
      <div className="my-bookings-page">
        <div className="container">
          <div className="not-logged-in">
            <h1>Please Login</h1>
            <p>You need to be logged in to view your bookings.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-bookings-page">
      <div className="container">
        <div className="bookings-header">
          <h1>My Bookings</h1>
          <p>View and manage your tour bookings</p>
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
                <h3>No Bookings Found</h3>
                <p>You haven't made any bookings yet.</p>
                <a href="/tours" className="btn-primary">Browse Tours</a>
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
                            <label>Passengers</label>
                            <p>{booking.numberOfPassengers} passenger{booking.numberOfPassengers !== 1 ? 's' : ''}</p>
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
                            <small>Advance: ₹{booking.advanceAmount?.toLocaleString() || 'N/A'}</small>
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
                    <p><strong>Name:</strong> {selectedBooking.tourId?.name}</p>
                    <p><strong>Location:</strong> {selectedBooking.tourId?.location}</p>
                    <p><strong>Area:</strong> {selectedBooking.tourId?.area}</p>
                  </div>

                  <div className="detail-section">
                    <h3>Vehicle Information</h3>
                    <p><strong>Model:</strong> {selectedBooking.vehicleId?.model}</p>
                    <p><strong>Type:</strong> {selectedBooking.vehicleId?.type}</p>
                    <p><strong>Registration:</strong> {selectedBooking.vehicleId?.registrationNumber}</p>
                  </div>

                  <div className="detail-section">
                    <h3>Travel Details</h3>
                    <p><strong>Start Date:</strong> {formatDate(selectedBooking.startDate)}</p>
                    <p><strong>End Date:</strong> {formatDate(selectedBooking.endDate)}</p>
                    <p><strong>Duration:</strong> {selectedBooking.numberOfDays} days</p>
                    <p><strong>Passengers:</strong> {selectedBooking.numberOfPassengers}</p>
                    <p><strong>Estimated KMs:</strong> {selectedBooking.estimatedKms}</p>
                  </div>

                  <div className="detail-section">
                    <h3>Cost Breakdown</h3>
                    {selectedBooking.costBreakdown ? (
                      <>
                        <p><strong>Vehicle Rent:</strong> ₹{selectedBooking.costBreakdown.totalVehicleRent?.toLocaleString() || 'N/A'}</p>
                        <p><strong>KM Charges:</strong> ₹{selectedBooking.costBreakdown.kmBasedCharge?.toLocaleString() || 'N/A'}</p>
                        <p><strong>Food Cost:</strong> ₹{selectedBooking.costBreakdown.foodCost?.toLocaleString() || 'N/A'}</p>
                        <p><strong>Driver Charges:</strong> ₹{selectedBooking.costBreakdown.driverCharges?.toLocaleString() || 'N/A'}</p>
                        <p><strong>GST (18%):</strong> ₹{selectedBooking.costBreakdown.gst?.toLocaleString() || 'N/A'}</p>
                        <hr />
                        <p className="total"><strong>Total Amount:</strong> ₹{selectedBooking.costBreakdown.totalAmount?.toLocaleString() || 'N/A'}</p>
                        <p><strong>Advance Paid:</strong> ₹{selectedBooking.advanceAmount?.toLocaleString() || 'N/A'}</p>
                        <p><strong>Remaining:</strong> ₹{selectedBooking.remainingAmount?.toLocaleString() || 'N/A'}</p>
                      </>
                    ) : (
                      <p>No cost breakdown available</p>
                    )}
                  </div>

                  {selectedBooking.passengers && selectedBooking.passengers.length > 0 && (
                    <div className="detail-section full-width">
                      <h3>Passenger Details</h3>
                      <div className="passengers-list">
                        {selectedBooking.passengers.map((passenger, index) => (
                          <div key={index} className="passenger-item">
                            <p><strong>Name:</strong> {passenger?.name || 'Not provided'}</p>
                            <p><strong>Age:</strong> {passenger?.age || 'Not provided'}</p>
                            <p><strong>Gender:</strong> {passenger?.gender || 'Not provided'}</p>
                            <p><strong>Contact:</strong> {passenger?.contact || 'Not provided'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedBooking.payments && selectedBooking.payments.length > 0 && (
                    <div className="detail-section full-width">
                      <h3>Payment Information</h3>
                      <div className="payments-list">
                        {selectedBooking.payments.map((payment, index) => (
                          <div key={index} className="payment-item">
                            <div className="payment-header">
                              <span className="payment-method">{payment?.paymentMethod?.toUpperCase() || 'N/A'}</span>
                              <span className={`payment-status ${payment?.status || 'pending'}`}>
                                {payment?.status || 'pending'}
                              </span>
                            </div>
                            <div className="payment-details">
                              <p><strong>Amount:</strong> ₹{payment?.amount?.toLocaleString() || 'N/A'}</p>
                              <p><strong>Transaction ID:</strong> {payment?.transactionId || 'N/A'}</p>
                              <p><strong>Date:</strong> {payment?.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-IN') : 'N/A'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
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

export default MyBookings;