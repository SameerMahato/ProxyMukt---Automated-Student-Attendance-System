# 🚀 ProxyMukt - Quick Reference Card

## 🔑 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | admin@proxymukt.com | Admin@123 |
| 👨‍🏫 Faculty | faculty1@gmail.com | faculty1 |
| 👨‍🎓 Student | student1@gmail.com | student1 |

---

## 🎯 Quick Start Commands

### Start Development Servers
```bash
# Windows - Double click
START_PROJECT.bat

# Or manually
cd server && npm run dev
cd client && npm run dev
```

### Install Dependencies
```bash
cd server && npm install
cd client && npm install
```

### Seed Database
```bash
cd server && npm run seed
```

---

## 🔧 New API Endpoints

### Session Control
```http
POST   /api/sessions/:id/toggle-qr          # Toggle QR code
POST   /api/sessions/:id/toggle-pause       # Pause/Resume session
PATCH  /api/sessions/:id/verification       # Update verification settings
```

### Request Body Examples
```json
// Toggle verification settings
{
  "requireGeofencing": true,
  "requireFaceLiveness": false,
  "requireDeviceCheck": true,
  "requireProxyCheck": true
}
```

---

## 🎨 New UI Components

### StartSession Page Features
- ✅ Pause/Resume button
- ✅ QR toggle button
- ✅ 4 verification toggles
- ✅ Live attendance feed
- ✅ Real-time statistics
- ✅ Glassmorphism design

### Verification Toggles
1. 📍 **Geofencing** - Location verification
2. 👁️ **Face Liveness** - Facial verification
3. 🖐️ **Device Check** - Device fingerprinting
4. 🛡️ **Proxy Detection** - VPN/Proxy blocking

---

## 🔄 Real-Time Events

### Socket.IO Events
```javascript
// Client listens for:
'qr-update'                      // New QR token
'attendance-marked'              // New attendance
'verification-settings-updated'  // Settings changed

// Client emits:
'join-session'    // Join session room
'leave-session'   // Leave session room
```

---

## 📊 Session Model Updates

### New Fields
```javascript
{
  verificationSettings: {
    requireGeofencing: Boolean,
    requireFaceLiveness: Boolean,
    requireDeviceCheck: Boolean,
    requireProxyCheck: Boolean
  },
  qrEnabled: Boolean,
  isPaused: Boolean
}
```

---

## 🧪 Testing Checklist

### Faculty Features
- [ ] Start session
- [ ] Toggle geofencing
- [ ] Toggle face liveness
- [ ] Toggle device check
- [ ] Toggle proxy detection
- [ ] Pause session
- [ ] Resume session
- [ ] Toggle QR code
- [ ] View live attendance
- [ ] End session

### Student Features
- [ ] Scan QR code
- [ ] Complete verifications
- [ ] Mark attendance
- [ ] View attendance history
- [ ] Check statistics

---

## 🔒 Security Features

### Multi-Layer Verification
1. **QR Token** - HMAC-SHA256 signed, 100s validity
2. **Geofencing** - GPS location verification
3. **Face Liveness** - Real-time facial movement
4. **Device Fingerprint** - Unique device ID
5. **Proxy Detection** - VPN/Proxy/Tor blocking

---

## 📱 URLs

### Development
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API: http://localhost:5000/api

### Production (Example)
- Live Demo: https://proxymukt.onrender.com
- API: https://proxymukt-api.onrender.com

---

## 🐛 Common Issues & Fixes

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB Not Running
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Socket.IO Not Connecting
1. Check CORS settings in server.js
2. Verify CLIENT_URL in .env
3. Check browser console for errors

---

## 📚 File Structure

### Key Files Modified
```
server/
├── src/
│   ├── models/Session.js              ✅ Updated
│   ├── controllers/sessionController.js  ✅ Updated
│   ├── routes/sessionRoutes.js        ✅ Updated
│   ├── controllers/attendanceController.js  ✅ Updated
│   └── server.js                      ✅ Updated

client/
└── src/
    └── pages/StartSession.jsx         ✅ Redesigned

Documentation/
├── README.md                          ✅ Rewritten
├── CHANGELOG.md                       ✅ New
├── INSTALLATION_GUIDE.md              ✅ New
├── UPDATES_SUMMARY.md                 ✅ New
└── QUICK_REFERENCE.md                 ✅ This file

Configuration/
├── render.yaml                        ✅ New
└── START_PROJECT.bat                  ✅ New
```

---

## 🎯 Feature Flags

### Environment Variables
```env
# QR Configuration
QR_ROTATION_INTERVAL=20000    # 20 seconds

# JWT Configuration
JWT_ACCESS_EXPIRY=15m         # 15 minutes
JWT_REFRESH_EXPIRY=7d         # 7 days

# Server Configuration
PORT=5000
NODE_ENV=development
```

---

## 🔄 Git Commands

### Update Your Project
```bash
git pull origin main
npm install
```

### Commit Changes
```bash
git add .
git commit -m "feat: Add verification toggles"
git push origin main
```

### Create Branch
```bash
git checkout -b feature/new-feature
```

---

## 📞 Support

### Quick Links
- 📧 Email: sumantyadav3086@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/Sumant3086/ProxyMukt-Attendance-System-/issues)
- 💬 Chat: [GitHub Discussions](https://github.com/Sumant3086/ProxyMukt-Attendance-System-/discussions)
- 📖 Docs: [README.md](README.md)

### Documentation
- Installation: [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)
- Changes: [CHANGELOG.md](CHANGELOG.md)
- Updates: [UPDATES_SUMMARY.md](UPDATES_SUMMARY.md)

---

## 🎓 Learning Path

### For Beginners
1. Read README.md
2. Follow INSTALLATION_GUIDE.md
3. Test with default credentials
4. Explore admin dashboard
5. Create a test session

### For Developers
1. Review CHANGELOG.md
2. Study code changes
3. Test new API endpoints
4. Customize features
5. Deploy to production

---

## ⚡ Performance Tips

### Backend
- Use MongoDB indexes
- Enable caching
- Optimize queries
- Use connection pooling

### Frontend
- Lazy load components
- Optimize images
- Use code splitting
- Enable compression

---

## 🎨 UI Customization

### Colors
```css
/* Gradient backgrounds */
from-indigo-900 via-purple-900 to-pink-900

/* Status colors */
green-500  /* Success */
red-500    /* Error */
yellow-500 /* Warning */
blue-500   /* Info */
```

### Animations
```javascript
// Framer Motion
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.1 }}
```

---

## 🔐 Security Checklist

- [ ] Change default JWT secrets
- [ ] Use strong admin password
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Use environment variables
- [ ] Enable rate limiting
- [ ] Implement audit logging
- [ ] Regular security updates

---

## 📊 Monitoring

### Health Checks
```bash
# Backend health
curl http://localhost:5000

# Database connection
mongosh --eval "db.adminCommand('ping')"
```

### Logs
```bash
# View backend logs
cd server && npm run dev

# View frontend logs
cd client && npm run dev
```

---

## 🚀 Deployment

### Quick Deploy to Render
1. Push to GitHub
2. Connect to Render
3. Select Blueprint
4. Configure environment
5. Deploy

### Environment Variables (Production)
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
QR_SECRET=...
CLIENT_URL=https://your-app.com
```

---

## 📈 Analytics

### Key Metrics
- Total sessions created
- Average attendance rate
- At-risk students count
- Proxy detection rate
- System uptime

### Reports
- Daily attendance
- Monthly trends
- Class-wise statistics
- Student performance

---

## 🎉 Success Indicators

✅ All servers running
✅ Can login successfully
✅ Can create sessions
✅ QR code rotates
✅ Attendance marks instantly
✅ Real-time updates work
✅ Verification toggles work
✅ No console errors

---

**Keep this file handy for quick reference!**

**Made with ❤️ for educational institutions worldwide**
