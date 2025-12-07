# NovEng Quick Setup Guide

Follow these steps to get your app running in 10 minutes!

---

## Step 1: Set Up Supabase (5 minutes)

### 1.1 Create Supabase Project
1. Go to https://supabase.com
2. Click "Start your project" → Sign in with GitHub
3. Click "New Project"
4. Fill in:
   - **Name**: `noveng`
   - **Database Password**: Generate and SAVE IT!
   - **Region**: Choose closest region
5. Click "Create new project"
6. **Wait 2-3 minutes** for setup to complete

### 1.2 Run Database Schema
1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click "+ New query"
3. Open the file: `backend/src/scripts/schema.sql`
4. Copy ALL contents (Ctrl+A, Ctrl+C)
5. Paste into Supabase SQL editor
6. Click **Run** (or press Ctrl+Enter)
7. Should see: "Success. No rows returned"

### 1.3 Get API Keys
1. In Supabase, go to **Settings** → **API** (gear icon on left)
2. You'll see:
   - **Project URL**: Copy this
   - **Project API keys**:
     - `anon` `public` key: Copy this
     - `service_role` key: Click "Reveal" then copy

### 1.4 Update Backend .env File
1. Open `backend/.env` in your editor
2. Replace these three lines with your values:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdX...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdX...
```
3. Save the file

---

## Step 2: Seed Database with Curriculum (2 minutes)

Run this command in your terminal:

```bash
cd backend
npm run seed
```

**Expected output:**
```
╔═══════════════════════════════════════════════════════════╗
║     📚 NOVENG CURRICULUM DATABASE SEEDING                 ║
╚═══════════════════════════════════════════════════════════╝

✓ Inserted: Module 1 - Introduction to Arduino & IDE
✓ Inserted: Module 2 - Blinking an LED
...
✓ Inserted: Module 50 - Complete Capstone Project

✅ CURRICULUM SEEDING COMPLETE!
```

---

## Step 3: Start Backend Server (1 minute)

```bash
npm run dev
```

**Expected output:**
```
╔═══════════════════════════════════════════════════════════╗
║          🚀 NovEng Backend Server Running!                ║
╠═══════════════════════════════════════════════════════════╣
║  Port:        5000                                        ║
║  Environment: development                                 ║
║  Database:    ✓ Connected                                 ║
╚═══════════════════════════════════════════════════════════╝
```

**Test it**: Open browser to http://localhost:5000/health

Should see: `{"status":"ok","timestamp":"...","environment":"development"}`

---

## Step 4: Update Frontend to Use Backend API (2 minutes)

### 4.1 Create API Configuration

Create file: `src/services/api.ts`

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Fetch all modules
  async getModules() {
    const response = await fetch(`${API_BASE_URL}/modules`);
    if (!response.ok) throw new Error('Failed to fetch modules');
    const data = await response.json();
    return data.modules;
  },

  // Fetch single module
  async getModule(slug: string) {
    const response = await fetch(`${API_BASE_URL}/modules/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch module');
    const data = await response.json();
    return data.module;
  },

  // Fetch module content
  async getModuleContent(slug: string) {
    const response = await fetch(`${API_BASE_URL}/modules/${slug}/content`);
    if (!response.ok) throw new Error('Failed to fetch content');
    const data = await response.json();
    return data.content;
  }
};
```

### 4.2 Update Modules Page

Open `src/pages/Modules.tsx` and replace the imports and data fetching:

```typescript
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
// ... other imports

export const Modules: React.FC = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadModules() {
      try {
        const data = await api.getModules();
        setModules(data);
      } catch (err) {
        setError('Failed to load modules');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadModules();
  }, []);

  if (loading) return <div>Loading modules...</div>;
  if (error) return <div>Error: {error}</div>;

  // ... rest of component
```

---

## Step 5: Test Everything! (2 minutes)

### In one terminal (backend):
```bash
cd backend
npm run dev
```

### In another terminal (frontend):
```bash
cd ..
npm run dev
```

### Open your browser:
1. Go to http://localhost:5173
2. Click "Courses" in the sidebar
3. **You should see all 50 modules loaded from the database!**
4. Click on any module to see the lesson content

---

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] Database schema executed successfully
- [ ] API keys added to `backend/.env`
- [ ] Curriculum seeded (50 modules in database)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Modules page shows all 50 modules from database
- [ ] Individual module pages load content

---

## 🐛 Troubleshooting

### "Failed to fetch modules"
- Check backend is running on port 5000
- Check browser console for CORS errors
- Verify `SUPABASE_URL` and keys in `.env`

### "Database connection failed"
- Double-check Supabase credentials
- Make sure you copied the full keys (they're very long!)
- Verify Supabase project is active (not paused)

### Seeding script errors
- Make sure you're in the `backend` folder
- Check that `curriculum/curriculum-data.json` exists
- Verify `SUPABASE_SERVICE_KEY` is set (not anon key)

---

## 🎉 Next Steps

Once everything is working:

1. **Explore the modules** - All 50 are now live!
2. **Customize content** - Edit markdown files in `curriculum/` folders
3. **Deploy** - Follow `DEPLOYMENT_GUIDE.md` to go live
4. **Add features** - Implement user auth, progress tracking, etc.

**You're ready to learn Arduino with NovEng!** 🚀
