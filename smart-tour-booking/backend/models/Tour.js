const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  nearbyTouristSpots: [{
    name: String,
    distance: String,
    description: String
  }],
  duration: {
    days: {
      type: Number,
      required: true
    },
    nights: {
      type: Number,
      required: true
    }
  },
  included: {
    food: [{
      name: String,
      type: String, // breakfast, lunch, dinner, snacks
      description: String
    }],
    accommodation: Boolean,
    transportation: Boolean,
    guidedTour: Boolean
  },
  basePricePerDay: {
    type: Number,
    required: true
  },
  pricePerKm: {
    type: Number,
    required: true
  },
  maxKms: {
    type: Number
  },
  image: String,
  seasonalTheme: {
    type: String,
    enum: ['summer', 'monsoon', 'winter', 'spring', 'autumn'],
    default: 'summer'
  },
  availableSeasons: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tour', TourSchema);
