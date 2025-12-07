# Environment Variables Reference

Quick copy-paste reference for Vercel deployment.

---

## 🔐 Backend Environment Variables

Add these in Vercel → noveng-backend → Settings → Environment Variables:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://noveng.vercel.app
JWT_SECRET=noveng_production_secret_2025_change_this
JWT_EXPIRES_IN=7d
```

### Where to Get Values:

| Variable | Where to Find |
|----------|---------------|
| `SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → Project API keys → anon public |
| `SUPABASE_SERVICE_KEY` | Supabase Dashboard → Settings → API → Project API keys → service_role (click Reveal) |
| `CORS_ORIGIN` | Your frontend Vercel URL (after frontend deployed) |
| `JWT_SECRET` | Generate random string (or use the default above) |

---

## 🎨 Frontend Environment Variables

Add this in Vercel → noveng (frontend) → Settings → Environment Variables:

```env
VITE_API_URL=https://noveng-backend.vercel.app/api
```

### Where to Get Values:

| Variable | Where to Find |
|----------|---------------|
| `VITE_API_URL` | Your backend Vercel URL + `/api` (after backend deployed) |

---

## 📋 Deployment Order

1. **Deploy Backend First** → Get backend URL
2. **Deploy Frontend Second** → Use backend URL in `VITE_API_URL`
3. **Update Backend CORS** → Use frontend URL in `CORS_ORIGIN`
4. **Redeploy Backend** → Apply CORS change

---

## 🔄 After Deployment Updates

### If you change frontend URL:
1. Update `CORS_ORIGIN` in backend
2. Redeploy backend

### If you change backend URL:
1. Update `VITE_API_URL` in frontend
2. Redeploy frontend

---

## ✅ Quick Checklist

Backend deployed with:
- [ ] All 7 environment variables set
- [ ] Supabase credentials correct
- [ ] CORS_ORIGIN matches frontend URL

Frontend deployed with:
- [ ] VITE_API_URL set to backend URL
- [ ] Build succeeds
- [ ] Can access deployed site

Integration working:
- [ ] Backend /health returns 200
- [ ] Backend /api/modules returns data
- [ ] Frontend loads modules from backend
- [ ] No CORS errors in browser console

---

## 🆘 Quick Fixes

**CORS Error:**
```
Update CORS_ORIGIN in backend to match frontend URL exactly
(include https://, no trailing slash)
```

**Modules not loading:**
```
1. Check VITE_API_URL in frontend
2. Check backend is accessible
3. Run seed script if database empty
```

**Database connection error:**
```
1. Verify Supabase project is active
2. Check SUPABASE_URL format: https://xxx.supabase.co
3. Ensure using service_role key for backend (not anon key)
```

---

**GitHub Repo:** https://github.com/jonathanmulondo/noveng
**Contact:** jonathanmulondoj@gmail.com
