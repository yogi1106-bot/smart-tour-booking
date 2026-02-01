import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password })
};

// Tours endpoints
export const toursAPI = {
  getAllTours: (filters) => api.get('/tours', { params: filters }),
  getTourById: (id) => api.get(`/tours/${id}`),
  createTour: (tourData) => api.post('/tours', tourData),
  updateTour: (id, tourData) => api.put(`/tours/${id}`, tourData)
};

// Vehicles endpoints
export const vehiclesAPI = {
  getAllVehicles: (filters) => api.get('/vehicles', { params: filters }),
  getVehicleById: (id) => api.get(`/vehicles/${id}`),
  createVehicle: (vehicleData) => api.post('/vehicles', vehicleData),
  updateVehicle: (id, vehicleData) => api.put(`/vehicles/${id}`, vehicleData)
};

// Drivers endpoints
export const driversAPI = {
  getAllDrivers: () => api.get('/drivers'),
  getDriverById: (id) => api.get(`/drivers/${id}`)
};

// Bookings endpoints
export const bookingsAPI = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getUserBookings: () => api.get('/bookings'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id, reason) => api.put(`/bookings/${id}/cancel`, { cancellationReason: reason })
};

// Payments endpoints
export const paymentsAPI = {
  createPaymentIntent: (bookingId, amount) => 
    api.post('/payments/create-intent', { bookingId, amount }),
  recordPayment: (paymentData) => api.post('/payments', paymentData),
  getPayments: (bookingId) => api.get(`/payments/${bookingId}`)
};

// Users endpoints
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData)
};

export default api;
