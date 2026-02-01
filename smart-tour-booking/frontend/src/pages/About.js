import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Reuse existing styles
import { FaBus, FaUsers, FaMapMarkerAlt, FaAward, FaShieldAlt, FaClock, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>About Your Smart Travel Partner</h1>
          <p>Your trusted companion for memorable and hassle-free bus travel experiences across incredible destinations</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="features">
        <div className="container">
          <div className="mission-vision">
            <div className="mission-card">
              <h2>Our Mission</h2>
              <p>To provide exceptional bus travel experiences that create lasting memories, connecting people with beautiful destinations through safe, comfortable, and affordable transportation solutions.</p>
            </div>
            <div className="vision-card">
              <h2>Our Vision</h2>
              <p>To be the leading bus travel partner in India, setting new standards in tourism transportation with innovative technology, unparalleled service quality, and sustainable travel practices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="featured-tours">
        <div className="container">
          <h2>Why Choose Your Smart Travel Partner</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FaBus className="feature-icon" />
              <h3>Modern Fleet</h3>
              <p>Well-maintained, air-conditioned buses equipped with modern amenities for comfortable journeys</p>
            </div>
            <div className="feature-card">
              <FaShieldAlt className="feature-icon" />
              <h3>Safe & Secure</h3>
              <p>Comprehensive safety measures with experienced drivers and 24/7 support for peace of mind</p>
            </div>
            <div className="feature-card">
              <FaMapMarkerAlt className="feature-icon" />
              <h3>Best Routes</h3>
              <p>Carefully planned itineraries covering the most scenic and popular tourist destinations</p>
            </div>
            <div className="feature-card">
              <FaUsers className="feature-icon" />
              <h3>Expert Team</h3>
              <p>Professional drivers, knowledgeable guides, and dedicated support staff</p>
            </div>
            <div className="feature-card">
              <FaClock className="feature-icon" />
              <h3>Punctual Service</h3>
              <p>Reliable schedules and timely departures ensuring you never miss your adventures</p>
            </div>
            <div className="feature-card">
              <FaAward className="feature-icon" />
              <h3>Award Winning</h3>
              <p>Recognized for excellence in service quality and customer satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="how-it-works">
        <div className="container">
          <h2>Our Achievements</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">50,000+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Tours Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">25+</div>
              <div className="stat-label">Destinations</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Modern Buses</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="features">
        <div className="container">
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service-item">
              <FaCheckCircle className="service-icon" />
              <h3>Custom Tour Packages</h3>
              <p>Tailored travel packages designed to meet your specific needs and preferences</p>
            </div>
            <div className="service-item">
              <FaCheckCircle className="service-icon" />
              <h3>Group Bookings</h3>
              <p>Special rates and arrangements for group travel and corporate outings</p>
            </div>
            <div className="service-item">
              <FaCheckCircle className="service-icon" />
              <h3>24/7 Support</h3>
              <p>Round-the-clock customer support for assistance before, during, and after your trip</p>
            </div>
            <div className="service-item">
              <FaCheckCircle className="service-icon" />
              <h3>Flexible Payment</h3>
              <p>Multiple payment options including online payments, UPI, and credit/debit cards</p>
            </div>
            <div className="service-item">
              <FaCheckCircle className="service-icon" />
              <h3>Insurance Coverage</h3>
              <p>Travel insurance options for complete peace of mind during your journeys</p>
            </div>
            <div className="service-item">
              <FaCheckCircle className="service-icon" />
              <h3>Real-time Tracking</h3>
              <p>GPS tracking system to monitor your bus location and estimated arrival times</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="featured-tours">
        <div className="container">
          <div className="cta-section">
            <h2>Ready to Start Your Journey?</h2>
            <p>Explore our amazing tour packages and create unforgettable memories with us</p>
            <div className="cta-buttons">
              <Link to="/tours" className="btn-primary">
                Explore Tours <FaArrowRight />
              </Link>
              <Link to="/contact" className="btn-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;