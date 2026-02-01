import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import './Home.css'; // Reuse existing styles

const Profile = () => {
  const { user, updateProfile, loading } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.message || 'Failed to update profile');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      pincode: user.pincode || ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="profile-not-logged-in">
            <h1>Please Login</h1>
            <p>You need to be logged in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account information</p>
        </div>

        {message && (
          <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-avatar">
              <FaUser className="avatar-icon" />
            </div>

            <div className="profile-info">
              <div className="info-item">
                <FaEnvelope className="info-icon" />
                <div>
                  <label>Email</label>
                  <p>{user.email}</p>
                </div>
              </div>

              <div className="info-item">
                <FaUser className="info-icon" />
                <div>
                  <label>Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="profile-input"
                    />
                  ) : (
                    <p>{user.name}</p>
                  )}
                </div>
              </div>

              <div className="info-item">
                <FaPhone className="info-icon" />
                <div>
                  <label>Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="profile-input"
                    />
                  ) : (
                    <p>{user.phone}</p>
                  )}
                </div>
              </div>

              <div className="info-item">
                <FaMapMarkerAlt className="info-icon" />
                <div>
                  <label>Address</label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="profile-textarea"
                      rows="2"
                    />
                  ) : (
                    <p>{user.address}</p>
                  )}
                </div>
              </div>

              <div className="address-details">
                <div className="info-item">
                  <label>City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="profile-input"
                    />
                  ) : (
                    <p>{user.city}</p>
                  )}
                </div>

                <div className="info-item">
                  <label>State</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="profile-input"
                    />
                  ) : (
                    <p>{user.state}</p>
                  )}
                </div>

                <div className="info-item">
                  <label>Pincode</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="profile-input"
                    />
                  ) : (
                    <p>{user.pincode}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-actions">
              {isEditing ? (
                <div className="edit-actions">
                  <button
                    onClick={handleSubmit}
                    className="btn-primary"
                    disabled={loading}
                  >
                    <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn-secondary"
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary"
                >
                  <FaEdit /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;