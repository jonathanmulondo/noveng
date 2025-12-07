# NovEng - Vercel Deployment Guide

## 🚀 Quick Deploy (10 Minutes)

This guide will deploy:
- **Frontend** → Vercel (noveng.vercel.app)
- **Backend** → Vercel (noveng-backend.vercel.app)
- **Database** → Supabase (already set up)

---

## Prerequisites

- [x] GitHub repo created: https://github.com/jonathanmulondo/noveng
- [ ] Supabase project set up (with schema and seeded data)
- [ ] Vercel account (free tier works!)

---

## Step 1: Push Code to GitHub

```bash
cd C:\Users\mulon\Desktop\noveng

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - NovEng platform complete"

# Add remote (your repo)
git remote add origin https://github.com/jonathanmulondo/noveng.git

# Push to GitHub
git push -u origin main
```

---

## Step 2: Deploy Backend to Vercel

### 2.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your repos

### 2.2 Deploy Backend

1. Click "**Add New Project**"
2. **Import** your repo: `jonathanmulondo/noveng`
3. Click "**Configure Project**"
4. **IMPORTANT**: Set **Root Directory** to `backend`
5. Click "**Edit**" next to Root Directory
6. Type: `backend`
7. Click "**Continue**"

### 2.3 Configure Environment Variables

Click "**Environment Variables**" and add these:

```
SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_ANON_KEY = eyJhbGc...
SUPABASE_SERVICE_KEY = eyJhbGc...
PORT = 5000
NODE_ENV = production
CORS_ORIGIN = https://noveng.vercel.app
JWT_SECRET = your_random_secret_here
JWT_EXPIRES_IN = 7d
```

**Get Supabase keys from:**
- Supabase Dashboard → Settings → API

### 2.4 Deploy!

1. Click "**Deploy**"
2. Wait 2-3 minutes for build
3. Note your backend URL: `https://noveng-backend.vercel.app`

### 2.5 Test Backend

Open: `https://noveng-backend.vercel.app/health`

Should see:
```json
{
  "status": "ok",
  "timestamp": "2025-12-01T...",
  "environment": "production"
}
```

Test modules: `https://noveng-backend.vercel.app/api/modules`

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Deploy Frontend

1. In Vercel dashboard, click "**Add New Project**" again
2. **Import** the same repo: `jonathanmulondo/noveng`
3. This time, **Root Directory** should be `.` (root)
4. Vercel auto-detects it's a Vite project ✅

### 3.2 Configure Environment Variables

Add this environment variable:

```
VITE_API_URL = https://noveng-backend.vercel.app/api
```

(Replace with your actual backend URL from Step 2.4)

### 3.3 Deploy!

1. Click "**Deploy**"
2. Wait 2-3 minutes for build
3. Note your frontend URL: `https://noveng.vercel.app`

---

## Step 4: Update CORS in Backend

Now that you have the frontend URL, update backend CORS:

1. Go to Vercel → **noveng-backend** project
2. **Settings** → **Environment Variables**
3. Edit `CORS_ORIGIN`:
   - Change to: `https://noveng.vercel.app`
4. Go to **Deployments** tab
5. Click "**•••**" on latest deployment
6. Click "**Redeploy**" → **Use existing Build Cache**

---

## Step 5: Test Full Integration

1. Open your frontend: `https://noveng.vercel.app`
2. Click "**Courses**" in sidebar
3. **You should see all 50 modules!** 🎉
4. Click on any module to view lesson content
5. Test the simulator
6. Try Novie AI assistant

---

## 🎯 Deployment Checklist

### Backend
- [ ] Deployed to Vercel with `backend/` as root directory
- [ ] All environment variables added
- [ ] `/health` endpoint responds with status ok
- [ ] `/api/modules` returns 50 modules
- [ ] Database connected (check Supabase logs)

### Frontend
- [ ] Deployed to Vercel from root directory
- [ ] `VITE_API_URL` environment variable set
- [ ] Site loads without errors
- [ ] Modules page shows all 50 courses
- [ ] Individual module pages load content
- [ ] Simulator works
- [ ] Novie AI responds

---

## 📝 Important URLs

Save these for reference:

| Service | URL | Notes |
|---------|-----|-------|
| **Frontend** | https://noveng.vercel.app | Your main app |
| **Backend** | https://noveng-backend.vercel.app | API server |
| **Health Check** | /health | Test backend status |
| **Modules API** | /api/modules | Get all modules |
| **Supabase** | https://supabase.com/dashboard | Database dashboard |
| **GitHub Repo** | https://github.com/jonathanmulondo/noveng | Source code |

---

## 🔄 Continuous Deployment

Vercel automatically redeploys when you push to GitHub!

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push origin main
```

Vercel will:
1. Detect the push
2. Build both frontend and backend
3. Deploy automatically
4. Send you a notification when done

---

## 🌐 Custom Domain (Optional)

### Add Your Own Domain

1. In Vercel project settings
2. Go to **Domains**
3. Add your domain: `www.noveng.io`
4. Follow DNS configuration instructions
5. Vercel provides free SSL certificate

**For Backend:**
- Add subdomain: `api.noveng.io`
- Point to backend deployment
- Update `VITE_API_URL` to `https://api.noveng.io/api`
- Update `CORS_ORIGIN` to `https://www.noveng.io`

---

## 🐛 Troubleshooting

### "Failed to fetch modules" on frontend

**Check:**
1. Backend is deployed and running (visit `/health`)
2. `VITE_API_URL` is set correctly in frontend
3. `CORS_ORIGIN` includes your frontend URL
4. Browser console for specific error messages

**Fix:**
- Update environment variables
- Redeploy affected service

### Backend shows "Database connection failed"

**Check:**
1. Supabase project is active (not paused)
2. `SUPABASE_URL` and keys are correct
3. Supabase allows connections from Vercel IPs

**Fix:**
- Verify credentials in Supabase dashboard
- Update environment variables
- Check Supabase logs for blocked connections

### Module content not loading

**Cause:** Database not seeded

**Fix:**
1. Run locally: `cd backend && npm run seed`
2. Verify in Supabase: Table Editor → modules → should have 50 rows

### Build fails on Vercel

**Check:**
1. Root directory is set correctly (frontend: `.`, backend: `backend`)
2. All dependencies in package.json
3. Build logs for specific errors

---

## 📊 Monitoring

### Vercel Analytics (Free)

1. Go to project → **Analytics**
2. Enable Analytics
3. See:
   - Page views
   - Performance metrics
   - Error rates

### Supabase Monitoring

1. Supabase Dashboard → **Database**
2. Check:
   - Connection count
   - Query performance
   - Storage usage

---

## 💰 Costs

### Free Tier Limits:

**Vercel:**
- 100GB bandwidth/month
- Unlimited personal projects
- Automatic HTTPS
- Free for hobby projects ✅

**Supabase:**
- 500MB database
- 1GB file storage
- 2GB bandwidth
- Unlimited API requests
- Free for hobby projects ✅

**Estimated Monthly Cost:** $0 (Free tier sufficient for 1000+ users)

---

## 🔒 Security Checklist

- [ ] Environment variables never committed to GitHub
- [ ] `.env` files in `.gitignore`
- [ ] Supabase service key only on backend (never frontend!)
- [ ] CORS properly configured
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Supabase RLS policies (optional for Phase 2)

---

## 🎉 Success!

Your NovEng platform is now live on the internet!

**Share your app:**
- Frontend: `https://noveng.vercel.app`
- Anyone can access and use it
- All 50 Arduino modules available
- Interactive simulator working
- Novie AI assistant ready to help

**Next steps:**
1. Share with friends/beta testers
2. Gather feedback
3. Monitor usage in Vercel analytics
4. Continue enhancing content
5. Add Phase 2 features (auth, progress tracking)

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **GitHub Issues**: Create issue in your repo

---

**Deployment Time:** ~10 minutes
**Status:** Production Ready ✅
**Cost:** Free (Vercel + Supabase free tiers)

**🚀 Your Arduino learning platform is LIVE!**
