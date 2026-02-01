import React from 'react';
import './Footer.css';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content container">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>Your Smart & Reliable Bus Travel Partner - Making travel easy, affordable, and memorable.</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/tours">Tours</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <div className="contact-item">
            <FaMapMarkerAlt /> <span>123 Travel Street, City, State 123456</span>
          </div>
          <div className="contact-item">
            <FaPhone /> <span>+91 98765 43210</span>
          </div>
          <div className="contact-item">
            <FaEnvelope /> <span>info@smarttravelpartner.com</span>
          </div>
        </div>

        <div className="footer-section">
          <h3>Newsletter</h3>
          <p>Subscribe to get special offers and updates</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2026 Your Smart & Reliable Bus Travel Partner. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
