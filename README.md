# 🎓 Automated Student Attendance Monitoring and Analytics System

A comprehensive MERN stack application for automated attendance tracking with **QR codes**, **geofencing**, **real-time analytics**, and **anti-fraud detection**.

## 🌟 Unique Features (Patent-Worthy)

### 1. **Geofencing + Location Verification** 📍
- GPS-based attendance verification
- Prevents proxy attendance from outside campus
- Configurable geofence radius (25m - 500m)
- Anti-spoofing detection for location fraud
- Complete audit trail with coordinates

### 2. **Advanced Device Fingerprinting** 🔐
- Unique device identification per student
- Browser, OS, and platform tracking
- Proxy/VPN/Tor detection
- Risk scoring system
- Suspicious device flagging

### 3. **Comprehensive Audit Logging** 📝
- Complete action tracking (login, attendance, session management)
- IP address and device information logging
- Timestamp and user tracking
- Admin-only audit log viewer
- Searchable and filterable logs

### 4. **Online Session Management** 💻
- Zoom integration with Server-to-Server OAuth
- Support for Google Meet, Microsoft Teams, WebRTC
- Automatic participant tracking
- Session duration monitoring
- Attendance processing from online sessions

### 5. **Real-time Notifications** 🔔
- Session start/end notifications
- Attendance confirmation alerts
- Low attendance warnings
- Class update notifications
- Unread notification counter

### 6. **Advanced Analytics & Insights** 📊
- Real-time attendance dashboards
- At-risk student detection (below 75%)
- Monthly trend analysis
- Attendance heatmaps
- Predictive insights
- CSV export for reports

### 7. **Rotating QR System** 🔄
- QR codes rotate every 20 seconds
- HMAC-SHA256 signature verification
- Prevents screenshot fraud
- Real-time Socket.IO updates

### 8. **Professional UI/UX** 🎨
- Glassmorphism design
- Framer Motion animations
- Dark/Light mode
- Fully responsive
- Accessibility compliant

## 🚀 Tech Stack

### Frontend
- **React 18** + Vite
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Socket.IO Client** for real-time updates
- **Zustand** for state management
- **Axios** for API calls

### Backend
- **Node.js** + Express
- **MongoDB** + Mongoose
- **JWT** authentication
- **Socket.IO** for real-time QR rotation
- **bcrypt** for password hashing
- Security: Helmet, CORS, Rate Limiting

## 📦 Installation

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)
- Git

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd attendance-system
```

2. **Backend Setup**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm run dev
```

3. **Frontend Setup**
```bash
cd client
npm install
npm run dev
```

4. **Seed Database** (Optional)
```bash
cd server
node seed.js
```

### Environment Variables

**Server (.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/attendance_system
JWT_ACCESS_SECRET=your-access-token-secret
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
QR_SECRET=your-qr-secret
QR_ROTATION_INTERVAL=20000
CLIENT_URL=http://localhost:5173

# Admin Credentials (for seeding)
ADMIN_NAME=Your Name
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password

# Zoom Integration (Optional)
ZOOM_ACCOUNT_ID=your_zoom_account_id
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret
```

**Client (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

## 👤 Default Credentials

After running `node seed.js`:

**Owner/Admin:**
- Email: `admin@example.com` *(set via `ADMIN_EMAIL` in `.env`)*
- Password: *(set via `ADMIN_PASSWORD` in `.env`)*
- Role: ADMIN

**Faculty:**
- Email: `faculty@example.com`
- Password: `faculty123`

**Students:**
- Email: `student@example.com` / Password: `student123`
- Email: `alice@example.com` / Password: `student123`
- Email: `bob@example.com` / Password: `student123`
- Email: `charlie@example.com` / Password: `student123`

## 📚 Key Features

### For Faculty
- ✅ Create and manage classes
- ✅ Start live sessions with QR codes
- ✅ Configure geofencing per session
- ✅ Create Zoom meetings for online sessions
- ✅ Monitor online session participants
- ✅ View real-time attendance
- ✅ Access analytics dashboard
- ✅ Export attendance reports (CSV)
- ✅ Identify at-risk students
- ✅ Receive real-time notifications

### For Students
- ✅ Scan QR codes to mark attendance
- ✅ Automatic location verification
- ✅ Join online sessions (Zoom, Meet, Teams)
- ✅ View attendance history
- ✅ Personal analytics dashboard
- ✅ Class-wise performance tracking
- ✅ Monthly trend analysis
- ✅ Attendance heatmaps
- ✅ Real-time notifications

### For Admin
- ✅ User management (CRUD)
- ✅ System-wide analytics
- ✅ Class and session oversight
- ✅ Attendance reports
- ✅ At-risk student monitoring
- ✅ Complete audit log access
- ✅ Device and security monitoring

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- HMAC-SHA256 QR code signatures
- Rate limiting on API endpoints (500 requests per 15 minutes)
- Helmet.js security headers
- CORS protection
- Location spoofing detection
- Device fingerprinting
- Proxy/VPN/Tor detection
- Risk scoring system
- Comprehensive audit logging
- Input validation and sanitization

## 📖 Documentation

- **[FEATURES.md](FEATURES.md)** - Complete feature list
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture
- **[ANALYTICS_FEATURES.md](ANALYTICS_FEATURES.md)** - Analytics documentation
- **[GEOFENCING_FEATURE.md](GEOFENCING_FEATURE.md)** - Geofencing details
- **[INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)** - Detailed setup guide
- **[SETUP_MONGODB_ATLAS.md](SETUP_MONGODB_ATLAS.md)** - MongoDB Atlas setup
- **[server/API.md](server/API.md)** - API reference

## 🎯 Problem Statement Addressed

This system solves the following problems in college attendance management:

✅ **Manual Roll Calls** - Automated QR-based attendance  
✅ **Proxy Attendance** - Geofencing prevents remote marking  
✅ **Time Wastage** - Instant attendance marking  
✅ **Data Errors** - Digital records with audit trails  
✅ **Lack of Insights** - Advanced analytics and predictions  
✅ **At-Risk Students** - Automatic detection and alerts  
✅ **Report Generation** - One-click CSV exports  

## 🏆 Competitive Advantages

1. **Geofencing** - Unique location verification system
2. **Anti-Spoofing** - Detects fake GPS and mock locations
3. **Device Fingerprinting** - Prevents device sharing and fraud
4. **Proxy Detection** - Identifies VPN/Proxy usage
5. **Audit Logging** - Complete security and compliance tracking
6. **Online Sessions** - Zoom integration for hybrid learning
7. **Real-time Notifications** - Instant updates for all users
8. **Real-time Analytics** - Live dashboards and insights
9. **Rotating QR Codes** - Prevents screenshot fraud
10. **Professional UI** - Modern, intuitive interface
11. **Scalable** - Handles thousands of students
12. **Open Source** - Customizable and extensible

## 📱 Screenshots

(Add screenshots of your application here)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Developer

**Sameer Mahato**
- Email: sameermahato793@gmail.com
- Phone: +91-XXXXXXXXXX

## 🙏 Acknowledgments

- Problem statement inspired by real college attendance challenges
- Built with modern MERN stack best practices
- Designed for scalability and maintainability

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: sameermahato793@gmail.com

---

**Made with ❤️ for educational institutions**
