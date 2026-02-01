const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  licenseExpiry: {
    type: Date,
    required: true
  },
  experience: {
    type: Number,
    required: true // years of experience
  },
  rating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5
  },
  reviews: [{
    bookingId: mongoose.Schema.Types.ObjectId,
    rating: Number,
    comment: String,
    createdAt: Date
  }],
  assignedVehicles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  }],
  totalTrips: {
    type: Number,
    default: 0
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String
  },
  documents: {
    licenseProof: String,
    aadharProof: String,
    backgroundCheckCertificate: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-leave'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Driver', DriverSchema);
