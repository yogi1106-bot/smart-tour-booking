# MongoDB Setup Guide

The backend requires MongoDB to run. You have several options:

## Option 1: MongoDB Atlas (Recommended - Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (choose Free tier)
4. Create a database user with a password
5. Get your connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/smart-tour-booking`)
6. Update `.env` file in the `backend` folder:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-tour-booking
```

Replace `username` and `password` with your actual credentials.

## Option 2: Local MongoDB Installation

### Windows:
1. Download MongoDB Community Edition from [mongodb.com/download](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. Choose "Run as a Service" during installation
4. After installation, MongoDB will start automatically
5. Your connection string is already set in `.env`: `mongodb://localhost:27017/smart-tour-booking`

### Verify MongoDB is Running:
```bash
# Check if MongoDB service is running (Windows)
Get-Service MongoDB

# Or start it manually:
net start MongoDB
```

## Option 3: MongoDB Local Server (No Installation)

If you want a quick test database without full installation:
1. Download MongoDB Community Server portable version
2. Extract it
3. Run `mongod.exe` from the bin folder

## Testing the Connection

Once MongoDB is set up, run the backend:
```bash
cd backend
npm run dev
```

You should see: `MongoDB connected successfully`

## Troubleshooting

- If you get "connection refused" error, ensure MongoDB is running
- Check your connection string in `.env` file
- Make sure your IP address is whitelisted in MongoDB Atlas (if using cloud)
- Check network connectivity and firewall settings
