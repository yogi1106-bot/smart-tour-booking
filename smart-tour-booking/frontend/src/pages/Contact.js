import React, { useState } from 'react';
import './Home.css'; // Reuse existing styles
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Contact Us</h1>
          <p>Get in touch with us for bookings, inquiries, or support. We're here to help make your journey memorable.</p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Information */}
            <div className="contact-info">
              <h2>Get In Touch</h2>
              <p>Have questions about our tours or need assistance with your booking? We're here to help!</p>

              <div className="info-items">
                <div className="info-item">
                  <FaPhone className="info-icon" />
                  <div>
                    <h3>Phone</h3>
                    <p>+91 98765 43210</p>
                    <p>+91 98765 43211</p>
                  </div>
                </div>

                <div className="info-item">
                  <FaEnvelope className="info-icon" />
                  <div>
                    <h3>Email</h3>
                    <p>info@yoursmarttravel.com</p>
                    <p>bookings@yoursmarttravel.com</p>
                  </div>
                </div>

                <div className="info-item">
                  <FaMapMarkerAlt className="info-icon" />
                  <div>
                    <h3>Address</h3>
                    <p>123 Travel Plaza, MG Road</p>
                    <p>Bangalore, Karnataka - 560001</p>
                    <p>India</p>
                  </div>
                </div>

                <div className="info-item">
                  <FaClock className="info-icon" />
                  <div>
                    <h3>Business Hours</h3>
                    <p>Monday - Saturday: 9:00 AM - 8:00 PM</p>
                    <p>Sunday: 10:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="social-links">
                <h3>Follow Us</h3>
                <div className="social-icons">
                  <a href="https://facebook.com/yoursmarttravel" className="social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                    <FaFacebook />
                  </a>
                  <a href="https://twitter.com/yoursmarttravel" className="social-link" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                    <FaTwitter />
                  </a>
                  <a href="https://instagram.com/yoursmarttravel" className="social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                    <FaInstagram />
                  </a>
                  <a href="https://wa.me/919876543210" className="social-link" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form">
              <h2>Send us a Message</h2>

              {submitted && (
                <div className="success-message">
                  <p>Thank you for your message! We'll get back to you soon.</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="booking">Tour Booking</option>
                      <option value="inquiry">General Inquiry</option>
                      <option value="support">Customer Support</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us how we can help you..."
                    rows="6"
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary submit-btn">
                  <FaPaperPlane /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <h2>Visit Our Office</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.001!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sM.G.%20Road%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1703123456789!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How do I book a tour?</h3>
              <p>You can book a tour by browsing our tours page, selecting your preferred package, and following the booking process. You can also contact us directly for custom bookings.</p>
            </div>
            <div className="faq-item">
              <h3>What is the cancellation policy?</h3>
              <p>Cancellation is allowed up to 48 hours before the tour start time with a full refund. Cancellations within 24 hours may incur a 20% cancellation fee.</p>
            </div>
            <div className="faq-item">
              <h3>Do you provide transportation from airport?</h3>
              <p>Yes, we provide airport pickup and drop-off services for most of our tour packages. Additional charges may apply based on the distance.</p>
            </div>
            <div className="faq-item">
              <h3>Are meals included in the tour packages?</h3>
              <p>Most of our tour packages include breakfast and dinner. Lunch options are available at additional cost or can be arranged at local restaurants.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;