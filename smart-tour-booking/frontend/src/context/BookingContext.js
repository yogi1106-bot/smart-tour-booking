import React, { createContext, useState, useEffect } from 'react';
import { toursAPI, vehiclesAPI } from '../services/api';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [tours, setTours] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [bookingData, setBookingData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTours();
    fetchVehicles();
  }, []);

  const fetchTours = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await toursAPI.getAllTours(filters);
      setTours(response.data.data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async (filters = {}) => {
    try {
      const response = await vehiclesAPI.getAllVehicles(filters);
      setVehicles(response.data.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const updateBookingData = (data) => {
    setBookingData({ ...bookingData, ...data });
  };

  return (
    <BookingContext.Provider
      value={{
        tours,
        vehicles,
        selectedTour,
        setSelectedTour,
        selectedVehicle,
        setSelectedVehicle,
        bookingData,
        updateBookingData,
        fetchTours,
        fetchVehicles,
        loading
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
