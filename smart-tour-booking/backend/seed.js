const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Tour = require('./models/Tour');
const Vehicle = require('./models/Vehicle');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-tour-booking', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Tour.deleteMany({});
    console.log('Cleared existing data');

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('demo123', salt);

    // Create sample users
    const users = await User.insertMany([
      {
        name: 'Demo User',
        email: 'demo@example.com',
        phone: '9999999999',
        password: hashedPassword,
        address: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        role: 'customer'
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '8888888888',
        password: hashedPassword,
        address: '456 Admin Avenue',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        role: 'admin'
      }
    ]);

    console.log('Created sample users');

    // Create sample tours
    const tours = await Tour.insertMany([
      {
        name: 'Himalayan Adventure',
        description: 'Experience the breathtaking beauty of the Himalayas with guided tours and comfortable accommodation.',
        area: 'Himachal Pradesh',
        location: 'Manali',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
        nearbyTouristSpots: [
          { name: 'Rohtang Pass', distance: '50 km', description: 'Snow-capped mountain pass' },
          { name: 'Solang Valley', distance: '14 km', description: 'Adventure sports destination' }
        ],
        duration: { days: 5, nights: 4 },
        included: {
          food: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: true,
          transportation: true,
          guidedTour: true
        },
        basePricePerDay: 3000,
        pricePerKm: 10,
        maxKms: 500,
        seasonalTheme: 'winter',
        availableSeasons: ['Winter', 'Spring']
      },
      {
        name: 'Goan Beach Escape',
        description: 'Relax on pristine beaches of Goa with water sports and seafood delights.',
        area: 'Goa',
        location: 'North Goa',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=400&fit=crop',
        nearbyTouristSpots: [
          { name: 'Baga Beach', distance: '2 km', description: 'Popular beach with water sports' },
          { name: 'Anjuna Beach', distance: '8 km', description: 'Scenic beach with flea market' }
        ],
        duration: { days: 4, nights: 3 },
        included: {
          food: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: true,
          transportation: true,
          guidedTour: true
        },
        basePricePerDay: 2500,
        pricePerKm: 8,
        maxKms: 400,
        seasonalTheme: 'summer',
        availableSeasons: ['Winter', 'Spring']
      },
      {
        name: 'Rajasthan Royal Tour',
        description: 'Discover the palaces and deserts of Rajasthan in a luxurious journey.',
        area: 'Rajasthan',
        location: 'Jaipur',
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=400&fit=crop',
        nearbyTouristSpots: [
          { name: 'City Palace', distance: '0 km', description: 'Historic palace complex' },
          { name: 'Hawa Mahal', distance: '1 km', description: 'Pink sandstone monument' },
          { name: 'Amer Fort', distance: '11 km', description: 'Magnificent hilltop fort' }
        ],
        duration: { days: 6, nights: 5 },
        included: {
          food: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: true,
          transportation: true,
          guidedTour: true
        },
        basePricePerDay: 4000,
        pricePerKm: 12,
        maxKms: 600,
        seasonalTheme: 'autumn',
        availableSeasons: ['Autumn', 'Winter', 'Spring']
      },
      {
        name: 'Kerala Backwaters',
        description: 'Cruise through the serene backwaters of Kerala with houseboat rides.',
        area: 'Kerala',
        location: 'Kochi',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=400&fit=crop',
        nearbyTouristSpots: [
          { name: 'Vembanad Lake', distance: '20 km', description: 'Largest lake in Kerala' },
          { name: 'Chinese Fishing Nets', distance: '2 km', description: 'Historic fishing structures' }
        ],
        duration: { days: 4, nights: 3 },
        included: {
          food: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: true,
          transportation: true,
          guidedTour: true
        },
        basePricePerDay: 3500,
        pricePerKm: 9,
        maxKms: 350,
        seasonalTheme: 'monsoon',
        availableSeasons: ['Summer', 'Winter']
      },
      {
        name: 'Kashmir Valley Paradise',
        description: 'Experience the paradise on earth with stunning valleys, lakes, and mountains.',
        area: 'Jammu & Kashmir',
        location: 'Srinagar',
        image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925c?w=800&h=400&fit=crop',
        nearbyTouristSpots: [
          { name: 'Dal Lake', distance: '0 km', description: 'Famous lake with houseboats' },
          { name: 'Gulmarg', distance: '50 km', description: 'Skiing destination' },
          { name: 'Pahalgam', distance: '95 km', description: 'Valley of shepherds' }
        ],
        duration: { days: 6, nights: 5 },
        included: {
          food: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: true,
          transportation: true,
          guidedTour: true
        },
        basePricePerDay: 4500,
        pricePerKm: 15,
        maxKms: 800,
        seasonalTheme: 'spring',
        availableSeasons: ['Spring', 'Summer', 'Autumn']
      },
      {
        name: 'Andaman Island Adventure',
        description: 'Discover pristine beaches, coral reefs, and marine life in the Andaman Islands.',
        area: 'Andaman & Nicobar',
        location: 'Port Blair',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
        nearbyTouristSpots: [
          { name: 'Radhanagar Beach', distance: '35 km', description: 'Asia\'s best beach' },
          { name: 'Cellular Jail', distance: '2 km', description: 'Historic prison' },
          { name: 'Havelock Island', distance: '55 km', description: 'Scuba diving paradise' }
        ],
        duration: { days: 7, nights: 6 },
        included: {
          food: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: true,
          transportation: true,
          guidedTour: true
        },
        basePricePerDay: 5500,
        pricePerKm: 20,
        maxKms: 1000,
        seasonalTheme: 'summer',
        availableSeasons: ['Winter', 'Spring']
      },
      {
        name: 'Golden Triangle Tour',
        description: 'Explore the cultural heritage of India with Delhi, Agra, and Jaipur.',
        area: 'North India',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=400&fit=crop',
        nearbyTouristSpots: [
          { name: 'Taj Mahal', distance: '200 km', description: 'Symbol of love' },
          { name: 'Red Fort', distance: '0 km', description: 'Historic Mughal fort' },
          { name: 'Qutub Minar', distance: '15 km', description: 'Tallest minaret' }
        ],
        duration: { days: 8, nights: 7 },
        included: {
          food: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: true,
          transportation: true,
          guidedTour: true
        },
        basePricePerDay: 3800,
        pricePerKm: 11,
        maxKms: 1200,
        seasonalTheme: 'autumn',
        availableSeasons: ['Autumn', 'Winter', 'Spring']
      },
      {
        name: 'Karnataka Heritage Tour',
        description: 'Journey through Karnataka\'s rich history, palaces, and coffee plantations.',
        area: 'Karnataka',
        location: 'Mysore',
        image: 'https://images.unsplash.com/photo-1626714487767-6b2f78aa0c4c?w=800&h=400&fit=crop',
        nearbyTouristSpots: [
          { name: 'Mysore Palace', distance: '0 km', description: 'Royal palace' },
          { name: 'Chamundi Hill', distance: '13 km', description: 'Temple and views' },
          { name: 'Coorg', distance: '110 km', description: 'Coffee country' }
        ],
        duration: { days: 5, nights: 4 },
        included: {
          food: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: true,
          transportation: true,
          guidedTour: true
        },
        basePricePerDay: 3200,
        pricePerKm: 9,
        maxKms: 600,
        seasonalTheme: 'autumn',
        availableSeasons: ['Autumn', 'Winter', 'Spring']
      },
      {
        name: 'Hill Station Escape',
        description: 'Relax in the cool mountains of Ooty and Kodaikanal with scenic views.',
        area: 'South India',
        location: 'Ooty',
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop',
        nearbyTouristSpots: [
          { name: 'Ooty Lake', distance: '0 km', description: 'Artificial lake' },
          { name: 'Doddabetta Peak', distance: '10 km', description: 'Highest peak' },
          { name: 'Kodaikanal', distance: '250 km', description: 'Queen of hill stations' }
        ],
        duration: { days: 6, nights: 5 },
        included: {
          food: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: true,
          transportation: true,
          guidedTour: true
        },
        basePricePerDay: 2800,
        pricePerKm: 8,
        maxKms: 700,
        seasonalTheme: 'summer',
        availableSeasons: ['Summer', 'Autumn', 'Winter']
      },
      {
        name: 'Spiritual Uttarakhand',
        description: 'Find peace in the spiritual lands of Rishikesh and the Himalayas.',
        area: 'Uttarakhand',
        location: 'Rishikesh',
        image: 'https://images.unsplash.com/photo-1544008230-ac1e1fb4f4f9?w=800&h=400&fit=crop',
        nearbyTouristSpots: [
          { name: 'Triveni Ghat', distance: '0 km', description: 'Sacred confluence' },
          { name: 'Beatles Ashram', distance: '12 km', description: 'Historic ashram' },
          { name: 'Neer Garh Waterfall', distance: '18 km', description: 'Scenic waterfall' }
        ],
        duration: { days: 4, nights: 3 },
        included: {
          food: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: true,
          transportation: true,
          guidedTour: true
        },
        basePricePerDay: 2600,
        pricePerKm: 7,
        maxKms: 400,
        seasonalTheme: 'spring',
        availableSeasons: ['Spring', 'Summer', 'Autumn']
      },
      {
        name: 'Maharashtra Hill Stations',
        description: 'Explore the scenic beauty of Mahabaleshwar and Lonavala.',
        area: 'Maharashtra',
        location: 'Mahabaleshwar',
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop',
        nearbyTouristSpots: [
          { name: 'Venna Lake', distance: '0 km', description: 'Beautiful lake' },
          { name: 'Mapro Garden', distance: '2 km', description: 'Strawberry farm' },
          { name: 'Lonavala', distance: '65 km', description: 'Hill station with caves' }
        ],
        duration: { days: 5, nights: 4 },
        included: {
          food: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: true,
          transportation: true,
          guidedTour: true
        },
        basePricePerDay: 2900,
        pricePerKm: 8,
        maxKms: 500,
        seasonalTheme: 'summer',
        availableSeasons: ['Summer', 'Autumn', 'Winter']
      },
      {
        name: 'Sikkim Adventure',
        description: 'Experience the untouched beauty of Sikkim with monasteries and mountains.',
        area: 'Sikkim',
        location: 'Gangtok',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
        nearbyTouristSpots: [
          { name: 'Rumtek Monastery', distance: '24 km', description: 'Largest monastery' },
          { name: 'Nathu La Pass', distance: '55 km', description: 'Border with Tibet' },
          { name: 'Tsongmo Lake', distance: '40 km', description: 'Sacred lake' }
        ],
        duration: { days: 7, nights: 6 },
        included: {
          food: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: true,
          transportation: true,
          guidedTour: true
        },
        basePricePerDay: 4200,
        pricePerKm: 14,
        maxKms: 900,
        seasonalTheme: 'summer',
        availableSeasons: ['Spring', 'Summer', 'Autumn']
      },
      {
        name: 'Wildlife Gujarat',
        description: 'Discover the wildlife sanctuaries and cultural heritage of Gujarat.',
        area: 'Gujarat',
        location: 'Ahmedabad',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
        nearbyTouristSpots: [
          { name: 'Sasan Gir', distance: '350 km', description: 'Asiatic lion sanctuary' },
          { name: 'Rann of Kutch', distance: '400 km', description: 'White salt desert' },
          { name: 'Sabarmati Ashram', distance: '8 km', description: 'Gandhi\'s ashram' }
        ],
        duration: { days: 8, nights: 7 },
        included: {
          food: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: true,
          transportation: true,
          guidedTour: true
        },
        basePricePerDay: 3600,
        pricePerKm: 10,
        maxKms: 1100,
        seasonalTheme: 'winter',
        availableSeasons: ['Winter', 'Spring']
      },
      {
        name: 'Kashmir Valley Paradise',
        description: 'Experience the paradise on earth with stunning valleys, lakes, and mountains.',
        area: 'Jammu & Kashmir',
        location: 'Srinagar',
        image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925c?w=800&h=400&fit=crop',
        nearbyTouristSpots: [
          { name: 'Dal Lake', distance: '0 km', description: 'Famous lake with houseboats' },
          { name: 'Gulmarg', distance: '50 km', description: 'Skiing destination' },
          { name: 'Pahalgam', distance: '95 km', description: 'Valley of shepherds' }
        ],
        duration: { days: 6, nights: 5 },
        included: {
          food: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: true,
          transportation: true,
          guidedTour: true
        },
        basePricePerDay: 4500,
        pricePerKm: 15,
        maxKms: 800,
        seasonalTheme: 'spring',
        availableSeasons: ['Spring', 'Summer', 'Autumn']
      },
      {
        name: 'Andaman Island Adventure',
        description: 'Discover pristine beaches, coral reefs, and marine life in the Andaman Islands.',
        area: 'Andaman & Nicobar',
        location: 'Port Blair',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
        nearbyTouristSpots: [
          { name: 'Radhanagar Beach', distance: '35 km', description: 'Asia\'s best beach' },
          { name: 'Cellular Jail', distance: '2 km', description: 'Historic prison' },
          { name: 'Havelock Island', distance: '55 km', description: 'Scuba diving paradise' }
        ],
        duration: { days: 7, nights: 6 },
        included: {
          food: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: true,
          transportation: true,
          guidedTour: true
        },
        basePricePerDay: 5500,
        pricePerKm: 20,
        maxKms: 1000,
        seasonalTheme: 'summer',
        availableSeasons: ['Winter', 'Spring']
      },
      {
        name: 'Golden Triangle Tour',
        description: 'Explore the cultural heritage of India with Delhi, Agra, and Jaipur.',
        area: 'North India',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=400&fit=crop',
        nearbyTouristSpots: [
          { name: 'Taj Mahal', distance: '200 km', description: 'Symbol of love' },
          { name: 'Red Fort', distance: '0 km', description: 'Historic Mughal fort' },
          { name: 'Qutub Minar', distance: '15 km', description: 'Tallest minaret' }
        ],
        duration: { days: 8, nights: 7 },
        included: {
          food: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: true,
          transportation: true,
          guidedTour: true
        },
        basePricePerDay: 3800,
        pricePerKm: 11,
        maxKms: 1200,
        seasonalTheme: 'autumn',
        availableSeasons: ['Autumn', 'Winter', 'Spring']
      },
      {
        name: 'Karnataka Heritage Tour',
        description: 'Journey through Karnataka\'s rich history, palaces, and coffee plantations.',
        area: 'Karnataka',
        location: 'Mysore',
        image: 'https://images.unsplash.com/photo-1626714487767-6b2f78aa0c4c?w=800&h=400&fit=crop',
        nearbyTouristSpots: [
          { name: 'Mysore Palace', distance: '0 km', description: 'Royal palace' },
          { name: 'Chamundi Hill', distance: '13 km', description: 'Temple and views' },
          { name: 'Coorg', distance: '110 km', description: 'Coffee country' }
        ],
        duration: { days: 5, nights: 4 },
        included: {
          food: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: true,
          transportation: true,
          guidedTour: true
        },
        basePricePerDay: 3200,
        pricePerKm: 9,
        maxKms: 600,
        seasonalTheme: 'autumn',
        availableSeasons: ['Autumn', 'Winter', 'Spring']
      },
      {
        name: 'Hill Station Escape',
        description: 'Relax in the cool mountains of Ooty and Kodaikanal with scenic views.',
        area: 'South India',
        location: 'Ooty',
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop',
        nearbyTouristSpots: [
          { name: 'Ooty Lake', distance: '0 km', description: 'Artificial lake' },
          { name: 'Doddabetta Peak', distance: '10 km', description: 'Highest peak' },
          { name: 'Kodaikanal', distance: '250 km', description: 'Queen of hill stations' }
        ],
        duration: { days: 6, nights: 5 },
        included: {
          food: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: true,
          transportation: true,
          guidedTour: true
        },
        basePricePerDay: 2800,
        pricePerKm: 8,
        maxKms: 700,
        seasonalTheme: 'summer',
        availableSeasons: ['Summer', 'Autumn', 'Winter']
      },
      {
        name: 'Spiritual Uttarakhand',
        description: 'Find peace in the spiritual lands of Rishikesh and the Himalayas.',
        area: 'Uttarakhand',
        location: 'Rishikesh',
        image: 'https://images.unsplash.com/photo-1544008230-ac1e1fb4f4f9?w=800&h=400&fit=crop',
        nearbyTouristSpots: [
          { name: 'Triveni Ghat', distance: '0 km', description: 'Sacred confluence' },
          { name: 'Beatles Ashram', distance: '12 km', description: 'Historic ashram' },
          { name: 'Neer Garh Waterfall', distance: '18 km', description: 'Scenic waterfall' }
        ],
        duration: { days: 4, nights: 3 },
        included: {
          food: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: true,
          transportation: true,
          guidedTour: true
        },
        basePricePerDay: 2600,
        pricePerKm: 7,
        maxKms: 400,
        seasonalTheme: 'spring',
        availableSeasons: ['Spring', 'Summer', 'Autumn']
      },
      {
        name: 'Maharashtra Hill Stations',
        description: 'Explore the scenic beauty of Mahabaleshwar and Lonavala.',
        area: 'Maharashtra',
        location: 'Mahabaleshwar',
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop',
        nearbyTouristSpots: [
          { name: 'Venna Lake', distance: '0 km', description: 'Beautiful lake' },
          { name: 'Mapro Garden', distance: '2 km', description: 'Strawberry farm' },
          { name: 'Lonavala', distance: '65 km', description: 'Hill station with caves' }
        ],
        duration: { days: 5, nights: 4 },
        included: {
          food: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: true,
          transportation: true,
          guidedTour: true
        },
        basePricePerDay: 2900,
        pricePerKm: 8,
        maxKms: 500,
        seasonalTheme: 'summer',
        availableSeasons: ['Summer', 'Autumn', 'Winter']
      },
      {
        name: 'Sikkim Adventure',
        description: 'Experience the untouched beauty of Sikkim with monasteries and mountains.',
        area: 'Sikkim',
        location: 'Gangtok',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
        nearbyTouristSpots: [
          { name: 'Rumtek Monastery', distance: '24 km', description: 'Largest monastery' },
          { name: 'Nathu La Pass', distance: '55 km', description: 'Border with Tibet' },
          { name: 'Tsongmo Lake', distance: '40 km', description: 'Sacred lake' }
        ],
        duration: { days: 7, nights: 6 },
        included: {
          food: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: true,
          transportation: true,
          guidedTour: true
        },
        basePricePerDay: 4200,
        pricePerKm: 14,
        maxKms: 900,
        seasonalTheme: 'summer',
        availableSeasons: ['Spring', 'Summer', 'Autumn']
      },
      {
        name: 'Wildlife Gujarat',
        description: 'Discover the wildlife sanctuaries and cultural heritage of Gujarat.',
        area: 'Gujarat',
        location: 'Ahmedabad',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
        nearbyTouristSpots: [
          { name: 'Sasan Gir', distance: '350 km', description: 'Asiatic lion sanctuary' },
          { name: 'Rann of Kutch', distance: '400 km', description: 'White salt desert' },
          { name: 'Sabarmati Ashram', distance: '8 km', description: 'Gandhi\'s ashram' }
        ],
        duration: { days: 8, nights: 7 },
        included: {
          food: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: true,
          transportation: true,
          guidedTour: true
        },
        basePricePerDay: 3600,
        pricePerKm: 10,
        maxKms: 1100,
        seasonalTheme: 'winter',
        availableSeasons: ['Winter', 'Spring']
      }
    ]);

    console.log('Created sample tours');
    
    // Create sample vehicles
    const vehicles = await Vehicle.insertMany([
      {
        registrationNumber: 'MH01AB1234',
        type: 'bus',
        model: 'Volvo B9R',
        capacity: 45,
        yearOfManufacture: 2018,
        ac: true,
        features: ['wifi', 'usb-charging', 'recliner-seats'],
        dailyRatePerDay: 5000,
        ratePerKm: 12,
        image: 'https://via.placeholder.com/400x200.png?text=Volvo+Bus+45',
        status: 'available'
      },
      {
        registrationNumber: 'KA05CD5678',
        type: 'van',
        model: 'Toyota Hiace',
        capacity: 12,
        yearOfManufacture: 2020,
        ac: true,
        features: ['ac', 'usb-charging'],
        dailyRatePerDay: 3500,
        ratePerKm: 10,
        image: 'https://via.placeholder.com/400x200.png?text=Toyota+Hiace+12',
        status: 'available'
      },
      {
        registrationNumber: 'DL08EF9012',
        type: 'tempo',
        model: 'Eicher Tempo',
        capacity: 20,
        yearOfManufacture: 2016,
        ac: false,
        features: ['large-storage'],
        dailyRatePerDay: 2800,
        ratePerKm: 9,
        image: 'https://via.placeholder.com/400x200.png?text=Tempo+20',
        status: 'available'
      }
    ]);

    console.log('Created sample vehicles');
    console.log('\n✓ Database seeded successfully!');
    console.log('\nDemo Credentials:');
    console.log('Email: demo@example.com');
    console.log('Password: demo123');
    console.log('\nAdmin Credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: demo123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
