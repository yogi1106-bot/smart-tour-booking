#!/bin/bash

echo "🚀 Deploying Smart Tour Booking Frontend to GitHub Pages"
echo "======================================================="

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: frontend/package.json not found. Please run from project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd frontend
npm ci

# Build the project
echo "🔨 Building production version..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ Build failed - build directory not found"
    exit 1
fi

cd ..

# Deploy using gh-pages (alternative method)
echo "🌐 Deploying to GitHub Pages..."
npx gh-pages -d frontend/build -t true

echo "✅ Deployment complete!"
echo "🌍 Your site will be available at: https://yogi1106-bot.github.io/smart-tour-booking"
echo ""
echo "Note: It may take a few minutes for the changes to propagate."