const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  numberOfDays: {
    type: Number,
    required: true
  },
  numberOfPassengers: {
    type: Number,
    required: true
  },
  passengers: [{
    name: String,
    age: Number,
    email: String,
    phone: String
  }],
  estimatedKms: {
    type: Number,
    required: true
  },
  foodPreferences: {
    breakfast: Boolean,
    lunch: Boolean,
    dinner: Boolean,
    snacks: Boolean,
    specialDiets: [String] // veg, non-veg, vegan, etc
  },
  costBreakdown: {
    vehicleRentPerDay: Number,
    totalVehicleRent: Number,
    kmBasedCharge: Number,
    foodCost: Number,
    driverCharges: Number,
    accommodationCost: Number,
    discountAmount: Number,
    subtotal: Number,
    gst: Number,
    totalAmount: Number
  },
  advanceAmount: {
    type: Number,
    required: true
  },
  remainingAmount: Number,
  paymentStatus: {
    type: String,
    enum: ['pending', 'advance-paid', 'partial-paid', 'completed'],
    default: 'pending'
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed', 'in-progress'],
    default: 'confirmed'
  },
  cancellationReason: String,
  specialRequests: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
