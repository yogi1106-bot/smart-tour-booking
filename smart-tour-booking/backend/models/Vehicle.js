const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['bus', 'van', 'tempo'],
    required: true
  },
  model: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  yearOfManufacture: {
    type: Number,
    required: true
  },
  ac: {
    type: Boolean,
    default: true
  },
  features: [String], // wifi, usb charging, entertainment, etc
  dailyRatePerDay: {
    type: Number,
    required: true
  },
  ratePerKm: {
    type: Number,
    required: true
  },
  image: String,
  status: {
    type: String,
    enum: ['available', 'booked', 'maintenance'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
