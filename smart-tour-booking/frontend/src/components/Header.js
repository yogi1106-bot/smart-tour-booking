import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';
import { FaBus, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <FaBus /> Your Smart & Reliable Bus Travel Partner
        </Link>

        <button 
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav className={`nav ${menuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/tours" onClick={() => setMenuOpen(false)}>Tours</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </nav>

        <div className={`auth-section ${menuOpen ? 'active' : ''}`}>
          {user ? (
            <>
              <Link to="/profile" className="user-btn">
                <FaUser /> {user.name}
              </Link>
              {user.role === 'driver' ? (
                <Link to="/driver-dashboard" className="bookings-btn">
                  Driver Dashboard
                </Link>
              ) : user.role === 'admin' ? (
                <Link to="/admin-dashboard" className="bookings-btn">
                  Admin Dashboard
                </Link>
              ) : (
                <Link to="/my-bookings" className="bookings-btn">
                  My Bookings
                </Link>
              )}
              <button onClick={handleLogout} className="logout-btn">
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/register" className="signup-btn">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
