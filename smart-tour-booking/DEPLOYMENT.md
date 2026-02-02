# 🚀 Quick Deployment Guide

## Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Stripe account
- GitHub account
- Email account (Gmail recommended)

## 1. Environment Setup

### Copy environment files:
```bash
cp backend/.env.example backend/.env
cp backend/.env.example backend/.env.production
```

### Update environment variables in `.env.production`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-tour-booking
JWT_SECRET=your_super_secure_random_string
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=https://your-username.github.io/smart-tour-booking
```

## 2. Database Setup (MongoDB Atlas)

1. Create cluster at https://cloud.mongodb.com
2. Create database user
3. Whitelist IP: `0.0.0.0/0`
4. Get connection string and update MONGODB_URI

## 3. Payment Setup (Stripe)

1. Create account at https://stripe.com
2. Get API keys from dashboard
3. Update STRIPE_PUBLIC_KEY and STRIPE_SECRET_KEY

## 4. Email Setup (Gmail)

1. Enable 2FA on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Update EMAIL_USER and EMAIL_PASS

## 5. Deploy

### Option A: Railway (Recommended)
```bash
npm install -g @railway/cli
railway login
railway link
railway add
# Set environment variables in Railway dashboard
railway deploy
```

### Option B: Render
1. Connect GitHub repo to Render
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`
4. Add environment variables

### Option C: Vercel (Full-stack)
```bash
npm install -g vercel
vercel --prod
# Set environment variables in Vercel dashboard
```

## 6. Frontend Deployment

The frontend will automatically deploy to GitHub Pages when you push to main branch.

Make sure to set `REACT_APP_API_URL` in GitHub repository secrets to point to your backend URL.

## 7. Verify Deployment

1. Frontend: `https://your-username.github.io/smart-tour-booking`
2. Backend: Check your hosting provider's URL
3. Test registration, login, booking functionality

## Troubleshooting

- **CORS errors**: Update FRONTEND_URL in backend environment
- **Database connection**: Check MongoDB Atlas IP whitelist
- **Payments not working**: Verify Stripe webhook endpoints
- **Emails not sending**: Check Gmail app password

## Support

Check the full deployment guide in README.md for detailed instructions.