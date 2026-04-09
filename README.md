# 🎓 ProxyMukt

### Intelligent Attendance System That Eliminates Proxy Attendance

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/Sumant3086/ProxyMukt-Attendance-System-)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-orange)](https://github.com/Sumant3086/ProxyMukt-Attendance-System-)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D6.0-green)](https://www.mongodb.com/)

---

### 🚀 [Live Demo](https://proxymukt.onrender.com/) 🚀

[**Features**](#-features) • [**Screenshots**](#-application-screenshots) • [**Installation**](#-installation) • [**Tech Stack**](#️-tech-stack) • [**Documentation**](#-api-documentation)

---

## 🎯 Quick Access

### 🌐 [Try ProxyMukt Live](https://proxymukt.onrender.com/)

**Instant Access - No Installation Required!**

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | admin@proxymukt.com | Admin@123 |
| 👨‍🏫 Faculty | faculty1@gmail.com | faculty1 |
| 👨‍🎓 Student | student1@gmail.com | student1 |

**Experience the full power of multi-layer fraud detection in action!**

---

## 🎯 Problem Statement

**The Challenge:** Proxy attendance is a widespread problem in educational institutions where students mark attendance on behalf of absent peers. Traditional systems using manual registers, static QR codes, or simple biometric methods are easily exploited, leading to:

- 📉 Inaccurate attendance records
- 🎭 Identity fraud and impersonation
- 📱 Screenshot sharing of QR codes
- 🌍 Location spoofing with fake GPS apps
- 🔄 Proxy marking through VPNs and proxies

**The Solution:** ProxyMukt implements a multi-layered security approach combining rotating QR codes, face liveness detection, GPS geofencing, device fingerprinting, and advanced proxy detection to create a fraud-proof attendance system that's impossible to bypass.

> 🌐 **Experience it yourself:** [https://proxymukt.onrender.com/](https://proxymukt.onrender.com/)

---

## ✨ Features

### 🔐 Multi-Layer Security Architecture

| 🎫 **Dynamic QR Authentication** | 👤 **Face Liveness Detection** |
|---|---|
| Rotating QR codes every 20 seconds<br>HMAC-SHA256 cryptographic signing<br>100-second validity window<br>Session-specific token binding<br>Screenshot fraud prevention | Real-time movement verification<br>Blink and head movement detection<br>Anti-spoofing with photo detection<br>Privacy-focused (no facial recognition)<br>TensorFlow.js powered |

| 📍 **GPS Geofencing** | 🖥️ **Device Fingerprinting** |
|---|---|
| Configurable radius verification<br>Location accuracy validation<br>Impossible travel detection<br>Distance calculation from session<br>Suspicious location flagging | Unique device signature tracking<br>Browser, OS, screen resolution<br>Hardware concurrency analysis<br>Multi-device detection<br>Suspicious pattern identification |

| 🛡️ **Proxy/VPN Detection** | ⚡ **Real-Time Updates** |
|---|---|
| Advanced IP reputation analysis<br>Datacenter IP identification<br>VPN and proxy detection<br>Tor network blocking<br>Real-time threat scoring | WebSocket integration<br>Live attendance feed<br>Instant notifications<br>Auto-refreshing dashboards<br>Session status sync |

---

### 👥 Role-Based Dashboards

#### 👨‍💼 Admin Dashboard
- System-wide analytics and monitoring
- User management (bulk operations)
- Security center with threat detection
- Audit logs and activity tracking
- Department and class management
- IP whitelist configuration

#### 👨‍🏫 Faculty Dashboard
- Class and session management
- Flexible verification controls
- Real-time attendance monitoring
- Student enrollment management
- Performance analytics
- Alert notifications

#### 👨‍🎓 Student Dashboard
- QR code scanning interface
- Attendance history and analytics
- Performance tracking
- Leave/appeal management
- Timetable and schedule
- Achievement badges

---

### 🎯 Advanced Features

- **Session Types:** Offline (QR) and Online (Zoom/Meet/Teams) support
- **Pause/Resume:** Faculty can pause sessions temporarily
- **Dynamic Controls:** Toggle verification methods during live sessions
- **Attendance Goals:** Set targets and track streaks
- **Leaderboards:** Gamification with rankings
- **Reports:** Export attendance data (CSV/PDF)
- **Notifications:** Real-time alerts for all stakeholders
- **Dark Theme:** Modern, eye-friendly UI

---

## 🎬 Live Demo & Screenshots

### 🌐 Try It Live: [https://proxymukt.onrender.com/](https://proxymukt.onrender.com/)

**Test Credentials:**
- 👑 Admin: `admin@proxymukt.com` / `Admin@123`
- 👨‍🏫 Faculty: `faculty1@gmail.com` / `faculty1`
- 👨‍🎓 Student: `student1@gmail.com` / `student1`

> 💡 **Tip:** Try logging in as different roles to experience the complete system!

---

### 📸 Application Screenshots

#### 🏠 Faculty Dashboard
![Faculty Dashboard](FacultyDashboard.png)
*Real-time session monitoring with live attendance updates, class management, and quick actions*

#### 👨‍💼 Admin Dashboard
![Admin Dashboard](AdminDashboard.png)
*Comprehensive system overview with analytics, user management, and security monitoring*

#### 👨‍🎓 Student Dashboard
![Student Dashboard](StudentDashboard.png)
*Student portal with attendance history, performance metrics, and QR scanning*

#### 📱 QR Scanning Interface
![QR Scanning](StudentQR.png)
*Seamless QR code scanning with face liveness and location verification*

#### 📅 Live Session Monitoring
![Class Session](ClassSession.png)
*Faculty view of active session with real-time attendance feed and verification status*

#### 🚨 Faculty Alerts & Security
![Faculty Alerts](FacultyAlerts.png)
*Security alerts for proxy detection, suspicious activity, and low attendance warnings*

#### 📢 Announcements System
![Announcements](Announcements.png)
*System-wide and class-specific announcements with priority levels*

#### 📝 Leave Management & Appeals
![Leave Appeal](LeaveAppeal.png)
*Student leave requests and appeals with document upload support*

#### 📅 Student Timetable
![Timetable](StudentTimeTable.png)
*Weekly schedule with upcoming sessions and calendar integration*

---

## 🛠️ Tech Stack

### Frontend
```
⚛️  React 18              - Modern UI library with hooks
🚀  Vite                  - Lightning-fast build tool
🎨  Tailwind CSS          - Utility-first styling
🎭  Framer Motion         - Smooth animations
🔄  React Router          - Client-side routing
📊  Recharts              - Data visualization
🔌  Socket.IO Client      - Real-time communication
📷  jsQR                  - QR code scanning
🎯  Zustand               - State management
🎨  Lucide React          - Beautiful icons
```

### Backend
```
🟢  Node.js               - JavaScript runtime
⚡  Express               - Web framework
🍃  MongoDB               - NoSQL database
🔐  JWT                   - Authentication
🔒  bcryptjs              - Password hashing
🔌  Socket.IO             - WebSocket server
📧  Nodemailer            - Email service
🛡️  Helmet                - Security headers
⏱️  Express Rate Limit    - DDoS protection
```

### Security & ML
```
🤖  TensorFlow.js         - Face liveness detection
🔐  HMAC-SHA256           - QR token signing
🛡️  Advanced Proxy Detection
📍  Geolocation API       - GPS verification
🖥️  Device Fingerprinting
🔍  IP Reputation Analysis
```

---

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)
- **npm** or **yarn** package manager

---

### Quick Start

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Sumant3086/ProxyMukt-Attendance-System-.git
cd ProxyMukt-Attendance-System-
```

#### 2️⃣ Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# Required: MONGODB_URI, JWT_SECRET
# Optional: ZOOM credentials, Email service

# Seed database with sample data
npm run seed

# Start development server
npm run dev
```

**Server will run on:** `http://localhost:5000`

#### 3️⃣ Frontend Setup
```bash
# Navigate to client directory (from root)
cd client

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with API URL
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

**Client will run on:** `http://localhost:5173`

---

### 🔧 Environment Configuration

**Server Environment Variables (.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/proxymukt
JWT_ACCESS_SECRET=your-super-secret-jwt-access-key-change-this
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key-change-this
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
QR_SECRET=your-qr-secret-key-change-this
QR_ROTATION_INTERVAL=20000
CLIENT_URL=http://localhost:5173

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

**Client Environment Variables (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 🎯 Default Login Credentials

After running `npm run seed`, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | admin@proxymukt.com | Admin@123 |
| 👨‍🏫 Faculty | faculty1@gmail.com | faculty1 |
| 👨‍🎓 Student | student1@gmail.com | student1 |

**Note:** Faculty and students are numbered 1-50 and 1-500 respectively

---

## 🎯 How It Works

### 📋 System Flow

```
┌─────────────────────────────────────────────────────┐
│  Faculty Creates Session                            │
│  ↓                                                   │
│  QR Code Generated (HMAC-SHA256)                   │
│  ↓                                                   │
│  Student Scans QR Code                              │
│  ↓                                                   │
│  Multi-Layer Verification:                          │
│    ✓ QR Token Signature                            │
│    ✓ Face Liveness Detection                       │
│    ✓ GPS Geofencing                                │
│    ✓ Device Fingerprint                            │
│    ✓ Proxy/VPN Detection                           │
│  ↓                                                   │
│  Attendance Marked Successfully                     │
└─────────────────────────────────────────────────────┘
```

---

### 🔄 Detailed Workflow

#### For Faculty:
1. **Create Class** → Add class details and enroll students
2. **Start Session** → Choose type (Offline/Online) and configure verification methods
3. **Monitor Live** → View real-time attendance feed with student names
4. **Manage Session** → Pause/resume, toggle QR, adjust verification settings
5. **End Session** → Close session and review analytics

#### For Students:
1. **Scan QR Code** → Use camera to scan faculty's rotating QR code
2. **Face Verification** → Complete liveness check (blink/move head)
3. **Location Check** → Confirm presence at session location
4. **Background Checks** → System validates device, IP, and proxy status
5. **Attendance Confirmed** → Receive instant confirmation and notification

#### Security Validation:
```
┌─────────────────────────────────────────────────────┐
│  Multi-Layer Security Validation                    │
├─────────────────────────────────────────────────────┤
│  ✓ QR Token Signature (HMAC-SHA256)                │
│  ✓ Token Expiry (100 seconds)                      │
│  ✓ Session Binding                                 │
│  ✓ Face Liveness (if enabled)                      │
│  ✓ GPS Distance (if enabled)                       │
│  ✓ Device Fingerprint Match                        │
│  ✓ IP Reputation Score                             │
│  ✓ Proxy/VPN Detection                             │
│  ✓ Impossible Travel Check                         │
│  ✓ Rate Limit Validation                           │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
ProxyMukt-Attendance-System/
│
├── 📂 client/                      # React Frontend Application
│   ├── 📂 public/                  # Static assets
│   │   ├── logo.svg
│   │   └── _redirects              # Netlify/Vercel redirects
│   │
│   ├── 📂 src/
│   │   ├── 📂 components/          # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── QRDisplay.jsx
│   │   │   └── ...
│   │   │
│   │   ├── 📂 pages/               # Page components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── FacultyDashboard.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── StartSession.jsx
│   │   │   ├── ScanQR.jsx
│   │   │   └── ...
│   │   │
│   │   ├── 📂 store/               # Zustand state management
│   │   │   ├── authStore.js
│   │   │   └── sessionStore.js
│   │   │
│   │   ├── 📂 utils/               # Utility functions
│   │   │   ├── axiosInstance.js
│   │   │   ├── deviceFingerprint.js
│   │   │   └── voiceAnnouncements.js
│   │   │
│   │   ├── App.jsx                 # Main app component
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── 📂 server/                      # Node.js Backend Application
│   ├── 📂 src/
│   │   ├── 📂 config/              # Configuration files
│   │   │   └── db.js               # MongoDB connection
│   │   │
│   │   ├── 📂 controllers/         # Business logic
│   │   │   ├── authController.js
│   │   │   ├── sessionController.js
│   │   │   ├── attendanceController.js
│   │   │   └── ...
│   │   │
│   │   ├── 📂 middleware/          # Custom middleware
│   │   │   ├── auth.js             # JWT authentication
│   │   │   ├── role.js             # Role-based access
│   │   │   └── auditLogger.js      # Audit logging
│   │   │
│   │   ├── 📂 models/              # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Class.js
│   │   │   ├── Session.js
│   │   │   ├── Attendance.js
│   │   │   └── ...
│   │   │
│   │   ├── 📂 routes/              # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── sessionRoutes.js
│   │   │   └── ...
│   │   │
│   │   ├── 📂 utils/               # Utility functions
│   │   │   ├── proxyDetection.js
│   │   │   ├── deviceFingerprint.js
│   │   │   └── geofencing.js
│   │   │
│   │   └── server.js               # Server entry point
│   │
│   ├── package.json
│   ├── seed.js                     # Database seeding script
│   └── .env.example
│
├── render.yaml                     # Render.com deployment config
├── .gitignore
├── LICENSE
└── README.md
```

---

## 📚 API Documentation

### 🔐 Authentication Endpoints

**POST /api/auth/register** - Register new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "STUDENT"
}
```

**POST /api/auth/login** - User login
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### 📅 Session Endpoints

**POST /api/sessions** - Create new session
**GET /api/sessions/:id/qr** - Get QR token

### ✅ Attendance Endpoints

**POST /api/attendance/mark** - Mark attendance

### 📊 Analytics Endpoints

**GET /api/analytics/section?section=all** - Get analytics

---

## 🚀 Deployment

### 🌐 Live Production Instance

**ProxyMukt is live at:** [https://proxymukt.onrender.com/](https://proxymukt.onrender.com/)

The application is deployed on Render.com with:
- ✅ Automatic SSL/HTTPS
- ✅ MongoDB Atlas database
- ✅ Environment-based configuration
- ✅ Auto-deploy on GitHub push
- ✅ Health monitoring

---

### Deploy Your Own Instance

#### Deploy to Render.com (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will auto-detect `render.yaml`

3. **Configure Environment Variables**
   - Add all required environment variables in Render dashboard
   - Set `NODE_ENV=production`
   - Configure MongoDB Atlas URI

4. **Deploy**
   - Render will automatically build and deploy
   - Get your live URL: `https://your-app.onrender.com`

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 1️⃣ Fork & Clone
```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/ProxyMukt-Attendance-System-.git
```

### 2️⃣ Create Branch
```bash
git checkout -b feature/AmazingFeature
```

### 3️⃣ Make Changes
- Write clean, documented code
- Follow existing code style
- Add tests for new features
- Update documentation

### 4️⃣ Commit & Push
```bash
git add .
git commit -m "Add: Amazing new feature"
git push origin feature/AmazingFeature
```

### 5️⃣ Open Pull Request
- Go to your fork on GitHub
- Click "New Pull Request"
- Describe your changes
- Wait for review

---

### 📋 Contribution Guidelines
- Follow [Conventional Commits](https://www.conventionalcommits.org/)
- Write meaningful commit messages
- Add tests for new features
- Update README if needed
- Be respectful and collaborative

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Sumant Kumar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 👨‍💻 Author

### Sumant Kumar

[![GitHub](https://img.shields.io/badge/GitHub-Sumant3086-black?logo=github)](https://github.com/Sumant3086)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-sumant--kumar-blue?logo=linkedin)](https://linkedin.com/in/sumant-kumar)
[![Email](https://img.shields.io/badge/Email-sumantyadav3086%40gmail.com-red?logo=gmail)](mailto:sumantyadav3086@gmail.com)

**Full Stack Developer | AI/ML Enthusiast | Open Source Contributor**

---

## 🙏 Acknowledgments

Special thanks to:
- **TensorFlow.js** team for face detection models
- **Socket.IO** for real-time communication
- **MongoDB** for flexible database solutions
- **React** and **Vite** communities
- **Tailwind CSS** for beautiful styling
- All **open-source contributors**

### Technologies & Libraries
- QR Code generation using `crypto` HMAC-SHA256
- Face liveness detection with TensorFlow.js
- Real-time updates powered by Socket.IO
- UI components inspired by Shadcn/ui
- Icons from Lucide React
- Charts from Recharts

---

## 📞 Support

Need help? We're here for you!

- 🌐 **Live Demo:** [https://proxymukt.onrender.com/](https://proxymukt.onrender.com/)
- 📧 **Email:** [sumantyadav3086@gmail.com](mailto:sumantyadav3086@gmail.com)
- 🐛 **Issues:** [GitHub Issues](https://github.com/Sumant3086/ProxyMukt-Attendance-System-/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/Sumant3086/ProxyMukt-Attendance-System-/discussions)
- 📖 **Documentation:** [Wiki](https://github.com/Sumant3086/ProxyMukt-Attendance-System-/wiki)

---

## 🔄 Version History

### 🎉 v2.0.0 (Current - April 2025)

**Major Features:**
- ✅ Multi-layer fraud detection system
- ✅ Real-time WebSocket updates
- ✅ Faculty-controlled verification methods
- ✅ Advanced analytics dashboard
- ✅ Dark theme UI with animations
- ✅ Student enrollment management
- ✅ Pause/resume session functionality
- ✅ Online session support (Zoom/Meet/Teams)
- ✅ Leave and appeal management
- ✅ Attendance goals and streaks
- ✅ Production deployment ready

**Security Enhancements:**
- 🔒 HMAC-SHA256 QR token signing
- 🔒 Advanced proxy/VPN detection
- 🔒 Device fingerprinting
- 🔒 Impossible travel detection
- 🔒 Rate limiting and DDoS protection

### 📦 v1.0.0 (Initial Release)
- Basic QR code attendance
- Simple authentication
- Manual attendance marking
- Basic reporting

---

## 🗺️ Roadmap

### 🎯 Upcoming Features

- [ ] **Mobile Apps** (React Native)
- [ ] **Biometric Authentication** (Fingerprint/Face ID)
- [ ] **AI-Powered Insights** (Predictive analytics)
- [ ] **Blockchain Integration** (Immutable attendance records)
- [ ] **Multi-Language Support** (i18n)
- [ ] **Offline Mode** (PWA with sync)
- [ ] **Parent Portal** (Real-time notifications)
- [ ] **Integration APIs** (LMS, ERP systems)
- [ ] **Advanced Reporting** (Custom report builder)
- [ ] **Video Proctoring** (For online exams)

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/Sumant3086/ProxyMukt-Attendance-System-?style=social)
![GitHub forks](https://img.shields.io/github/forks/Sumant3086/ProxyMukt-Attendance-System-?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/Sumant3086/ProxyMukt-Attendance-System-?style=social)

![GitHub issues](https://img.shields.io/github/issues/Sumant3086/ProxyMukt-Attendance-System-)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Sumant3086/ProxyMukt-Attendance-System-)
![GitHub last commit](https://img.shields.io/github/last-commit/Sumant3086/ProxyMukt-Attendance-System-)

---

### ⭐ Star this repository if you find it helpful!

**Made with ❤️ for educational institutions worldwide**

**Eliminating proxy attendance, one scan at a time 🎓**

---

[⬆ Back to Top](#-proxymukt)
