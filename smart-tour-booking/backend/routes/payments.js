const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Generate payment ID
const generatePaymentId = () => {
  return 'PAY' + Date.now() + Math.floor(Math.random() * 1000);
};

// Create payment intent
router.post('/create-intent', auth, async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    // For card payments, we might not have a booking ID yet
    // We'll create the intent with metadata that can be used later
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // amount in paise
      currency: 'inr',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        bookingId: bookingId || 'pending',
        userId: req.user.userId
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment intent',
      error: error.message
    });
  }
});

// Record payment
router.post('/', auth, async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod, transactionId, stripePaymentIntentId, paymentType } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    let paymentIntentId = stripePaymentIntentId;
    let status = 'completed';

    // For card payments, create and confirm payment intent
    if (paymentMethod === 'credit-card' || paymentMethod === 'debit-card') {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // amount in paise
          currency: 'inr',
          payment_method: transactionId, // This is the payment method ID from frontend
          confirm: true,
          automatic_payment_methods: {
            enabled: true,
          },
          metadata: {
            bookingId: bookingId,
            userId: req.user.userId
          }
        });

        paymentIntentId = paymentIntent.id;
        status = paymentIntent.status === 'succeeded' ? 'completed' : 'pending';
      } catch (stripeError) {
        console.error('Stripe payment error:', stripeError);
        return res.status(400).json({
          success: false,
          message: 'Payment processing failed',
          error: stripeError.message
        });
      }
    }

    const payment = new Payment({
      paymentId: generatePaymentId(),
      bookingId,
      userId: req.user.userId,
      amount,
      paymentMethod,
      transactionId,
      stripePaymentIntentId: paymentIntentId,
      paymentType,
      status
    });

    await payment.save();

    // Update booking payment status
    if (paymentType === 'advance') {
      booking.paymentStatus = 'advance-paid';
    } else if (paymentType === 'full') {
      booking.paymentStatus = 'completed';
      booking.bookingStatus = 'completed';
    } else if (paymentType === 'balance') {
      booking.paymentStatus = 'completed';
      booking.bookingStatus = 'completed';
    }

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: payment
    });
  } catch (error) {
    console.error('Payment recording error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording payment',
      error: error.message
    });
  }
});

// Get payment details
router.get('/:bookingId', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ bookingId: req.params.bookingId });

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message
    });
  }
});

module.exports = router;
