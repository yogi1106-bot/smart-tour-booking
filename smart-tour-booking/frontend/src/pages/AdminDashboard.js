import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { bookingsAPI, driversAPI } from '../services/api';
import './Home.css';
import { FaCalendarAlt, FaMapMarkerAlt, FaBus, FaUser, FaRupeeSign, FaEdit, FaCheckCircle, FaClock, FaExclamationTriangle, FaPhone, FaUserCog, FaTimes, FaEye } from 'react-icons/fa';

const AdminDashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingBooking, setEditingBooking] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAllBookings();
      fetchAllDrivers();
    }
  }, [user]);

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getAllBookings();
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setMessage('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDrivers = async () => {
    try {
      const response = await driversAPI.getAllDrivers();
      setDrivers(response.data.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const handleAssignDriver = async (bookingId, driverId) => {
    try {
      await bookingsAPI.assignDriver(bookingId, driverId);
      setMessage('Driver assigned successfully!');
      fetchAllBookings(); // Refresh the list
      setEditingBooking(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error assigning driver:', error);
      setMessage('Failed to assign driver');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await bookingsAPI.updateBookingStatus(bookingId, status);
      setMessage('Booking status updated successfully!');
      fetchAllBookings(); // Refresh the list
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage('Failed to update booking status');
      setTimeout(() => setMessage(''), 3000);
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

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
  };

  const handleCloseDetails = () => {
    setSelectedBooking(null);
  };

  const handleCloseEdit = () => {
    setEditingBooking(null);
  };

  if (authLoading) {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <div className="not-logged-in">
            <h1>Please Login</h1>
            <p>You need to be logged in as an administrator to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <div className="access-denied">
            <h1>Access Denied</h1>
            <p>This page is only accessible to administrators.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Manage bookings and driver assignments</p>
        </div>

        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading bookings...</p>
          </div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Bookings</h3>
                <p className="stat-number">{bookings.length}</p>
              </div>
              <div className="stat-card">
                <h3>Pending</h3>
                <p className="stat-number">{bookings.filter(b => b.status === 'pending').length}</p>
              </div>
              <div className="stat-card">
                <h3>Confirmed</h3>
                <p className="stat-number">{bookings.filter(b => b.status === 'confirmed').length}</p>
              </div>
              <div className="stat-card">
                <h3>Assigned Drivers</h3>
                <p className="stat-number">{bookings.filter(b => b.driverId).length}</p>
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="no-bookings">
                <h3>No Bookings Found</h3>
                <p>There are no bookings in the system yet.</p>
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

                        <div className="info-item">
                          <FaUserCog className="info-icon" />
                          <div>
                            <label>Driver</label>
                            <p>{booking.driverId?.userId?.name || 'Not Assigned'}</p>
                            {booking.driverId && (
                              <small>
                                <FaPhone /> {booking.driverId.userId?.phone || 'N/A'}
                              </small>
                            )}
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
                        <FaEye /> View
                      </button>
                      <button
                        onClick={() => handleEditBooking(booking)}
                        className="btn-primary"
                      >
                        <FaEdit /> Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Edit Booking Modal */}
        {editingBooking && (
          <div className="modal-overlay" onClick={handleCloseEdit}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Manage Booking - {editingBooking.bookingId}</h2>
                <button onClick={handleCloseEdit} className="close-btn">
                  <FaTimes />
                </button>
              </div>

              <div className="modal-body">
                <div className="manage-section">
                  <h3>Assign Driver</h3>
                  <div className="driver-selection">
                    <select
                      value={editingBooking.driverId?._id || ''}
                      onChange={(e) => {
                        const selectedDriverId = e.target.value;
                        if (selectedDriverId) {
                          handleAssignDriver(editingBooking._id, selectedDriverId);
                        }
                      }}
                    >
                      <option value="">Select a driver...</option>
                      {drivers.map(driver => (
                        <option key={driver._id} value={driver._id}>
                          {driver.userId?.name} - {driver.userId?.phone}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="manage-section">
                  <h3>Update Status</h3>
                  <div className="status-buttons">
                    <button
                      className={`status-btn ${editingBooking.status === 'pending' ? 'active' : ''}`}
                      onClick={() => handleUpdateStatus(editingBooking._id, 'pending')}
                    >
                      <FaClock /> Pending
                    </button>
                    <button
                      className={`status-btn ${editingBooking.status === 'confirmed' ? 'active' : ''}`}
                      onClick={() => handleUpdateStatus(editingBooking._id, 'confirmed')}
                    >
                      <FaCheckCircle /> Confirmed
                    </button>
                    <button
                      className={`status-btn ${editingBooking.status === 'completed' ? 'active' : ''}`}
                      onClick={() => handleUpdateStatus(editingBooking._id, 'completed')}
                    >
                      <FaCheckCircle /> Completed
                    </button>
                    <button
                      className={`status-btn cancel ${editingBooking.status === 'cancelled' ? 'active' : ''}`}
                      onClick={() => handleUpdateStatus(editingBooking._id, 'cancelled')}
                    >
                      <FaTimes /> Cancelled
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                    <h3>Driver Information</h3>
                    <p><strong>Name:</strong> {selectedBooking.driverId?.userId?.name || 'Not Assigned'}</p>
                    <p><strong>Phone:</strong> {selectedBooking.driverId?.userId?.phone || 'N/A'}</p>
                    <p><strong>License:</strong> {selectedBooking.driverId?.licenseNumber || 'N/A'}</p>
                  </div>

                  <div className="detail-section">
                    <h3>Booking Details</h3>
                    <p><strong>Passengers:</strong> {selectedBooking.numberOfPassengers}</p>
                    <p><strong>Start Date:</strong> {formatDate(selectedBooking.startDate)}</p>
                    <p><strong>End Date:</strong> {formatDate(selectedBooking.endDate)}</p>
                    <p><strong>Status:</strong> {selectedBooking.status}</p>
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

export default AdminDashboard;