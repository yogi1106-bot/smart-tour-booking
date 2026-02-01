import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingsAPI, paymentsAPI } from '../services/api';
import './Home.css';
import { FaCreditCard, FaMobileAlt, FaQrcode, FaCheckCircle, FaArrowLeft, FaRupeeSign, FaCopy, FaDownload } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { QRCodeCanvas } from 'qrcode.react';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51QX8EXAMPLE');

// Card Payment Form Component
const CardPaymentForm = ({ amount, bookingDetails, onPaymentSuccess, onPaymentError, disabled }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // First create the booking
      const bookingResponse = await bookingsAPI.createBooking({
        tourId: bookingDetails.tourId,
        vehicleId: bookingDetails.vehicleId,
        startDate: bookingDetails.formData.startDate,
        endDate: bookingDetails.formData.endDate,
        numberOfPassengers: bookingDetails.formData.numberOfPassengers,
        passengers: bookingDetails.formData.passengers,
        estimatedKms: bookingDetails.formData.estimatedKms,
        foodPreferences: bookingDetails.formData.foodPreferences,
        specialRequests: bookingDetails.formData.specialRequests
      });

      const newBookingId = bookingResponse.data.data._id;

      // Create payment intent for the booking
      const intentResponse = await paymentsAPI.createPaymentIntent(newBookingId, amount);
      const secret = intentResponse.data.clientSecret;

      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'Customer Name', // You can get this from user context
          },
        },
      });

      if (error) {
        onPaymentError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Record the payment in our database
        await paymentsAPI.recordPayment({
          bookingId: newBookingId,
          amount,
          paymentMethod: 'credit-card',
          transactionId: paymentIntent.id,
          stripePaymentIntentId: paymentIntent.id,
          paymentType: 'advance'
        });

        onPaymentSuccess(newBookingId);
      } else {
        onPaymentError('Payment was not successful. Please try again.');
      }
    } catch (error) {
      console.error('Card payment error:', error);
      onPaymentError(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="card-payment-form">
      <div className="card-element-container">
        <CardElement options={cardElementOptions} />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading || disabled}
        className="card-payment-btn"
      >
        {loading ? 'Processing...' : `Pay ₹${amount?.toLocaleString()}`}
      </button>
    </form>
  );
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, completed, failed
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Get booking data from navigation state
  const bookingData = location.state;

  useEffect(() => {
    if (!bookingData) {
      navigate('/tours');
      return;
    }
  }, [bookingData, navigate]);

  if (!bookingData) {
    return <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>Loading...</div>;
  }

  const { tourId, vehicleId, bookingData: formData, costBreakdown } = bookingData;

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <FaCreditCard />,
      description: 'Pay securely with your credit or debit card',
      requiresTransactionId: false
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: <FaMobileAlt />,
      description: 'Pay using UPI apps like Google Pay, PhonePe, Paytm',
      upiIds: [
        { name: 'Google Pay', id: 'smarttravel@okicici', qr: 'GPAY_QR' },
        { name: 'PhonePe', id: 'smarttravel@ybl', qr: 'PHONEPE_QR' },
        { name: 'Paytm', id: 'smarttravel@paytm', qr: 'PAYTM_QR' }
      ],
      requiresTransactionId: true
    },
    {
      id: 'qr',
      name: 'QR Code Scan',
      icon: <FaQrcode />,
      description: 'Scan QR code with any UPI app',
      qrCode: 'MAIN_QR_CODE',
      requiresTransactionId: true
    }
  ];

  const handlePaymentMethodSelect = (methodId) => {
    setPaymentMethod(methodId);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setMessage('UPI ID copied to clipboard!');
    setTimeout(() => setMessage(''), 2000);
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector('.qr-code-container canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'payment-qr-code.png';
      link.href = canvas.toDataURL();
      link.click();
      setMessage('QR Code downloaded successfully!');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleCardPaymentSuccess = (bookingId) => {
    setPaymentStatus('completed');
    setMessage('Payment successful! Booking confirmed.');

    // Redirect to my bookings after 3 seconds
    setTimeout(() => {
      navigate('/my-bookings');
    }, 3000);
  };

  const handleCardPaymentError = (errorMessage) => {
    setPaymentStatus('failed');
    setMessage(errorMessage);
  };

  const handlePaymentComplete = async () => {
    if (!paymentMethod) {
      setMessage('Please select a payment method');
      return;
    }

    const selectedMethod = paymentMethods.find(method => method.id === paymentMethod);

    if (selectedMethod.requiresTransactionId && !transactionId.trim()) {
      setMessage('Please enter transaction ID');
      return;
    }

    setLoading(true);
    setPaymentStatus('processing');

    try {
      // First create the booking
      const bookingResponse = await bookingsAPI.createBooking({
        tourId,
        vehicleId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        numberOfPassengers: formData.numberOfPassengers,
        passengers: formData.passengers,
        estimatedKms: formData.estimatedKms,
        foodPreferences: formData.foodPreferences,
        specialRequests: formData.specialRequests
      });

      const bookingId = bookingResponse.data.data._id;

      // Then record the payment
      await paymentsAPI.recordPayment({
        bookingId,
        amount: costBreakdown.advanceAmount,
        paymentMethod,
        transactionId: selectedMethod.requiresTransactionId ? transactionId : `CARD_${Date.now()}`,
        paymentType: 'advance'
      });

      setPaymentStatus('completed');
      setMessage('Payment successful! Booking confirmed.');

      // Redirect to my bookings after 3 seconds
      setTimeout(() => {
        navigate('/my-bookings');
      }, 3000);

    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      setMessage(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedMethod = paymentMethods.find(method => method.id === paymentMethod);

  return (
    <div className="payment-page">
      <div className="container">
        <div className="payment-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            <FaArrowLeft /> Back to Booking
          </button>
          <h1>Complete Your Payment</h1>
          <p>Secure payment for your tour booking</p>
        </div>

        {message && (
          <div className={`message ${message.includes('successful') ? 'success' : message.includes('copied') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="payment-content">
          {/* Booking Summary */}
          <div className="booking-summary">
            <h2>Booking Summary</h2>
            <div className="summary-details">
              <div className="summary-item">
                <span className="label">Tour:</span>
                <span className="value">Tour ID: {tourId}</span>
              </div>
              <div className="summary-item">
                <span className="label">Vehicle:</span>
                <span className="value">Vehicle ID: {vehicleId}</span>
              </div>
              <div className="summary-item">
                <span className="label">Duration:</span>
                <span className="value">{formData.startDate} to {formData.endDate}</span>
              </div>
              <div className="summary-item">
                <span className="label">Passengers:</span>
                <span className="value">{formData.numberOfPassengers}</span>
              </div>
              <div className="summary-item total">
                <span className="label">Advance Amount:</span>
                <span className="value">₹{costBreakdown?.advanceAmount?.toLocaleString()}</span>
              </div>
              <div className="summary-item total">
                <span className="label">Total Amount:</span>
                <span className="value">₹{costBreakdown?.totalAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="payment-methods">
            <h2>Select Payment Method</h2>
            <div className="methods-grid">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`method-card ${paymentMethod === method.id ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodSelect(method.id)}
                >
                  <div className="method-icon">
                    {method.icon}
                  </div>
                  <div className="method-info">
                    <h3>{method.name}</h3>
                    <p>{method.description}</p>
                  </div>
                  {paymentMethod === method.id && (
                    <FaCheckCircle className="selected-icon" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          {selectedMethod && (
            <div className="payment-details">
              <h2>Payment Details</h2>

              {selectedMethod.id === 'card' && (
                <div className="card-details">
                  <p>Enter your card details below to complete the payment:</p>
                  <Elements stripe={stripePromise}>
                    <CardPaymentForm
                      amount={costBreakdown?.advanceAmount}
                      bookingDetails={{ tourId, vehicleId, formData }}
                      onPaymentSuccess={handleCardPaymentSuccess}
                      onPaymentError={handleCardPaymentError}
                      disabled={loading || paymentStatus === 'completed'}
                    />
                  </Elements>
                </div>
              )}

              {selectedMethod.id === 'upi' && (
                <div className="upi-details">
                  <p>Choose your preferred UPI app and pay the advance amount:</p>
                  <div className="upi-options">
                    {selectedMethod.upiIds.map((upi, index) => (
                      <div key={index} className="upi-option">
                        <div className="upi-info">
                          <h4>{upi.name}</h4>
                          <p className="upi-id">{upi.id}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(upi.id)}
                          className="copy-btn"
                        >
                          <FaCopy /> Copy
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedMethod.id === 'qr' && (
                <div className="qr-details">
                  <p>Scan the QR code below with any UPI app:</p>
                  <div className="qr-code">
                    <div className="qr-code-container">
                      <QRCodeCanvas
                        value={`upi://pay?pa=smarttravel@okicici&pn=Smart%20Travel%20Partner&am=${costBreakdown?.advanceAmount || 0}&cu=INR&tn=Tour%20Booking%20Advance%20Payment`}
                        size={200}
                        level="M"
                        includeMargin={true}
                      />
                      <div className="qr-info">
                        <p className="qr-amount">₹{costBreakdown?.advanceAmount?.toLocaleString()}</p>
                        <p className="qr-label">Advance Payment</p>
                        <small>Scan with any UPI app</small>
                        <button
                          onClick={downloadQRCode}
                          className="download-qr-btn"
                        >
                          <FaDownload /> Download QR
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod.requiresTransactionId && (
                <div className="transaction-input">
                  <label htmlFor="transactionId">Transaction ID / UTR Number:</label>
                  <input
                    type="text"
                    id="transactionId"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter transaction ID after payment"
                    className="transaction-field"
                  />
                  <small>Enter the transaction ID from your UPI app after completing the payment</small>
                </div>
              )}
            </div>
          )}

          {/* Payment Action */}
          {selectedMethod && selectedMethod.id !== 'card' && (
            <div className="payment-action">
              <div className="payment-info">
                <div className="amount-display">
                  <FaRupeeSign className="amount-icon" />
                  <span className="amount">₹{costBreakdown?.advanceAmount?.toLocaleString()}</span>
                  <span className="amount-label">Advance Payment</span>
                </div>
              </div>

              <button
                onClick={handlePaymentComplete}
                disabled={!paymentMethod || (selectedMethod.requiresTransactionId && !transactionId.trim()) || loading || paymentStatus === 'completed'}
                className={`payment-btn ${paymentStatus === 'completed' ? 'success' : ''}`}
              >
                {loading ? 'Processing...' :
                 paymentStatus === 'completed' ? 'Payment Completed!' :
                 paymentStatus === 'processing' ? 'Confirming Payment...' :
                 'Confirm Payment'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;