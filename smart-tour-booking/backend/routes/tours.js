const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');
const auth = require('../middleware/auth');

// Get all tours
router.get('/', async (req, res) => {
  try {
    const { area, season, minPrice, maxPrice } = req.query;
    let query = {};

    if (area) query.area = { $regex: area, $options: 'i' };
    if (season) query.availableSeasons = season;
    if (minPrice || maxPrice) {
      query.basePricePerDay = {};
      if (minPrice) query.basePricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.basePricePerDay.$lte = Number(maxPrice);
    }

    const tours = await Tour.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tours.length,
      data: tours
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tours',
      error: error.message
    });
  }
});

// Get single tour
router.get('/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    res.json({
      success: true,
      data: tour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tour',
      error: error.message
    });
  }
});

// Create tour (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      description,
      area,
      location,
      nearbyTouristSpots,
      duration,
      included,
      basePricePerDay,
      pricePerKm,
      maxKms,
      seasonalTheme,
      availableSeasons
    } = req.body;

    const tour = new Tour({
      name,
      description,
      area,
      location,
      nearbyTouristSpots,
      duration,
      included,
      basePricePerDay,
      pricePerKm,
      maxKms,
      seasonalTheme,
      availableSeasons
    });

    await tour.save();

    res.status(201).json({
      success: true,
      message: 'Tour created successfully',
      data: tour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating tour',
      error: error.message
    });
  }
});

// Update tour
router.put('/:id', auth, async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    res.json({
      success: true,
      message: 'Tour updated successfully',
      data: tour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating tour',
      error: error.message
    });
  }
});

module.exports = router;
