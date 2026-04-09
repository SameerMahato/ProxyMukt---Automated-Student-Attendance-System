# 📦 ProxyMukt Installation Guide

Complete step-by-step guide to set up ProxyMukt Attendance System on your local machine.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Node.js** (v18 or higher)
   - Download: [https://nodejs.org/](https://nodejs.org/)
   - Verify installation: `node --version`

2. **MongoDB** (v6 or higher)
   - Download: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud): [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Verify installation: `mongod --version`

3. **Git**
   - Download: [https://git-scm.com/](https://git-scm.com/)
   - Verify installation: `git --version`

4. **npm** or **yarn** (comes with Node.js)
   - Verify installation: `npm --version`

---

## 🚀 Quick Start (5 Minutes)

### Option 1: Using the Batch Script (Windows)

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ProxyMukt-Attendance-System.git
   cd ProxyMukt-Attendance-System
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd server
   npm install
   
   # Frontend
   cd ../client
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cd server
   copy .env.example .env
   # Edit .env with your settings
   
   # Frontend
   cd ../client
   copy .env.example .env
   # Edit .env with your settings
   cd ..
   ```

4. **Seed the database**
   ```bash
   cd server
   npm run seed
   cd ..
   ```

5. **Start both servers**
   ```bash
   # Double-click START_PROJECT.bat
   # Or run manually:
   START_PROJECT.bat
   ```

6. **Access the application**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000](http://localhost:5000)

---

## 📝 Detailed Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ProxyMukt-Attendance-System.git
cd ProxyMukt-Attendance-System
```

### Step 2: Backend Setup

#### 2.1 Navigate to server directory
```bash
cd server
```

#### 2.2 Install dependencies
```bash
npm install
```

This will install:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- socket.io
- helmet
- cors
- dotenv
- And more...

#### 2.3 Create environment file
```bash
copy .env.example .env  # Windows
# or
cp .env.example .env    # Mac/Linux
```

#### 2.4 Configure environment variables

Edit `server/.env` with your settings:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/proxymukt
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/proxymukt

# JWT Secrets (Change these!)
JWT_ACCESS_SECRET=your-super-secret-jwt-access-key-change-this-to-something-random
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key-change-this-to-something-random
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# QR Code Configuration
QR_SECRET=your-qr-secret-key-change-this-to-something-random
QR_ROTATION_INTERVAL=20000

# Client URL
CLIENT_URL=http://localhost:5173

# Admin Credentials (for seeding)
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@proxymukt.com
ADMIN_PASSWORD=Admin@123

# Zoom Integration (Optional)
ZOOM_ACCOUNT_ID=your_zoom_account_id
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret

# Email Service (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

#### 2.5 Start MongoDB

**Option A: Local MongoDB**
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas**
- Create account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster
- Get connection string
- Update `MONGODB_URI` in `.env`

#### 2.6 Seed the database
```bash
npm run seed
```

This creates:
- 1 Admin user
- 50 Faculty users
- 500 Student users
- Sample classes and sessions

#### 2.7 Start backend server
```bash
npm run dev
```

Server should start on [http://localhost:5000](http://localhost:5000)

---

### Step 3: Frontend Setup

#### 3.1 Navigate to client directory
```bash
cd ../client
```

#### 3.2 Install dependencies
```bash
npm install
```

This will install:
- react
- react-router-dom
- axios
- socket.io-client
- framer-motion
- tailwindcss
- zustand
- And more...

#### 3.3 Create environment file
```bash
copy .env.example .env  # Windows
# or
cp .env.example .env    # Mac/Linux
```

#### 3.4 Configure environment variables

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

#### 3.5 Start frontend server
```bash
npm run dev
```

Frontend should start on [http://localhost:5173](http://localhost:5173)

---

## 🎯 Default Login Credentials

After seeding the database, use these credentials:

### Admin
- **Email:** admin@proxymukt.com
- **Password:** Admin@123

### Faculty (50 users)
- **Email:** faculty1@gmail.com to faculty50@gmail.com
- **Password:** faculty1 to faculty50

### Students (500 users)
- **Email:** student1@gmail.com to student500@gmail.com
- **Password:** student1 to student500

---

## 🧪 Testing the Installation

### 1. Test Backend API
```bash
curl http://localhost:5000
```

Expected response:
```json
{
  "message": "Attendance System API"
}
```

### 2. Test Frontend
Open browser and navigate to [http://localhost:5173](http://localhost:5173)

### 3. Test Login
1. Click "Login"
2. Use admin credentials
3. You should see the Admin Dashboard

### 4. Test Session Creation
1. Login as Faculty (faculty1@gmail.com / faculty1)
2. Create a new class
3. Start a session
4. Verify QR code appears

### 5. Test Attendance Marking
1. Open new incognito window
2. Login as Student (student1@gmail.com / student1)
3. Scan QR code (or use manual entry)
4. Verify attendance is marked

---

## 🔧 Troubleshooting

### Issue: MongoDB Connection Failed

**Solution:**
1. Ensure MongoDB is running
2. Check `MONGODB_URI` in `.env`
3. For Atlas, check network access and IP whitelist

### Issue: Port Already in Use

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue: npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Frontend not connecting to backend

**Solution:**
1. Check `VITE_API_URL` in `client/.env`
2. Ensure backend is running
3. Check CORS settings in `server/src/server.js`

### Issue: QR Code not rotating

**Solution:**
1. Check browser console for errors
2. Verify Socket.IO connection
3. Check `QR_ROTATION_INTERVAL` in `.env`

---

## 📱 Mobile Testing

### Using ngrok (for mobile device testing)

1. **Install ngrok**
   ```bash
   npm install -g ngrok
   ```

2. **Expose backend**
   ```bash
   ngrok http 5000
   ```

3. **Update frontend .env**
   ```env
   VITE_API_URL=https://your-ngrok-url.ngrok.io/api
   ```

4. **Expose frontend**
   ```bash
   ngrok http 5173
   ```

5. **Access from mobile**
   - Open the ngrok frontend URL on your mobile device

---

## 🚀 Production Deployment

### Deploy to Render.com

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Render**
   - Go to [https://dashboard.render.com/](https://dashboard.render.com/)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will auto-detect `render.yaml`

3. **Configure Environment Variables**
   - Add all required variables from `.env`
   - Set `NODE_ENV=production`
   - Use MongoDB Atlas URI

4. **Deploy**
   - Render will automatically build and deploy
   - Get your live URL

### Deploy to Vercel (Frontend Only)

```bash
cd client
npm run build
vercel --prod
```

### Deploy to Heroku (Backend)

```bash
cd server
heroku create proxymukt-api
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-atlas-uri
git push heroku main
```

---

## 📚 Additional Resources

### Documentation
- [API Documentation](server/API.md)
- [Features Guide](FEATURES.md)
- [Architecture Overview](ARCHITECTURE.md)
- [Changelog](CHANGELOG.md)

### Video Tutorials
- Installation Guide: [Coming Soon]
- Feature Walkthrough: [Coming Soon]
- Deployment Guide: [Coming Soon]

### Community
- GitHub Issues: [Report Bugs](https://github.com/YOUR_USERNAME/ProxyMukt-Attendance-System/issues)
- GitHub Discussions: [Ask Questions](https://github.com/YOUR_USERNAME/ProxyMukt-Attendance-System/discussions)

---

## 🆘 Getting Help

If you encounter any issues:

1. **Check the documentation** - Most common issues are covered
2. **Search existing issues** - Someone might have faced the same problem
3. **Create a new issue** - Provide detailed information:
   - Operating System
   - Node.js version
   - Error messages
   - Steps to reproduce

### Contact
- 📧 Email: sumantyadav3086@gmail.com
- 💬 GitHub: [@Sumant3086](https://github.com/Sumant3086)

---

## ✅ Installation Checklist

- [ ] Node.js installed (v18+)
- [ ] MongoDB installed/configured
- [ ] Git installed
- [ ] Repository cloned
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend .env configured
- [ ] Frontend .env configured
- [ ] Database seeded
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Can access frontend at localhost:5173
- [ ] Can login with test credentials
- [ ] Can create and start session
- [ ] Can mark attendance

---

**Congratulations! 🎉 Your ProxyMukt Attendance System is now running!**

**Next Steps:**
1. Explore the admin dashboard
2. Create your first class
3. Start a session and test QR scanning
4. Check out the analytics features
5. Customize the system for your institution

---

**Made with ❤️ for educational institutions worldwide**
