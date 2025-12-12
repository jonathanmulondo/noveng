# 🎥 Video Upload Guide - Add Your Recorded Videos to Feed

**Date**: December 8, 2025
**Status**: Ready to Use

---

## 📋 Overview

You have **3 options** for uploading your recorded Arduino project videos to the feed:

| Option | Best For | Cost | Complexity |
|--------|----------|------|------------|
| **Option 1: Supabase Storage** | Videos < 50MB | Free (1GB) | Easy ⭐⭐ |
| **Option 2: YouTube/Vimeo** | Large videos, sharing | Free | Easiest ⭐ |
| **Option 3: Vercel Blob** | High traffic | Paid | Medium ⭐⭐⭐ |

---

## 🚀 Option 1: Supabase Storage (Recommended)

### Why Choose This:
- ✅ Videos hosted on your own platform
- ✅ Fast loading with CDN
- ✅ Free tier: 1GB storage
- ✅ No external dependencies
- ❌ Limited for very large files (>50MB)

### Setup (One-Time):

1. **Create storage bucket**:
   ```bash
   # Visit: https://supabase.com/dashboard/project/YOUR_PROJECT/storage/buckets
   # Click: "New bucket"
   # Name: videos
   # Public: Yes ✅
   # File size limit: 50MB
   ```

2. **Set bucket policies** (make it public):
   - Go to Storage → Policies
   - Create new policy for `videos` bucket:
     ```sql
     -- Allow public read access
     CREATE POLICY "Public read access"
     ON storage.objects FOR SELECT
     USING (bucket_id = 'videos');
     ```

3. **Verify credentials** in `backend/.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your-service-role-key
   ```

### Upload Your Video:

```bash
# From project root directory
node backend/src/scripts/uploadVideos.js "C:\path\to\your-video.mp4" "Your caption here"
```

**Real Example**:
```bash
node backend/src/scripts/uploadVideos.js "C:\Users\mulon\Videos\arduino-traffic-light.mp4" "Built a working traffic light system with Arduino! 🚦 #arduino #electronics"
```

**Output**:
```
📹 Uploading video to Supabase...

✅ Video uploaded successfully!

📎 Public URL: https://your-project.supabase.co/storage/v1/object/public/videos/1733702400000-arduino-traffic-light.mp4

Add this to your feed in services/mockData.ts:

{
  id: 'post_1733702400',
  author: 'Jonathan Mulondo',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  type: 'video',
  src: 'https://your-project.supabase.co/storage/v1/object/public/videos/1733702400000-arduino-traffic-light.mp4',
  caption: 'Built a working traffic light system with Arduino! 🚦 #arduino #electronics',
  likes: 0,
  comments: 0,
  tags: ['arduino', 'electronics']
},
```

### Add to Feed:

1. Open `services/mockData.ts`
2. Find the `posts` array (around line 193)
3. **Add your video at the TOP** (so it appears first):

```typescript
export const posts: Post[] = [
  // 👇 ADD YOUR NEW VIDEO HERE (at the top)
  {
    id: 'post_1733702400',
    author: 'Jonathan Mulondo',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    type: 'video',
    src: 'https://your-project.supabase.co/storage/v1/object/public/videos/1733702400000-arduino-traffic-light.mp4',
    caption: 'Built a working traffic light system with Arduino! 🚦 #arduino #electronics',
    likes: 0,
    comments: 0,
    tags: ['arduino', 'electronics']
  },

  // 👇 Existing posts below
  {
    id: 'post_1',
    author: 'ArduinoAce',
    avatar: '...',
    // ...
  },
  // ... rest of posts
];
```

4. Save the file
5. Git commit and push (if auto-deploy enabled), or refresh your dev server

---

## 🎬 Option 2: YouTube/Vimeo Embed (Easiest)

### Why Choose This:
- ✅ Unlimited storage
- ✅ Automatic compression and quality adjustment
- ✅ Video can be shared widely
- ✅ Built-in analytics
- ❌ Requires YouTube/Vimeo account
- ❌ Shows platform branding

### Steps:

1. **Upload to YouTube**:
   - Go to [YouTube Studio](https://studio.youtube.com)
   - Click "Create" → "Upload videos"
   - Upload your video
   - Set to **"Unlisted"** (so only people with link can view)
   - Copy the video URL: `https://www.youtube.com/watch?v=YOUR_VIDEO_ID`

2. **Get embed URL**:
   - Change from: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - To: `https://www.youtube.com/embed/dQw4w9WgXcQ`

3. **Add to feed** (`services/mockData.ts`):

```typescript
{
  id: 'post_youtube_1',
  author: 'Jonathan Mulondo',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  type: 'video',
  src: 'https://www.youtube.com/embed/YOUR_VIDEO_ID',  // 👈 Embed URL
  caption: 'Arduino temperature monitor with LCD display! 🌡️ #arduino #diy',
  likes: 0,
  comments: 0,
  tags: ['arduino', 'diy', 'temperature']
},
```

**For Vimeo**: Same process, use embed URL like `https://player.vimeo.com/video/YOUR_VIDEO_ID`

---

## ☁️ Option 3: Vercel Blob Storage (Scalable)

### Why Choose This:
- ✅ Integrated with Vercel deployment
- ✅ Automatic CDN distribution
- ✅ Great for high traffic
- ❌ Costs money after free tier (5GB)
- ❌ Requires Vercel account setup

### Setup:

1. **Install Vercel Blob**:
```bash
cd backend
npm install @vercel/blob
```

2. **Create upload script** (`backend/src/scripts/uploadToVercelBlob.js`):

```javascript
import { put } from '@vercel/blob';
import { readFileSync } from 'fs';

async function uploadVideo(filePath, caption) {
  const videoBuffer = readFileSync(filePath);
  const fileName = filePath.split(/[\\/]/).pop();

  const blob = await put(fileName, videoBuffer, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  console.log('✅ Upload complete!');
  console.log('📎 URL:', blob.url);

  // Generate feed post code
  console.log('\nAdd to mockData.ts:');
  console.log(`{
  id: 'post_${Date.now()}',
  author: 'YourName',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  type: 'video',
  src: '${blob.url}',
  caption: '${caption}',
  likes: 0,
  comments: 0,
  tags: ['arduino', 'diy']
},`);
}

const [filePath, caption] = process.argv.slice(2);
uploadVideo(filePath, caption);
```

3. **Get Vercel token**:
   - Visit [Vercel Dashboard](https://vercel.com/dashboard)
   - Settings → Tokens → Create Token
   - Add to `backend/.env`:
     ```env
     BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxx
     ```

4. **Upload**:
```bash
node backend/src/scripts/uploadToVercelBlob.js "path/to/video.mp4" "My Arduino project"
```

---

## 🎯 Quick Comparison

### File Size Limits:
- **Supabase**: 50MB (free tier)
- **YouTube**: Unlimited (15 min videos on free accounts)
- **Vercel Blob**: No limit (but costs after 5GB)

### Best Practices:
1. **Compress videos** before uploading:
   - Use [HandBrake](https://handbrake.fr/) (free)
   - Target: 720p, 30fps, ~10Mbps bitrate
   - Format: MP4 (H.264)

2. **Keep videos short**:
   - Ideal: 30-90 seconds
   - Maximum: 5 minutes

3. **Add captions**:
   - Include project name
   - Add relevant hashtags
   - Mention key components

---

## 📊 Current Feed Structure

Your feed videos are stored in `services/mockData.ts`:

```typescript
export const posts: Post[] = [
  {
    id: 'post_1',           // Unique ID (use timestamp)
    author: 'ArduinoAce',   // Your name or username
    avatar: 'https://...',   // Your profile picture URL
    type: 'video',          // Must be 'video'
    src: 'https://...',     // Video URL from Supabase/YouTube/Vercel
    caption: 'Project description with #tags',
    likes: 0,               // Start at 0
    comments: 0,            // Start at 0
    tags: ['arduino', 'diy'] // Array of tags (max 3-5)
  },
  // ... more posts
];
```

---

## 🛠️ Workflow Summary

### For Quick Videos (<50MB):
```bash
# 1. Upload to Supabase
node backend/src/scripts/uploadVideos.js "video.mp4" "Caption here"

# 2. Copy generated code

# 3. Paste into services/mockData.ts at top of posts array

# 4. Commit and push
git add services/mockData.ts
git commit -m "feat: Add new Arduino project video to feed"
git push

# 5. Auto-deploys to Vercel! ✅
```

### For Large Videos or Public Sharing:
```bash
# 1. Upload to YouTube

# 2. Get embed URL

# 3. Add to mockData.ts manually

# 4. Commit and push
```

---

## 🔮 Future Enhancement: Video Upload UI

**Coming Soon**: Add videos directly from the app without editing code!

Would involve:
1. Upload button in Feed page
2. Form with caption, tags, file picker
3. Progress indicator
4. Automatic addition to feed (via API)
5. No need to edit mockData.ts manually

**Implementation**: Would need to move feed data from `mockData.ts` to database (Supabase `posts` table).

---

## 📝 Tips for Great Feed Videos

1. **First Frame Matters**:
   - Start with completed project visible
   - Arduino should be prominent
   - Good lighting

2. **Show Process**:
   - Wiring connections
   - Code snippets
   - Testing/debugging

3. **Add Text Overlays** (optional):
   - Component names
   - Pin numbers
   - Key concepts

4. **Background Music** (optional):
   - Use royalty-free music
   - Keep volume low (focus on visuals)

5. **End Screen**:
   - Show final result
   - Display your name/username

---

## 🐛 Troubleshooting

### "Video won't play in feed"
**Solution**:
- Check video format is MP4 (not MOV, AVI, etc.)
- Verify URL is publicly accessible
- Test URL in browser directly

### "Upload script fails"
**Solution**:
- Check Supabase credentials in `.env`
- Verify `videos` bucket exists and is public
- Ensure file path has no typos

### "Video too large"
**Solution**:
- Compress with HandBrake
- Or use YouTube instead
- Or upgrade Supabase plan

### "Video added but doesn't show"
**Solution**:
- Clear browser cache
- Check mockData.ts syntax (missing comma, etc.)
- Restart dev server: `npm run dev`

---

## 📞 Need Help?

- Check video URL works in browser first
- Verify mockData.ts syntax (use VS Code error highlighting)
- Test locally before pushing to production
- Keep videos under 30MB for best performance

---

**Built for NovEng Arduino Learning Platform**
**Version**: 1.0.0
**Last Updated**: December 8, 2025
