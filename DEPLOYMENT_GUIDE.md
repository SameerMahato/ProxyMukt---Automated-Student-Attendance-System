# 🚀 ProxyMukt Deployment Guide

Complete guide for deploying ProxyMukt Attendance System to production.

---

## 📋 Pre-Deployment Checklist

### ✅ Code Preparation
- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] All API endpoints working
- [ ] Database migrations complete
- [ ] Environment variables documented
- [ ] Security vulnerabilities checked
- [ ] Performance optimized
- [ ] Code reviewed and approved

### ✅ Configuration
- [ ] Production environment variables set
- [ ] Database connection string updated
- [ ] JWT secrets changed from defaults
- [ ] CORS origins configured
- [ ] Rate limiting configured
- [ ] Email service configured (optional)
- [ ] Zoom credentials added (optional)

### ✅ Security
- [ ] Strong passwords for admin accounts
- [ ] JWT secrets are random and secure
- [ ] QR secret is random and secure
- [ ] Database credentials secure
- [ ] API keys not exposed in code
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting enabled

### ✅ Documentation
- [ ] README.md updated
- [ ] API documentation complete
- [ ] Environment variables documented
- [ ] Deployment steps documented
- [ ] Troubleshooting guide available

---

## 🌐 Deployment Options

### Option 1: Render.com (Recommended - Free Tier Available)
### Option 2: Vercel + Railway
### Option 3: Heroku
### Option 4: AWS/DigitalOcean/VPS
### Option 5: Docker Deployment

---

## 🎯 Option 1: Deploy to Render.com (Recommended)

### Why Render.com?
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Easy deployment
- ✅ Blueprint support (render.yaml)
- ✅ Auto-deploy from GitHub
- ✅ Built-in monitoring

### Step-by-Step Guide

#### 1. Prepare Your Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "feat: Production ready deployment"
git push origin main
```

#### 2. Set Up MongoDB Atlas

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Free" tier (M0)
   - Select region closest to your users
   - Click "Create Cluster"

3. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

4. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and strong password
   - Set role to "Read and write to any database"
   - Click "Add User"

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with `proxymukt`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/proxymukt?retryWrites=true&w=majority
```

#### 3. Deploy to Render

1. **Create Render Account**
   - Go to [Render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Blueprint**
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will detect `render.yaml`
   - Click "Apply"

3. **Configure Environment Variables**

For **Backend Service** (proxymukt-api):
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/proxymukt
JWT_ACCESS_SECRET=your-super-secret-jwt-access-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key-min-32-chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
QR_SECRET=your-qr-secret-key-min-32-chars
QR_ROTATION_INTERVAL=20000
CLIENT_URL=https://your-frontend-url.onrender.com

# Optional: Zoom Integration
ZOOM_ACCOUNT_ID=your_zoom_account_id
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret

# Optional: Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

For **Frontend Service** (proxymukt-frontend):
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

4. **Deploy**
   - Render will automatically build and deploy
   - Wait for both services to be live (5-10 minutes)
   - Check logs for any errors

5. **Seed Production Database**

```bash
# SSH into backend service or use Render Shell
cd server
npm run seed
```

Or use the API endpoint:
```bash
curl -X POST https://your-backend-url.onrender.com/api/seed
```

6. **Test Deployment**
   - Visit your frontend URL
   - Try logging in with admin credentials
   - Create a test session
   - Mark attendance
   - Verify real-time updates work

#### 4. Custom Domain (Optional)

1. **Add Custom Domain in Render**
   - Go to your frontend service
   - Click "Settings" → "Custom Domain"
   - Add your domain (e.g., proxymukt.yourdomain.com)

2. **Configure DNS**
   - Add CNAME record in your DNS provider
   - Point to Render's URL
   - Wait for DNS propagation (5-30 minutes)

3. **Update Environment Variables**
   - Update `CLIENT_URL` in backend
   - Update `VITE_API_URL` in frontend

---

## 🎯 Option 2: Vercel (Frontend) + Railway (Backend)

### Deploy Frontend to Vercel

```bash
cd client
npm run build

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables
5. Deploy

---

## 🎯 Option 3: Heroku

### Deploy Backend

```bash
cd server

# Login to Heroku
heroku login

# Create app
heroku create proxymukt-api

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_ACCESS_SECRET=your-secret
heroku config:set JWT_REFRESH_SECRET=your-secret
heroku config:set QR_SECRET=your-secret
heroku config:set CLIENT_URL=https://your-frontend.vercel.app

# Deploy
git push heroku main

# Seed database
heroku run npm run seed
```

### Deploy Frontend to Vercel

```bash
cd client
vercel --prod
```

---

## 🎯 Option 4: Docker Deployment

### Create Dockerfile for Backend

```dockerfile
# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Create Dockerfile for Frontend

```dockerfile
# client/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:password@mongodb:27017/proxymukt?authSource=admin
      JWT_ACCESS_SECRET: your-secret
      JWT_REFRESH_SECRET: your-secret
      QR_SECRET: your-secret
      CLIENT_URL: http://localhost:3000
    depends_on:
      - mongodb

  frontend:
    build: ./client
    ports:
      - "3000:80"
    environment:
      VITE_API_URL: http://localhost:5000/api
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### Deploy with Docker

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🎯 Option 5: VPS Deployment (DigitalOcean/AWS/Linode)

### 1. Set Up Server

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod

# Install Nginx
apt install -y nginx

# Install PM2
npm install -g pm2
```

### 2. Deploy Application

```bash
# Clone repository
cd /var/www
git clone https://github.com/YOUR_USERNAME/ProxyMukt-Attendance-System.git
cd ProxyMukt-Attendance-System

# Install backend dependencies
cd server
npm install --production
cp .env.example .env
# Edit .env with production values
nano .env

# Seed database
npm run seed

# Start backend with PM2
pm2 start src/server.js --name proxymukt-api
pm2 save
pm2 startup

# Install frontend dependencies
cd ../client
npm install
npm run build
```

### 3. Configure Nginx

```nginx
# /etc/nginx/sites-available/proxymukt
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/ProxyMukt-Attendance-System/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/proxymukt /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 4. Set Up SSL with Let's Encrypt

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your-domain.com

# Auto-renewal
certbot renew --dry-run
```

---

## 🔒 Post-Deployment Security

### 1. Change Default Credentials

```bash
# Login to your app
# Go to Admin Dashboard
# Change admin password
# Create new admin users if needed
```

### 2. Enable Firewall

```bash
# Ubuntu/Debian
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

### 3. Set Up Monitoring

```bash
# Install monitoring tools
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Set up alerts
pm2 install pm2-slack
```

### 4. Regular Backups

```bash
# MongoDB backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --out /backups/mongodb_$DATE
find /backups -type d -mtime +7 -exec rm -rf {} +
```

---

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Backend health
curl https://your-api-url.com/api/health

# Database health
mongosh --eval "db.adminCommand('ping')"

# PM2 status
pm2 status
pm2 logs
```

### Performance Monitoring

1. **Set up monitoring tools:**
   - New Relic
   - Datadog
   - PM2 Plus

2. **Monitor metrics:**
   - Response times
   - Error rates
   - CPU/Memory usage
   - Database performance

### Regular Maintenance

```bash
# Update dependencies
npm update

# Clear logs
pm2 flush

# Restart services
pm2 restart all

# Database maintenance
mongosh
use proxymukt
db.runCommand({compact: 'sessions'})
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed
```bash
# Check MongoDB status
systemctl status mongod

# Check connection string
echo $MONGODB_URI

# Test connection
mongosh "your-connection-string"
```

#### 2. Frontend Can't Connect to Backend
```bash
# Check CORS settings
# Verify CLIENT_URL in backend .env
# Check VITE_API_URL in frontend .env
```

#### 3. Socket.IO Not Working
```bash
# Check WebSocket support
# Verify proxy configuration
# Check firewall rules
```

#### 4. High Memory Usage
```bash
# Check PM2 logs
pm2 logs

# Restart services
pm2 restart all

# Increase memory limit
pm2 start server.js --max-memory-restart 500M
```

---

## ✅ Deployment Verification

### Test Checklist

- [ ] Frontend loads without errors
- [ ] Can login with admin credentials
- [ ] Can create classes
- [ ] Can start sessions
- [ ] QR code rotates every 20 seconds
- [ ] Can mark attendance
- [ ] Real-time updates work
- [ ] Verification toggles work
- [ ] Analytics load correctly
- [ ] Email notifications work (if configured)
- [ ] Zoom integration works (if configured)
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] No console errors

---

## 📞 Support

For deployment issues:
- 📧 Email: sameermahato793@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/SameerMahato/ProxyMukt---Automated-Student-Attendance-System/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/SameerMahato/ProxyMukt---Automated-Student-Attendance-System/discussions)

---

**Congratulations on deploying ProxyMukt! 🎉**

**Your attendance system is now live and ready to eliminate proxy attendance!**
