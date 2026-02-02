const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const Vehicle = require('../models/Vehicle');
const auth = require('../middleware/auth');

// Generate booking ID
const generateBookingId = () => {
  return 'STB' + Date.now() + Math.floor(Math.random() * 1000);
};

// Calculate booking cost
const calculateCost = async (tourId, vehicleId, days, kms, foodPreference) => {
  try {
    const tour = await Tour.findById(tourId);
    const vehicle = await Vehicle.findById(vehicleId);

    if (!tour || !vehicle) {
      throw new Error('Tour or Vehicle not found');
    }

    const vehicleRentPerDay = vehicle.dailyRatePerDay;
    const totalVehicleRent = vehicleRentPerDay * days;
    const kmBasedCharge = vehicle.ratePerKm * kms;
    
    let foodCost = 0;
    if (foodPreference) {
      foodCost = 500 * days; // Example: 500 per day per person
    }

    const driverCharges = 200 * days; // Example driver charges
    const accommodationCost = 0; // Can be added based on requirements

    const subtotal = totalVehicleRent + kmBasedCharge + foodCost + driverCharges + accommodationCost;
    const gst = subtotal * 0.18; // 18% GST
    const totalAmount = subtotal + gst;

    return {
      vehicleRentPerDay,
      totalVehicleRent,
      kmBasedCharge,
      foodCost,
      driverCharges,
      accommodationCost,
      discountAmount: 0,
      subtotal,
      gst,
      totalAmount
    };
  } catch (error) {
    throw error;
  }
};

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const {
      tourId,
      vehicleId,
      driverId,
      startDate,
      endDate,
      numberOfPassengers,
      passengers,
      estimatedKms,
      foodPreferences,
      specialRequests
    } = req.body;

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const numberOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // Calculate cost
    const costBreakdown = await calculateCost(
      tourId,
      vehicleId,
      numberOfDays,
      estimatedKms,
      foodPreferences
    );

    const advanceAmount = costBreakdown.totalAmount * 0.30; // 30% advance

    const booking = new Booking({
      bookingId: generateBookingId(),
      userId: req.user.userId,
      tourId,
      vehicleId,
      driverId,
      startDate,
      endDate,
      numberOfDays,
      numberOfPassengers,
      passengers,
      estimatedKms,
      foodPreferences,
      costBreakdown,
      advanceAmount,
      remainingAmount: costBreakdown.totalAmount - advanceAmount,
      specialRequests
    });

    await booking.save();
    const populatedBooking = await booking.populate('tourId vehicleId driverId');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: populatedBooking
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
});

// Get user bookings
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId })
      .populate('tourId', 'name location area')
      .populate('vehicleId', 'type model registrationNumber')
      .populate({
        path: 'driverId',
        select: 'licenseNumber experience',
        populate: {
          path: 'userId',
          select: 'name phone'
        }
      })
      .sort({ createdAt: -1 });

    // Get payments for each booking
    const bookingsWithPayments = await Promise.all(
      bookings.map(async (booking) => {
        const payments = await require('../models/Payment').find({ bookingId: booking._id });
        return {
          ...booking.toObject(),
          payments
        };
      })
    );

    res.json({
      success: true,
      count: bookingsWithPayments.length,
      data: bookingsWithPayments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
});

// Get driver bookings
router.get('/driver', auth, async (req, res) => {
  try {
    // Find the driver document for this user
    const Driver = require('../models/Driver');
    const driver = await Driver.findOne({ userId: req.user.userId });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found'
      });
    }

    const bookings = await Booking.find({ driverId: driver._id })
      .populate('tourId', 'name location area')
      .populate('vehicleId', 'type model registrationNumber')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    // Get payments for each booking
    const bookingsWithPayments = await Promise.all(
      bookings.map(async (booking) => {
        const payments = await require('../models/Payment').find({ bookingId: booking._id });
        return {
          ...booking.toObject(),
          payments
        };
      })
    );

    res.json({
      success: true,
      count: bookingsWithPayments.length,
      data: bookingsWithPayments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching driver bookings',
      error: error.message
    });
  }
});

// Get all bookings (Admin only)
router.get('/admin/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const bookings = await Booking.find({})
      .populate('tourId', 'name location area')
      .populate('vehicleId', 'type model registrationNumber')
      .populate('userId', 'name email phone')
      .populate({
        path: 'driverId',
        select: 'licenseNumber experience',
        populate: {
          path: 'userId',
          select: 'name phone'
        }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching all bookings',
      error: error.message
    });
  }
});

// Assign driver to booking (Admin only)
router.put('/:id/assign-driver', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { driverId } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { driverId },
      { new: true }
    ).populate('driverId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Driver assigned successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error assigning driver',
      error: error.message
    });
  }
});

// Update booking status (Admin or assigned Driver)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Find the booking first to check permissions
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check permissions
    if (req.user.role === 'admin') {
      // Admin can update any booking to any status
    } else if (req.user.role === 'driver') {
      // Find the driver document for this user
      const Driver = require('../models/Driver');
      const driver = await Driver.findOne({ userId: req.user.userId });

      if (!driver) {
        return res.status(403).json({
          success: false,
          message: 'Driver profile not found'
        });
      }

      // Driver can only update their assigned bookings
      if (!booking.driverId || booking.driverId.toString() !== driver._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only update your assigned bookings'
        });
      }

      // Driver can only change status to 'in-progress' or 'completed'
      if (!['in-progress', 'completed'].includes(status)) {
        return res.status(403).json({
          success: false,
          message: 'Drivers can only mark bookings as in-progress or completed'
        });
      }

      // Additional validation: can only start trip if status is confirmed
      if (status === 'in-progress' && booking.status !== 'confirmed') {
        return res.status(400).json({
          success: false,
          message: 'Can only start trip for confirmed bookings'
        });
      }

      // Can only complete trip if status is in-progress
      if (status === 'completed' && booking.status !== 'in-progress') {
        return res.status(400).json({
          success: false,
          message: 'Can only complete trip for in-progress bookings'
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    // Update the booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message
    });
  }
});

// Get single booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('tourId')
      .populate('vehicleId')
      .populate('driverId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
});

// Cancel booking
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    booking.bookingStatus = 'cancelled';
    booking.cancellationReason = cancellationReason;
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
});

module.exports = router;
