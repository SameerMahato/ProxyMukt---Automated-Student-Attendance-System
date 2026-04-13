# 🚀 Vercel Deployment Fix Guide

**Project:** ProxyMukt Smart Attendance System  
**Issue:** Deployment Error on Vercel  
**Status:** ✅ Fixed

---

## 🐛 Error Analysis

**Error Message:**
```
There was an error deploying proxy-mukt-automated-student-attendance-system 
to the production environment on sameermahato's projects.
```

### Common Causes:
1. ❌ Missing or incorrect build configuration
2. ❌ Missing environment variables
3. ❌ Build command errors
4. ❌ Incorrect root directory
5. ❌ Node version mismatch
6. ❌ Missing dependencies

---

## ✅ Solution Steps

### Step 1: Update Vercel Configuration

The `vercel.json` file has been updated with proper build settings.

**Location:** `client/vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 2: Set Environment Variables on Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_API_URL` | Your backend API URL | Production, Preview, Development |

**Example Values:**
- Production: `https://your-backend-api.com/api`
- Development: `http://localhost:5000/api`

### Step 3: Configure Project Settings on Vercel

#### Root Directory:
- Set to: `client`

#### Build & Development Settings:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Development Command:** `npm run dev`

#### Node.js Version:
- **Recommended:** 18.x or 20.x

---

## 📋 Deployment Checklist

### Before Deploying:

- [ ] **Environment Variables Set**
  - `VITE_API_URL` configured on Vercel

- [ ] **Root Directory Configured**
  - Set to `client` in Vercel project settings

- [ ] **Build Command Verified**
  - Test locally: `cd client && npm run build`

- [ ] **Dependencies Installed**
  - No missing packages in `package.json`

- [ ] **Git Repository Updated**
  - All changes committed and pushed

- [ ] **Backend API Deployed**
  - Backend must be deployed first
  - API URL must be accessible

---

## 🔧 Manual Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. **Login to Vercel**
   - Go to https://vercel.com
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New" → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add `VITE_API_URL` with your backend URL
   - Select all environments (Production, Preview, Development)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to client directory
cd client

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No (first time) / Yes (subsequent)
# - What's your project's name? proxy-mukt-attendance-system
# - In which directory is your code located? ./
# - Want to override settings? Yes
# - Build Command: npm run build
# - Output Directory: dist
# - Development Command: npm run dev

# Deploy to production
vercel --prod
```

---

## 🐛 Troubleshooting

### Issue 1: Build Fails with "Command not found"

**Solution:**
```bash
# Ensure package.json has correct scripts
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Issue 2: "VITE_API_URL is not defined"

**Solution:**
- Add environment variable on Vercel dashboard
- Ensure it starts with `VITE_` prefix
- Redeploy after adding

### Issue 3: 404 on Page Refresh

**Solution:**
- Ensure `vercel.json` has rewrites configuration
- All routes should redirect to `/index.html`

### Issue 4: Build Succeeds but App Shows Blank Page

**Solution:**
- Check browser console for errors
- Verify API URL is correct
- Check if backend is accessible
- Ensure all assets are loading

### Issue 5: "Cannot find module" Error

**Solution:**
```bash
# Clear node_modules and reinstall
cd client
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 🔍 Verify Deployment

### After Deployment:

1. **Check Build Logs**
   - Go to Vercel dashboard
   - Click on your deployment
   - Check "Building" logs for errors

2. **Test the Application**
   - Visit your deployment URL
   - Test login functionality
   - Check if API calls work
   - Test navigation between pages

3. **Check Browser Console**
   - Open DevTools (F12)
   - Look for any errors
   - Verify API calls are successful

---

## 📊 Expected Build Output

```
✓ building client + server bundles...
✓ 1234 modules transformed.
dist/index.html                   0.45 kB │ gzip:  0.30 kB
dist/assets/index-abc123.css     12.34 kB │ gzip:  3.45 kB
dist/assets/index-def456.js     234.56 kB │ gzip: 78.90 kB

✓ built in 12.34s
```

---

## 🌐 Backend Deployment

**Important:** Deploy backend first before frontend!

### Recommended Platforms:
1. **Render.com** (Recommended)
2. **Railway.app**
3. **Heroku**
4. **Your own VPS**

### Backend Environment Variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
CLIENT_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

---

## 📝 Post-Deployment Configuration

### Update Frontend Environment Variable:

After backend is deployed, update `VITE_API_URL`:

```
VITE_API_URL=https://your-backend-api.com/api
```

### Update Backend CORS:

Ensure backend allows your Vercel domain:

```javascript
// server/src/server.js
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://your-app.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
};
```

---

## 🎯 Quick Fix Commands

### If deployment fails, try these:

```bash
# 1. Clear Vercel cache
vercel --force

# 2. Rebuild locally first
cd client
npm run build

# 3. Check for errors
npm run build 2>&1 | tee build.log

# 4. Verify environment variables
vercel env ls

# 5. Pull environment variables locally
vercel env pull

# 6. Redeploy
vercel --prod
```

---

## 📞 Support Resources

### Vercel Documentation:
- https://vercel.com/docs
- https://vercel.com/docs/frameworks/vite

### Common Issues:
- https://vercel.com/docs/errors

### Community:
- Vercel Discord: https://vercel.com/discord
- GitHub Issues: https://github.com/vercel/vercel/issues

---

## ✅ Success Indicators

Your deployment is successful when:

- ✅ Build completes without errors
- ✅ Deployment URL is accessible
- ✅ Login page loads correctly
- ✅ API calls work (check Network tab)
- ✅ Navigation works on all pages
- ✅ No console errors
- ✅ Assets load properly

---

## 🔄 Continuous Deployment

Once configured, Vercel will automatically deploy:

- **Production:** When you push to `master` branch
- **Preview:** When you create a pull request
- **Development:** When you push to other branches

---

## 📈 Monitoring

### After Deployment:

1. **Analytics**
   - Enable Vercel Analytics
   - Monitor page views and performance

2. **Error Tracking**
   - Check Vercel logs for errors
   - Set up error notifications

3. **Performance**
   - Use Lighthouse to check performance
   - Optimize based on metrics

---

## 🎉 Deployment Complete!

Your application should now be live at:
- **Production:** `https://your-app.vercel.app`
- **Custom Domain:** Configure in Vercel settings

---

**Author:** Sameer Mahato  
**Email:** sameermahato793@gmail.com  
**Repository:** https://github.com/SameerMahato/ProxyMukt---Automated-Student-Attendance-System

**Last Updated:** April 13, 2026
