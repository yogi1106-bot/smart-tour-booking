
# Your Smart & Reliable Bus Travel Partner

A comprehensive bus travel booking website with modern frontend and backend infrastructure.

## Features

- **Tour Browsing**: Browse and filter tours by area, location, and season
- **Vehicle Selection**: Choose from buses or vans based on group size
- **Cost Calculation**: Real-time cost calculation based on:
  - Number of days
  - Distance traveled (KM basis)
  - Food preferences
  - Driver charges
  - GST calculation
- **Seasonal Themes**: Website theme changes based on seasons (Summer, Monsoon, Winter, Spring, Autumn)
- **Payment Portal**: Secure payment system with advance payment option (30% advance required)
- **User Authentication**: Register and login functionality
- **Booking Management**: View and manage bookings
- **Driver & Vehicle Details**: Complete information about drivers and vehicles
- **Responsive Design**: User-friendly interface on all devices

## Project Structure

```
smart-tour-booking/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── controllers/      # Business logic
│   ├── middleware/       # Authentication middleware
│   ├── utils/           # Utility functions
│   ├── server.js        # Main server file
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── context/     # React context
│   │   ├── styles/      # Global styles
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the backend directory with required variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-tour-booking
JWT_SECRET=your_jwt_secret_key_here
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:3000
```

4. Start backend server:
```bash
npm run dev
```

Backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

Frontend will run on http://localhost:3000

### Running Both Simultaneously

From root directory (smart-tour-booking):
```bash
npm run install-all
npm run dev
```

This will install dependencies for all projects and run both frontend and backend concurrently.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tours
- `GET /api/tours` - Get all tours with filters
- `GET /api/tours/:id` - Get tour details
- `POST /api/tours` - Create tour (Admin)
- `PUT /api/tours/:id` - Update tour

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get vehicle details
- `POST /api/vehicles` - Create vehicle
- `PUT /api/vehicles/:id` - Update vehicle

### Drivers
- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/:id` - Get driver details
- `POST /api/drivers` - Create driver
- `PUT /api/drivers/:id` - Update driver

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Payments
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments` - Record payment
- `GET /api/payments/:bookingId` - Get payment details

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Technology Stack

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- Stripe Payment Integration
- CORS enabled

### Frontend
- React.js
- React Router
- Context API for state management
- Axios for API calls
- CSS3 with responsive design
- React Icons

## Features Implementation Details

### Cost Calculation Logic
```
Total Cost = Vehicle Rent + Distance Charges + Food Cost + Driver Charges + GST
- Vehicle Rent = Daily Rate × Number of Days
- Distance Charges = Rate per KM × Total KMs
- Food Cost = 500 × Days × Number of Passengers (if selected)
- Driver Charges = 200 × Days
- GST = 18% of subtotal
- Advance Payment = 30% of Total Cost
```

### Seasonal Themes
The website automatically adjusts theme colors based on the current season:
- **Summer**: Orange and Yellow (#ff9800, #ffc107)
- **Monsoon**: Blue and Navy (#3f51b5, #2196f3)
- **Winter**: Light Blue and Cyan (#2196f3, #00bcd4)
- **Spring**: Green (#4caf50, #8bc34a)
- **Autumn**: Brown and Tan (#d2691e, #cd853f)

## Future Enhancements

- [ ] Email notifications for bookings
- [ ] SMS alerts
- [ ] Advanced filtering and search
- [ ] Tour reviews and ratings
- [ ] Wallet functionality
- [ ] Group discounts
- [ ] Special event packages
- [ ] Mobile app (React Native)
- [ ] Admin dashboard
- [ ] Real-time booking tracking

## 🚀 Deployment Guide

### Option 1: GitHub Pages (Frontend Only) + Backend Hosting

#### Frontend Deployment (GitHub Pages)
1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "GitHub Actions" as source

2. **Set Environment Variables** (in repository secrets):
   - `REACT_APP_API_URL`: Your backend API URL (e.g., `https://your-backend.onrender.com`)

3. **Automatic Deployment**:
   - Push to `main` branch to trigger deployment
   - Frontend will be available at: `https://your-username.github.io/smart-tour-booking`

#### Backend Deployment Options

Choose one of the following services for backend deployment:

### Railway (Recommended)
1. **Connect Repository**:
   ```bash
   railway login
   railway link
   railway add --name smart-tour-backend
   ```

2. **Set Environment Variables**:
   ```bash
   railway variables set MONGODB_URI=your_mongodb_connection_string
   railway variables set JWT_SECRET=your_jwt_secret
   railway variables set STRIPE_PUBLIC_KEY=your_stripe_public_key
   railway variables set STRIPE_SECRET_KEY=your_stripe_secret_key
   railway variables set EMAIL_USER=your_email@gmail.com
   railway variables set EMAIL_PASS=your_app_password
   railway variables set FRONTEND_URL=https://your-username.github.io/smart-tour-booking
   ```

3. **Deploy**:
   ```bash
   railway deploy
   ```

### Render
1. **Create Web Service**:
   - Connect your GitHub repository
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && npm start`

2. **Environment Variables**:
   - Add all required environment variables in Render dashboard

### Vercel
1. **Deploy Backend**:
   ```bash
   vercel --prod
   ```

2. **Set Environment Variables**:
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   # Add other variables...
   ```

### Heroku
1. **Create App**:
   ```bash
   heroku create smart-tour-backend
   ```

2. **Set Environment Variables**:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   # Add other variables...
   ```

3. **Deploy**:
   ```bash
   git push heroku main
   ```

### Option 2: Full-Stack Deployment (Vercel)

For Vercel full-stack deployment, use the provided `vercel.json` configuration:

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables** in Vercel dashboard

### Required Environment Variables

Create a `.env.production` file in the backend directory with:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secure_jwt_secret
JWT_EXPIRE=7d
STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=https://your-username.github.io/smart-tour-booking
NODE_ENV=production
```

### Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Cluster**
2. **Create Database User**
3. **Whitelist IP Addresses** (0.0.0.0/0 for development)
4. **Get Connection String**
5. **Update MONGODB_URI in environment variables**

### Stripe Payment Setup

1. **Create Stripe Account**
2. **Get API Keys** from Stripe Dashboard
3. **Add Keys to Environment Variables**
4. **Configure Webhooks** (optional for production)

### Email Configuration

1. **Use Gmail** or other SMTP service
2. **Generate App Password** for Gmail
3. **Update EMAIL_USER and EMAIL_PASS**

## Security Considerations

- JWT tokens for authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- SQL injection prevention (using Mongoose)
- Secure payment processing with Stripe

## Support

For issues or questions, please contact: info@smarttravelpartner.com

## License

MIT License
