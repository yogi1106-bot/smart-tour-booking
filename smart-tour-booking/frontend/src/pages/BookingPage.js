import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext';
import { AuthContext } from '../context/AuthContext';
import './BookingPage.css';
import { FaMapMarkerAlt, FaClock, FaUtensils, FaUsers, FaCalendarAlt, FaBus } from 'react-icons/fa';

const BookingPage = () => {
  const { id: tourId } = useParams();
  const navigate = useNavigate();
  const { tours, vehicles } = useContext(BookingContext);
  const { token } = useContext(AuthContext);
  
  const tour = tours.find(t => t._id === tourId);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    numberOfPassengers: 1,
    estimatedKms: 0,
    foodPreferences: {
      breakfast: false,
      lunch: false,
      dinner: false,
      snacks: false
    },
    passengers: [{ name: '', age: '', gender: '', contact: '' }],
    specialRequests: ''
  });
  const [costBreakdown, setCostBreakdown] = useState(null);

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...formData.passengers];
    
    // Ensure the passenger object exists at this index
    if (!updatedPassengers[index]) {
      updatedPassengers[index] = { name: '', age: '', gender: '', contact: '' };
    }
    
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      passengers: updatedPassengers
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('food')) {
      const foodType = name.split('-')[1];
      setFormData({
        ...formData,
        foodPreferences: {
          ...formData.foodPreferences,
          [foodType]: checked
        }
      });
    } else if (name === 'numberOfPassengers') {
      const numPassengers = parseInt(value);
      const currentPassengers = [...formData.passengers];
      
      // Create new passenger array with proper structure
      const newPassengers = Array(numPassengers).fill().map((_, index) => {
        return currentPassengers[index] || { name: '', age: '', gender: '', contact: '' };
      });
      
      setFormData({
        ...formData,
        [name]: numPassengers,
        passengers: newPassengers
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'number' ? parseFloat(value) : value
      });
    }
  };

  const calculateCost = () => {
    if (!selectedVehicle || !formData.startDate || !formData.endDate) {
      alert('Please fill all required fields');
      return;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      alert('End date must be after start date');
      return;
    }

    const vehicleRentPerDay = selectedVehicle.dailyRatePerDay;
    const totalVehicleRent = vehicleRentPerDay * days;
    const kmBasedCharge = selectedVehicle.ratePerKm * formData.estimatedKms;
    
    let foodCost = 0;
    if (Object.values(formData.foodPreferences).some(val => val)) {
      foodCost = 500 * days * formData.numberOfPassengers;
    }

    const driverCharges = 200 * days;
    const subtotal = totalVehicleRent + kmBasedCharge + foodCost + driverCharges;
    const gst = subtotal * 0.18;
    const totalAmount = subtotal + gst;
    const advanceAmount = Math.round(totalAmount * 0.30); // 30% advance payment

    setCostBreakdown({
      vehicleRentPerDay,
      totalVehicleRent,
      kmBasedCharge,
      foodCost,
      driverCharges,
      gst,
      totalAmount,
      advanceAmount,
      remainingAmount: totalAmount - advanceAmount,
      days
    });
  };

  const handleBooking = () => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (!costBreakdown) {
      alert('Please calculate cost first');
      return;
    }

    // Validate passenger details
    for (let i = 0; i < formData.numberOfPassengers; i++) {
      const passenger = formData.passengers[i];
      if (!passenger || !passenger.name || !passenger.age || !passenger.gender) {
        alert(`Please fill in all required details for Passenger ${i + 1} (Name, Age, and Gender are required)`);
        return;
      }
    }

    navigate('/payment', {
      state: {
        tourId,
        vehicleId: selectedVehicle._id,
        bookingData: formData,
        costBreakdown
      }
    });
  };

  if (!tour) {
    return <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>Tour not found</div>;
  }

  return (
    <div className="booking-page">
      <div className="container">
        <div className="booking-header">
          <h1>Book Your Tour</h1>
          <p>{tour.name}</p>
        </div>

        <div className="booking-grid">
          {/* Left Column - Booking Form */}
          <div className="booking-form">
            <div className="form-section">
              <h2>Tour Details</h2>
              <div className="tour-summary">
                <div className="summary-item">
                  <FaMapMarkerAlt /> <span>{tour.location} - {tour.area}</span>
                </div>
                <div className="summary-item">
                  <FaClock /> <span>{tour.duration.days} Days / {tour.duration.nights} Nights</span>
                </div>
                {tour.nearbyTouristSpots && (
                  <div className="summary-item">
                    <span className="spots-title">Tourist Spots:</span>
                    <div className="spots-list">
                      {tour.nearbyTouristSpots.slice(0, 3).map((spot, idx) => (
                        <span key={idx} className="spot-badge">{spot.name}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="form-section">
              <h2>Select Vehicle</h2>
              <div className="vehicles-list">
                {vehicles.filter(v => v.status === 'available').map(vehicle => (
                  <div
                    key={vehicle._id}
                    className={`vehicle-option ${selectedVehicle?._id === vehicle._id ? 'selected' : ''}`}
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <div className="vehicle-info">
                      <h3><FaBus /> {vehicle.type.toUpperCase()} - {vehicle.model}</h3>
                      <p>Capacity: {vehicle.capacity} persons | ₹{vehicle.dailyRatePerDay}/day + ₹{vehicle.ratePerKm}/km</p>
                      <div className="vehicle-features">
                        {vehicle.ac && <span className="feature">AC</span>}
                        {vehicle.features?.map(feature => (
                          <span key={feature} className="feature">{feature}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h2>Travel Dates</h2>
              <div className="form-row">
                <div className="form-group">
                  <label><FaCalendarAlt /> Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label><FaCalendarAlt /> End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Passengers</h2>
              <div className="form-group">
                <label><FaUsers /> Number of Passengers</label>
                <input
                  type="number"
                  name="numberOfPassengers"
                  value={formData.numberOfPassengers}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  required
                />
              </div>

              {/* Passenger Details Form */}
              {formData.numberOfPassengers > 0 && formData.passengers && formData.passengers.length > 0 && (
                <div className="passengers-details">
                  <h3>Passenger Details</h3>
                  {formData.passengers.map((passenger, index) => (
                    <div key={index} className="passenger-form">
                      <h4>Passenger {index + 1}</h4>
                      <div className="passenger-fields">
                        <div className="form-group">
                          <label>Full Name *</label>
                          <input
                            type="text"
                            value={passenger?.name || ''}
                            onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                            placeholder="Enter full name"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Age *</label>
                          <input
                            type="number"
                            value={passenger?.age || ''}
                            onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                            placeholder="Enter age"
                            min="1"
                            max="100"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Gender *</label>
                          <select
                            value={passenger?.gender || ''}
                            onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                            required
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Contact Number</label>
                          <input
                            type="tel"
                            value={passenger?.contact || ''}
                            onChange={(e) => handlePassengerChange(index, 'contact', e.target.value)}
                            placeholder="Enter contact number"
                            pattern="[0-9]{10}"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-section">
              <h2>Journey Distance</h2>
              <div className="form-group">
                <label>Estimated KMs</label>
                <input
                  type="number"
                  name="estimatedKms"
                  value={formData.estimatedKms}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Food Preferences</h2>
              <div className="food-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="food-breakfast"
                    checked={formData.foodPreferences.breakfast}
                    onChange={handleInputChange}
                  />
                  <span><FaUtensils /> Breakfast</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="food-lunch"
                    checked={formData.foodPreferences.lunch}
                    onChange={handleInputChange}
                  />
                  <span><FaUtensils /> Lunch</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="food-dinner"
                    checked={formData.foodPreferences.dinner}
                    onChange={handleInputChange}
                  />
                  <span><FaUtensils /> Dinner</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="food-snacks"
                    checked={formData.foodPreferences.snacks}
                    onChange={handleInputChange}
                  />
                  <span><FaUtensils /> Snacks</span>
                </label>
              </div>
            </div>

            <div className="form-section">
              <h2>Special Requests</h2>
              <div className="form-group">
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  placeholder="Any special requests or requirements?"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <button onClick={calculateCost} className="btn-calculate">
              Calculate Cost
            </button>
          </div>

          {/* Right Column - Cost Summary */}
          <div className="cost-summary">
            <h2>Cost Summary</h2>
            {costBreakdown ? (
              <div className="summary-box">
                <div className="summary-row">
                  <span>Vehicle Rent (₹{costBreakdown.vehicleRentPerDay}/day × {costBreakdown.days} days)</span>
                  <span>₹{costBreakdown.totalVehicleRent.toFixed(2)}</span>
                </div>
                {costBreakdown.kmBasedCharge > 0 && (
                  <div className="summary-row">
                    <span>Distance Charge (₹{selectedVehicle.ratePerKm}/km × {formData.estimatedKms} km)</span>
                    <span>₹{costBreakdown.kmBasedCharge.toFixed(2)}</span>
                  </div>
                )}
                {costBreakdown.foodCost > 0 && (
                  <div className="summary-row">
                    <span>Food Cost</span>
                    <span>₹{costBreakdown.foodCost.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Driver Charges</span>
                  <span>₹{costBreakdown.driverCharges.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{(costBreakdown.totalVehicleRent + costBreakdown.kmBasedCharge + costBreakdown.foodCost + costBreakdown.driverCharges).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>GST (18%)</span>
                  <span>₹{costBreakdown.gst.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount</span>
                  <span>₹{costBreakdown.totalAmount.toFixed(2)}</span>
                </div>
                <div className="summary-row advance">
                  <span>Advance Payment (30%)</span>
                  <span>₹{(costBreakdown.totalAmount * 0.30).toFixed(2)}</span>
                </div>
                <button onClick={handleBooking} className="btn-book">
                  Proceed to Payment
                </button>
              </div>
            ) : (
              <div className="no-calculation">
                <p>Fill in all details and click "Calculate Cost" to see the summary</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
