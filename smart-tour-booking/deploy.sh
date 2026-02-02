#!/bin/bash

echo "🚀 Smart Tour Booking - Go Live Setup"
echo "====================================="

# Check if required tools are installed
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is not installed. Please install Node.js first."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is not installed. Please install npm first."; exit 1; }
command -v git >/dev/null 2>&1 || { echo "❌ Git is not installed. Please install Git first."; exit 1; }

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found. Creating from template..."
    cp backend/.env.example backend/.env 2>/dev/null || echo "Please create backend/.env manually"
fi

if [ ! -f "backend/.env.production" ]; then
    echo "⚠️  backend/.env.production not found. Creating from template..."
    cp backend/.env backend/.env.production 2>/dev/null || echo "Please create backend/.env.production manually"
fi

# Build frontend
echo "🔨 Building frontend..."
cd frontend
npm run build
cd ..

echo "✅ Build completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Set up MongoDB Atlas database"
echo "2. Configure Stripe payment gateway"
echo "3. Set up email service (Gmail recommended)"
echo "4. Choose a deployment platform:"
echo "   - Railway (recommended)"
echo "   - Render"
echo "   - Vercel"
echo "   - Heroku"
echo "5. Set environment variables in your chosen platform"
echo "6. Deploy!"
echo ""
echo "📖 Check README.md for detailed deployment instructions"