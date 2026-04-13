# 🚀 Deployment Guide

Complete guide for deploying ProxyMukt to production.

---

## 📋 Prerequisites

- GitHub repository pushed
- MongoDB Atlas account
- Render.com account (free)

---

## 🌐 Deploy to Render.com

### Step 1: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account and cluster (M0 tier)
3. Create database user with password
4. Allow access from anywhere (0.0.0.0/0)
5. Copy connection string

**Example:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/proxymukt
```

---

### Step 2: Deploy to Render

1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Blueprint"
4. Connect your repository
5. Render auto-detects `render.yaml`
6. Click "Apply"

---

### Step 3: Configure Environment Variables

**Backend Service:**
```env
NODE_ENV=production
MONGODB_URI=your-mongodb-atlas-uri
JWT_ACCESS_SECRET=your-random-secret-32-chars
JWT_REFRESH_SECRET=your-random-secret-32-chars
QR_SECRET=your-random-secret-32-chars
CLIENT_URL=https://your-frontend.onrender.com
```

**Frontend Service:**
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

### Step 4: Verify Deployment

1. Wait 5-10 minutes for build
2. Visit frontend URL
3. Login with test credentials
4. Test core features

**Test Credentials:**
- Admin: admin@proxymukt.com / Admin@123
- Faculty: faculty1@gmail.com / faculty1
- Student: student1@gmail.com / student1

---

## � Troubleshooting

**MongoDB Connection Failed:**
- Verify connection string format
- Check IP whitelist (0.0.0.0/0)
- Confirm username/password

**Frontend Can't Connect:**
- Check `VITE_API_URL` matches backend URL
- Verify `CLIENT_URL` in backend matches frontend
- Ensure both services are running

**Build Errors:**
- Check Render logs
- Verify Node.js version (18+)
- Confirm all dependencies installed

---

## 🔒 Post-Deployment

1. Change default admin password
2. Update JWT secrets to strong random values
3. Configure optional services (Email, Zoom)
4. Test all features thoroughly

---

**Deployment complete! Your system is now live.**
