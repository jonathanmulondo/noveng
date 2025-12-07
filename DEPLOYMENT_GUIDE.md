# NovEng Platform - Complete Deployment Guide

## 📋 Overview

This guide walks you through deploying the complete NovEng Arduino Learning Platform:
- Frontend (React/Vite) → Vercel/Netlify
- Backend (Node.js/Express) → Vercel/Railway
- Database (PostgreSQL) → Supabase

**Estimated Time**: 30-45 minutes

---

## 🎯 Prerequisites

- [ ] GitHub account
- [ ] Supabase account (free tier)
- [ ] Vercel account (free tier) OR Railway account
- [ ] Git installed locally
- [ ] Node.js 18+ installed

---

## Phase 1: Database Setup (Supabase)

### Step 1.1: Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Fill in:
   - **Name**: noveng-db
   - **Database Password**: Generate strong password (save this!)
   - **Region**: Choose closest to your users
6. Click "Create new project"
7. Wait 2-3 minutes for provisioning

### Step 1.2: Run Database Schema

1. In Supabase dashboard, click **SQL Editor**
2. Click "New query"
3. Copy entire contents of `backend/src/scripts/schema.sql`
4. Paste into SQL editor
5. Click "Run" (bottom right)
6. Verify: Should see "Success. No rows returned"

### Step 1.3: Get API Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values (you'll need them later):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (starts with eyJ)
   - **service_role key**: `eyJhbGc...` (different from anon key)

---

## Phase 2: Backend Deployment

### Option A: Deploy to Vercel (Recommended)

#### Step 2A.1: Prepare Backend

1. Create `vercel.json` in backend folder:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

2. Update `backend/package.json` scripts:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "build": "echo 'No build needed'",
    "vercel-build": "echo 'Ready for deployment'"
  }
}
```

#### Step 2A.2: Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to backend:
```bash
cd backend
```

3. Login to Vercel:
```bash
vercel login
```

4. Deploy:
```bash
vercel
```

5. Follow prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? **noveng-backend**
   - In which directory is your code located? **./**
   - Want to override settings? **N**

6. Note the deployment URL: `https://noveng-backend.vercel.app`

#### Step 2A.3: Add Environment Variables

1. Go to https://vercel.com/dashboard
2. Select **noveng-backend** project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:

```
SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_ANON_KEY = eyJhbGc...
SUPABASE_SERVICE_KEY = eyJhbGc...
PORT = 5000
NODE_ENV = production
CORS_ORIGIN = https://your-frontend-domain.vercel.app
JWT_SECRET = generate_random_string_here
```

5. Click "Save"
6. Redeploy:
```bash
vercel --prod
```

### Option B: Deploy to Railway

#### Step 2B.1: Create Railway Project

1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway with GitHub
5. Select your NovEng repository
6. Choose "backend" as root directory

#### Step 2B.2: Configure Environment

1. In Railway dashboard, click **Variables**
2. Add all environment variables from `.env.example`
3. Set `PORT` to `${{PORT}}` (Railway's dynamic port)

#### Step 2B.3: Deploy

1. Railway auto-deploys on push
2. Get deployment URL from **Settings** → **Domains**
3. Note: `https://noveng-backend.up.railway.app`

---

## Phase 3: Seed Database with Curriculum

### Step 3.1: Install Dependencies Locally

```bash
cd backend
npm install
```

### Step 3.2: Configure Local Environment

1. Create `.env` file in backend folder:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
```

### Step 3.3: Run Seeding Script

```bash
npm run seed
```

**Expected Output:**
```
╔═══════════════════════════════════════════════════════════╗
║     📚 NOVENG CURRICULUM DATABASE SEEDING                 ║
╚═══════════════════════════════════════════════════════════╝

📖 Loading 50 modules from curriculum...

✓ Inserted: Module 1 - Introduction to Arduino & IDE
✓ Inserted: Module 2 - Blinking an LED
...
✓ Inserted: Module 50 - Complete Capstone Project

╔═══════════════════════════════════════════════════════════╗
║     ✅ CURRICULUM SEEDING COMPLETE!                        ║
╠═══════════════════════════════════════════════════════════╣
║  Inserted:  50                                            ║
║  Updated:   0                                             ║
║  Errors:    0                                             ║
║  Total:     50                                            ║
╚═══════════════════════════════════════════════════════════╝
```

### Step 3.4: Verify in Supabase

1. Go to Supabase dashboard
2. Click **Table Editor**
3. Select `modules` table
4. Should see 50 rows

---

## Phase 4: Frontend Deployment

### Step 4.1: Update Frontend API Configuration

1. Create/update `src/config/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://noveng-backend.vercel.app/api';

export const API_ENDPOINTS = {
  modules: `${API_BASE_URL}/modules`,
  auth: `${API_BASE_URL}/auth`,
  progress: `${API_BASE_URL}/progress`,
  feed: `${API_BASE_URL}/feed`,
};
```

2. Update `vite.config.ts` to use backend API:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

### Step 4.2: Create Production Build

1. Create `.env.production` in root:

```env
VITE_API_URL=https://noveng-backend.vercel.app/api
```

2. Test build locally:

```bash
npm run build
npm run preview
```

### Step 4.3: Deploy Frontend to Vercel

1. Navigate to project root:
```bash
cd ..
```

2. Deploy frontend:
```bash
vercel
```

3. Follow prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? **noveng**
   - In which directory is your code located? **./**
   - Want to override settings? **N**

4. Add environment variable in Vercel:
   - Go to project settings
   - Add `VITE_API_URL` = `https://noveng-backend.vercel.app/api`

5. Deploy to production:
```bash
vercel --prod
```

6. Note frontend URL: `https://noveng.vercel.app`

### Step 4.4: Update Backend CORS

1. Go to backend Vercel project
2. Update `CORS_ORIGIN` environment variable:
   - Set to your frontend URL: `https://noveng.vercel.app`
3. Redeploy backend

---

## Phase 5: Integration & Testing

### Step 5.1: Test API Endpoints

1. Open browser to: `https://noveng-backend.vercel.app/health`
2. Should see:
```json
{
  "status": "ok",
  "timestamp": "2025-12-01T...",
  "environment": "production"
}
```

3. Test modules endpoint: `https://noveng-backend.vercel.app/api/modules`
4. Should return all 50 modules

### Step 5.2: Test Frontend Integration

1. Open: `https://noveng.vercel.app`
2. Navigate to "Courses" page
3. Verify all 50 modules display
4. Click on a module
5. Verify lesson content loads

### Step 5.3: Check Database Connections

1. In Supabase, go to **Database** → **Logs**
2. Should see query activity from backend
3. Check for any errors

---

## Phase 6: Domain Configuration (Optional)

### Step 6.1: Add Custom Domain to Frontend

1. In Vercel project settings
2. Go to **Domains**
3. Add your domain: `www.noveng.io`
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic)

### Step 6.2: Add Custom Domain to Backend

1. Add subdomain: `api.noveng.io`
2. Update frontend `VITE_API_URL` to `https://api.noveng.io/api`
3. Update backend `CORS_ORIGIN` to `https://www.noveng.io`

---

## 🔧 Post-Deployment Configuration

### Enable Supabase RLS (Row Level Security)

For production security, enable RLS on tables:

```sql
-- In Supabase SQL Editor
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### Set Up Monitoring

1. **Vercel**:
   - Go to **Analytics** → Enable
   - Set up error tracking

2. **Supabase**:
   - Enable **Database Logs**
   - Set up alerts for errors

---

## 🚀 Continuous Deployment

### Automatic Deployments

Both Vercel and Railway support automatic deployments:

1. Push to GitHub `main` branch:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

2. Vercel automatically builds and deploys
3. Check deployment status in dashboard

### Preview Deployments

1. Create feature branch:
```bash
git checkout -b feature/new-feature
```

2. Push to GitHub:
```bash
git push origin feature/new-feature
```

3. Vercel creates preview URL automatically
4. Test before merging to main

---

## 📊 Monitoring & Maintenance

### Daily Checks
- [ ] Check Vercel deployment status
- [ ] Review error logs
- [ ] Monitor database usage

### Weekly Tasks
- [ ] Review Supabase database size
- [ ] Check API response times
- [ ] Update curriculum content if needed

### Monthly Tasks
- [ ] Review and rotate API keys
- [ ] Update dependencies
- [ ] Backup database
- [ ] Review analytics

---

## 🐛 Troubleshooting

### Frontend Shows "Failed to fetch modules"

**Cause**: CORS or API URL misconfiguration

**Solution**:
1. Check `VITE_API_URL` in frontend env vars
2. Verify `CORS_ORIGIN` in backend env vars
3. Check network tab for actual error
4. Verify backend is running: visit `/health` endpoint

### Database Connection Errors

**Cause**: Invalid Supabase credentials

**Solution**:
1. Regenerate keys in Supabase dashboard
2. Update env vars in backend
3. Redeploy backend

### Seeding Script Fails

**Cause**: Missing curriculum files or permissions

**Solution**:
1. Verify `curriculum/` folder exists with all 50 modules
2. Check `SUPABASE_SERVICE_KEY` is set (not anon key)
3. Ensure service role has write permissions

### Module Content Not Loading

**Cause**: Content not seeded or malformed markdown

**Solution**:
1. Re-run `npm run seed`
2. Check Supabase `modules` table for `lesson_content`
3. Verify markdown is valid

---

## 📈 Scaling Considerations

### When to Upgrade

- **Free Tier Limits**:
  - Supabase: 500MB database, 2GB bandwidth
  - Vercel: 100GB bandwidth, 6000 build minutes
  - Railway: 500 execution hours

- **Upgrade Triggers**:
  - > 10,000 active users
  - > 1GB database size
  - Slow API response times

### Optimization Tips

1. **Enable Caching**:
   - Add Redis for frequent queries
   - Cache module list for 1 hour

2. **CDN for Media**:
   - Use Cloudinary for thumbnails
   - Serve videos from Vimeo/YouTube

3. **Database Indexes**:
   - Already included in schema
   - Monitor slow queries in Supabase

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] All 50 modules created and tested
- [ ] Environment variables documented
- [ ] Database schema reviewed
- [ ] API endpoints tested locally
- [ ] Frontend builds without errors

### Database Setup
- [ ] Supabase project created
- [ ] Schema executed successfully
- [ ] API keys copied and secured
- [ ] Test connection successful

### Backend Deployment
- [ ] Backend deployed to Vercel/Railway
- [ ] Environment variables configured
- [ ] Health check endpoint responds
- [ ] Curriculum seeded successfully

### Frontend Deployment
- [ ] Frontend deployed to Vercel
- [ ] API URL configured
- [ ] CORS configured in backend
- [ ] All pages load correctly

### Post-Deployment
- [ ] Custom domains configured (if applicable)
- [ ] SSL certificates active
- [ ] Monitoring enabled
- [ ] Backup strategy implemented

---

## 🎉 Success!

Your NovEng Platform is now live!

**Next Steps**:
1. Share with beta testers
2. Gather feedback
3. Monitor usage and performance
4. Iterate on content quality
5. Plan Phase 2 features

---

## 📞 Support

- **Documentation**: See README files in each folder
- **Issues**: GitHub Issues
- **Community**: Discord (TBD)

**Deployment completed!** 🚀

---

**Last Updated**: December 2025
**Version**: 1.0.0 (Phase 1)
