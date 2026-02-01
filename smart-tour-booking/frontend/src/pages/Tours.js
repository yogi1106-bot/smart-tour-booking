import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext';
import './Home.css'; // Reuse the same styles
import { FaMapMarkerAlt, FaStar, FaArrowRight, FaFilter, FaSearch } from 'react-icons/fa';

const Tours = () => {
  const { tours, loading, fetchTours } = useContext(BookingContext);
  const [filteredTours, setFilteredTours] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  useEffect(() => {
    fetchTours();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let filtered = tours;

    if (searchTerm) {
      filtered = filtered.filter(tour =>
        tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(tour =>
        tour.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (priceFilter) {
      const maxPrice = parseInt(priceFilter);
      filtered = filtered.filter(tour => tour.basePricePerDay <= maxPrice);
    }

    setFilteredTours(filtered);
  }, [tours, searchTerm, locationFilter, priceFilter]);

  const uniqueLocations = tours && tours.length > 0 ? [...new Set(tours.map(tour => tour.location))] : [];

  return (
    <div className="tours-page">
      <div className="container">
        {/* Header */}
        <div className="tours-header">
          <h1>Explore Our Tour Packages</h1>
          <p>Discover amazing destinations with our carefully curated tour packages</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters">
            <div className="filter-group">
              <FaSearch className="filter-icon" />
              <input
                type="text"
                placeholder="Search tours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <FaMapMarkerAlt className="filter-icon" />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <FaFilter className="filter-icon" />
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Prices</option>
                <option value="2000">Under ₹2000/day</option>
                <option value="3000">Under ₹3000/day</option>
                <option value="5000">Under ₹5000/day</option>
                <option value="10000">Under ₹10000/day</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tours Grid */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <div className="tours-count">
              <p>Showing {filteredTours.length} tour{filteredTours.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="tours-grid">
              {filteredTours.map((tour) => (
                <div key={tour._id} className="tour-card">
                  <div className="tour-image">
                    <img
                      src={tour.image || 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(tour.name)}
                      alt={tour.name}
                    />
                    <span className="tour-badge">{tour.seasonalTheme}</span>
                  </div>
                  <div className="tour-info">
                    <h3>{tour.name}</h3>
                    <p className="tour-location">
                      <FaMapMarkerAlt /> {tour.location}
                    </p>
                    <div className="tour-details">
                      <span>{tour.duration.days} Days / {tour.duration.nights} Nights</span>
                      <span className="rating">
                        <FaStar /> {tour.rating || 4.8}
                      </span>
                    </div>
                    <div className="tour-description">
                      <p>{tour.description ? tour.description.substring(0, 100) + '...' : 'Experience the beauty of this destination with our guided tour package.'}</p>
                    </div>
                    <div className="tour-price">
                      <span className="price">₹{tour.basePricePerDay}/day</span>
                      <Link to={`/tours/${tour._id}`} className="btn-primary">
                        Book Now <FaArrowRight />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTours.length === 0 && (
              <div className="no-tours">
                <h3>No tours found</h3>
                <p>Try adjusting your filters or search terms.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Tours;