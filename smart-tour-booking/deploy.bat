@echo off
echo 🚀 Smart Tour Booking - Go Live Setup
echo =====================================

REM Check if required tools are installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Install dependencies
echo 📦 Installing dependencies...
call npm run install-all

REM Check if .env files exist
if not exist "backend\.env" (
    echo ⚠️  backend\.env not found. Creating from template...
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env"
    ) else (
        echo Please create backend\.env manually
    )
)

if not exist "backend\.env.production" (
    echo ⚠️  backend\.env.production not found. Creating from template...
    if exist "backend\.env" (
        copy "backend\.env" "backend\.env.production"
    ) else (
        echo Please create backend\.env.production manually
    )
)

REM Build frontend
echo 🔨 Building frontend...
cd frontend
call npm run build
cd ..

echo ✅ Build completed successfully!
echo.
echo 📋 Next Steps:
echo 1. Set up MongoDB Atlas database
echo 2. Configure Stripe payment gateway
echo 3. Set up email service (Gmail recommended)
echo 4. Choose a deployment platform:
echo    - Railway (recommended)
echo    - Render
echo    - Vercel
echo    - Heroku
echo 5. Set environment variables in your chosen platform
echo 6. Deploy!
echo.
echo 📖 Check README.md for detailed deployment instructions

pause