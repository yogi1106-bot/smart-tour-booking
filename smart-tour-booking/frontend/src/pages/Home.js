import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext';
import './Home.css';
import { FaBus, FaMapMarkerAlt, FaCreditCard, FaUsers, FaStar, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const { tours, loading } = useContext(BookingContext);
  const featuredTours = tours.slice(0, 3);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Your Smart & Reliable Bus Travel Partner</h1>
          <p>Explore amazing destinations with comfortable buses and excellent service</p>
          <div className="hero-buttons">
            <Link to="/tours" className="btn-primary">Explore Tours</Link>
            <Link to="/contact" className="btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FaBus className="feature-icon" />
              <h3>Comfortable Buses</h3>
              <p>Modern, well-maintained buses with AC and entertainment systems</p>
            </div>
            <div className="feature-card">
              <FaMapMarkerAlt className="feature-icon" />
              <h3>Best Routes</h3>
              <p>Carefully planned routes visiting the best tourist spots</p>
            </div>
            <div className="feature-card">
              <FaCreditCard className="feature-icon" />
              <h3>Easy Payment</h3>
              <p>Secure payment portal with multiple payment options</p>
            </div>
            <div className="feature-card">
              <FaUsers className="feature-icon" />
              <h3>Expert Guides</h3>
              <p>Experienced drivers and knowledgeable tour guides</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="featured-tours">
        <div className="container">
          <h2>Featured Tours</h2>
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="tours-grid">
              {featuredTours.map((tour) => (
                <div key={tour._id} className="tour-card">
                  <div className="tour-image">
                    <img src={tour.image || 'https://via.placeholder.com/300x200?text=' + tour.name} alt={tour.name} />
                    <span className="tour-badge">{tour.seasonalTheme}</span>
                  </div>
                  <div className="tour-info">
                    <h3>{tour.name}</h3>
                    <p className="tour-location"><FaMapMarkerAlt /> {tour.location}</p>
                    <div className="tour-details">
                      <span>{tour.duration.days} Days / {tour.duration.nights} Nights</span>
                      <span className="rating"><FaStar /> 4.8</span>
                    </div>
                    <div className="tour-price">
                      <span className="price">₹{tour.basePricePerDay}/day</span>
                      <Link to={`/tours/${tour._id}`} className="btn-primary">View Details <FaArrowRight /></Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="view-all">
            <Link to="/tours" className="btn-secondary">View All Tours</Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Browse Tours</h3>
              <p>Explore our collection of amazing tour packages</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Select Vehicle</h3>
              <p>Choose from buses or vans based on your group size</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Book & Pay</h3>
              <p>Make your booking and pay the advance amount</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Enjoy Travel</h3>
              <p>Get ready for an unforgettable travel experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2>What Our Customers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Amazing experience! The bus was comfortable and the driver was very professional."</p>
              <h4>Rajesh Kumar</h4>
              <p className="location">Mumbai</p>
            </div>
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Best bus travel service I have used. Great value for money!"</p>
              <h4>Priya Singh</h4>
              <p className="location">Delhi</p>
            </div>
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Professional service, on-time delivery, and friendly staff. Highly recommended!"</p>
              <h4>Amit Patel</h4>
              <p className="location">Bangalore</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready for Your Next Adventure?</h2>
          <p>Book your tour today and create unforgettable memories</p>
          <Link to="/tours" className="btn-primary btn-lg">Start Booking Now</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
