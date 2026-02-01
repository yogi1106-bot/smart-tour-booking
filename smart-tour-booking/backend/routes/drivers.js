const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const auth = require('../middleware/auth');

// Get all drivers
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) query.status = status;

    const drivers = await Driver.find(query)
      .populate('userId', 'name email phone')
      .populate('assignedVehicles');

    res.json({
      success: true,
      count: drivers.length,
      data: drivers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching drivers',
      error: error.message
    });
  }
});

// Get single driver
router.get('/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('assignedVehicles');

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.json({
      success: true,
      data: driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching driver',
      error: error.message
    });
  }
});

// Create driver (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const driver = new Driver(req.body);
    await driver.save();

    const populatedDriver = await driver.populate('userId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Driver created successfully',
      data: populatedDriver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating driver',
      error: error.message
    });
  }
});

// Update driver
router.put('/:id', auth, async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone');

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.json({
      success: true,
      message: 'Driver updated successfully',
      data: driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating driver',
      error: error.message
    });
  }
});

module.exports = router;
