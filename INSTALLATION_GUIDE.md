# 📦 Installation Guide

Step-by-step guide to set up ProxyMukt locally.

---

## Prerequisites

- Node.js (v18+)
- MongoDB (v6+)
- Git

---

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/SameerMahato/ProxyMukt---Automated-Student-Attendance-System.git
cd ProxyMukt---Automated-Student-Attendance-System
```

---

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

**Edit `.env` file:**
```env
MONGODB_URI=mongodb://localhost:27017/proxymukt
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-secret-key
QR_SECRET=your-qr-secret
CLIENT_URL=http://localhost:5173
```

**Seed database and start:**
```bash
npm run seed
npm run dev
```

Server runs on: http://localhost:5000

---

### 3. Frontend Setup

```bash
cd client
npm install
cp .env.example .env
```

**Edit `.env` file:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Start frontend:**
```bash
npm run dev
```

Client runs on: http://localhost:5173

---

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@proxymukt.com | Admin@123 |
| Faculty | faculty1@gmail.com | faculty1 |
| Student | student1@gmail.com | student1 |

---

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check connection string in `.env`

**Port Already in Use:**
- Change PORT in server `.env`
- Or kill process using the port

**Dependencies Error:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

---

**Installation complete! Access the app at http://localhost:5173**
