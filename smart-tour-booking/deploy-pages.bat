@echo off
echo 🚀 Deploying Smart Tour Booking Frontend to GitHub Pages
echo =======================================================

REM Check if we're in the right directory
if not exist "frontend\package.json" (
    echo ❌ Error: frontend\package.json not found. Please run from project root.
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
cd frontend
call npm ci

REM Build the project
echo 🔨 Building production version...
call npm run build

REM Check if build was successful
if not exist "build" (
    echo ❌ Build failed - build directory not found
    pause
    exit /b 1
)

cd ..

REM Deploy using gh-pages (alternative method)
echo 🌐 Deploying to GitHub Pages...
npx gh-pages -d frontend/build -t true

echo ✅ Deployment complete!
echo 🌍 Your site will be available at: https://yogi1106-bot.github.io/smart-tour-booking
echo.
echo Note: It may take a few minutes for the changes to propagate.

pause