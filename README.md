# 🎓 ProxyMukt - Smart Attendance System

<div align="center">

### Intelligent Attendance System with Multi-Layer Fraud Detection

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/SameerMahato/ProxyMukt---Automated-Student-Attendance-System)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-orange)](https://github.com/SameerMahato/ProxyMukt---Automated-Student-Attendance-System)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D6.0-green)](https://www.mongodb.com/)

[Features](#-key-features) • [Demo](#-live-demo) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Screenshots](#-screenshots)

</div>

---

## 📋 Overview

ProxyMukt is a comprehensive attendance management system designed to eliminate proxy attendance through advanced security measures. Built with the MERN stack, it combines rotating QR codes, face liveness detection, GPS geofencing, and device fingerprinting to ensure authentic attendance marking.

### 🎯 Problem & Solution

**Challenge:** Traditional attendance systems are vulnerable to fraud through screenshot sharing, location spoofing, and proxy marking.

**Solution:** Multi-layered security architecture that validates attendance through:
- Dynamic QR codes (HMAC-SHA256 signed, 20-second rotation)
- Real-time face liveness detection (TensorFlow.js)
- GPS geofencing with accuracy validation
- Device fingerprinting and tracking
- Advanced proxy/VPN detection

---

## ✨ Key Features

### 🔐 Security Features
- **Dynamic QR Authentication** - Rotating codes every 20 seconds with cryptographic signing
- **Face Liveness Detection** - Real-time verification using TensorFlow.js
- **GPS Geofencing** - Location-based attendance validation
- **Device Fingerprinting** - Unique device tracking and multi-device detection
- **Proxy/VPN Detection** - Advanced IP reputation analysis

### 👥 Role-Based Access
- **Admin Dashboard** - System analytics, user management, audit logs
- **Faculty Dashboard** - Class management, session control, real-time monitoring
- **Student Dashboard** - QR scanning, attendance history, performance tracking

### ⚡ Real-Time Features
- WebSocket integration for live updates
- Instant attendance notifications
- Real-time session monitoring
- Auto-refreshing dashboards

### 🎯 Advanced Capabilities
- Online session support (Zoom/Meet/Teams)
- Pause/resume session functionality
- Dynamic verification controls
- Attendance goals and streaks
- Gamification with leaderboards
- CSV/PDF report exports

---



### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | admin@proxymukt.com | Admin@123 |
| 👨‍🏫 Faculty | faculty1@gmail.com | faculty1 |
| 👨‍🎓 Student | student1@gmail.com | student1 |

---

## 📸 Screenshots

<div align="center">

### Faculty Dashboard
![Faculty Dashboard](FacultyDashboard.png)
*Real-time session monitoring with live attendance feed*

### Admin Dashboard
![Admin Dashboard](AdminDashboard.png)
*System-wide analytics and user management*

### Student QR Scanning
![QR Scanning](StudentQR.png)
*Multi-layer verification during attendance marking*

</div>

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI with hooks
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Socket.IO Client** - Real-time communication
- **Zustand** - State management
- **Recharts** - Data visualization

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Socket.IO** - WebSocket server
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Security & ML
- **TensorFlow.js** - Face detection
- **HMAC-SHA256** - QR token signing
- **Helmet** - Security headers
- **Express Rate Limit** - DDoS protection

---

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (v6+)
- Git

### Quick Start

```bash
# Clone repository
git clone https://github.com/SameerMahato/ProxyMukt---Automated-Student-Attendance-System.git
cd ProxyMukt---Automated-Student-Attendance-System

# Backend setup
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run seed
npm run dev

# Frontend setup (new terminal)
cd client
npm install
cp .env.example .env
# Edit .env with API URL
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Environment Variables

**Server (.env)**
```env
MONGODB_URI=mongodb://localhost:27017/proxymukt
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-secret-key
QR_SECRET=your-qr-secret
CLIENT_URL=http://localhost:5173
```

**Client (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🎯 How It Works

### System Flow

```
Faculty Creates Session
    ↓
QR Code Generated (HMAC-SHA256)
    ↓
Student Scans QR Code
    ↓
Multi-Layer Verification:
  ✓ QR Token Signature
  ✓ Face Liveness Detection
  ✓ GPS Geofencing
  ✓ Device Fingerprint
  ✓ Proxy/VPN Detection
    ↓
Attendance Marked Successfully
```

### Key Workflows

**For Faculty:**
1. Create class and enroll students
2. Start session with verification settings
3. Monitor real-time attendance
4. Manage session controls
5. Review analytics

**For Students:**
1. Scan rotating QR code
2. Complete face verification
3. Confirm location
4. System validates device and IP
5. Receive instant confirmation

---

## 📁 Project Structure

```
ProxyMukt/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # State management
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── server/                # Node.js Backend
│   ├── src/
│   │   ├── controllers/   # Business logic
│   │   ├── models/        # Database schemas
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── utils/         # Utility functions
│   └── package.json
│
└── render.yaml           # Deployment config
```

---

## 🚀 Deployment

### Deploy to Render.com

1. Push to GitHub
2. Connect repository to Render
3. Configure environment variables
4. Deploy automatically

The application includes `render.yaml` for easy deployment with:
- Automatic SSL/HTTPS
- MongoDB Atlas integration
- Auto-deploy on push
- Health monitoring

---

## 📊 API Documentation

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

### Sessions
- `POST /api/sessions` - Create session
- `GET /api/sessions/:id/qr` - Get QR token
- `PATCH /api/sessions/:id/verification` - Update settings

### Attendance
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/student/:id` - Get student attendance

### Analytics
- `GET /api/analytics/section` - Get analytics data

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2025 Sameer Mahato

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

**Sameer Mahato**

[![GitHub](https://img.shields.io/badge/GitHub-SameerMahato-black?logo=github)](https://github.com/SameerMahato)
[![Email](https://img.shields.io/badge/Email-sameermahato793%40gmail.com-red?logo=gmail)](mailto:sameermahato793@gmail.com)

Full Stack Developer | MERN Stack Specialist

---

## 📞 Support

- 📧 Email: [sameermahato793@gmail.com](mailto:sameermahato793@gmail.com)
- 🐛 Issues: [GitHub Issues](https://github.com/SameerMahato/ProxyMukt---Automated-Student-Attendance-System/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/SameerMahato/ProxyMukt---Automated-Student-Attendance-System/discussions)

---

## 🙏 Acknowledgments

- TensorFlow.js for face detection models
- Socket.IO for real-time communication
- MongoDB for database solutions
- React and Vite communities
- Tailwind CSS for styling

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Made with ❤️ for educational institutions worldwide**

![GitHub stars](https://img.shields.io/github/stars/SameerMahato/ProxyMukt---Automated-Student-Attendance-System?style=social)
![GitHub forks](https://img.shields.io/github/forks/SameerMahato/ProxyMukt---Automated-Student-Attendance-System?style=social)

[⬆ Back to Top](#-proxymukt---smart-attendance-system)

</div>
