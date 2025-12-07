# NovEng - Quick Start (5 Minutes!)

## Prerequisites
- [ ] Node.js 18+ installed
- [ ] Supabase account created at https://supabase.com

---

## Step 1: Supabase Setup (3 minutes)

### Create Project
1. Go to https://supabase.com → New Project
2. Name: `noveng`, Password: (save it!), Region: (your choice)
3. Wait 2 minutes for setup

### Run Schema
1. Supabase Dashboard → SQL Editor → New query
2. Copy/paste ALL of: `backend/src/scripts/schema.sql`
3. Click RUN ✅

### Get Keys
1. Settings → API
2. Copy these 3 values:
   - Project URL
   - `anon` `public` key
   - `service_role` key (click Reveal)

### Update .env
Edit `backend/.env`:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...  (your anon key)
SUPABASE_SERVICE_KEY=eyJhbGc...  (your service key)
```

---

## Step 2: Seed & Start (2 minutes)

Open terminal and run:

```bash
# Seed database with 50 modules
cd backend
npm run seed

# Start backend server
npm run dev
```

Keep this terminal open ✅

---

## Step 3: Start Frontend

Open a NEW terminal:

```bash
# Start frontend (from project root)
npm run dev
```

---

## ✅ Done!

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

Click "Courses" to see all 50 modules loaded from database!

---

## If Something Breaks:

1. **Backend won't start**: Check Supabase keys in `backend/.env`
2. **Seeding fails**: Make sure you're in `backend/` folder
3. **No modules showing**: Check browser console for errors

Run `npm run seed` again if needed - it's safe to re-run.
