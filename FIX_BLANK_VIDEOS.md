# 🔧 Fix Blank Video Issue (Audio Playing, No Video)

## Problem:
Your videos are in **HEVC/H.265 codec** which browsers cannot display (but audio works).

## Solution:
Convert to **H.264 codec** which all browsers support.

---

## Quick Fix (Recommended):

### Option 1: Re-record videos on your phone
1. Open Camera Settings on your phone
2. Change format to **"Most Compatible"** (iPhone) or **"H.264"** (Android)
3. Re-record the problematic videos
4. Upload using the same script:
```bash
node backend/src/scripts/uploadVideos.js "C:\Users\mulon\Pictures\new-video.mp4" "Caption here"
```

---

## Option 2: Convert Existing Videos (Requires FFmpeg)

### Step 1: Install FFmpeg
**Windows (easiest)**:
1. Download from: https://www.gyan.dev/ffmpeg/builds/
2. Get "ffmpeg-release-essentials.zip"
3. Extract to `C:\ffmpeg`
4. Add `C:\ffmpeg\bin` to Windows PATH

**Test installation**:
```bash
ffmpeg -version
```

### Step 2: Convert Your Videos

I've created a conversion script for you. Run this for each blank video:

```bash
# Convert WA0007 (if it's blank)
node backend/src/scripts/convertVideo.js "C:\Users\mulon\Pictures\VID-20251208-WA0007.mp4"

# Convert WA0008 (if it's blank)
node backend/src/scripts/convertVideo.js "C:\Users\mulon\Pictures\VID-20251208-WA0008.mp4"

# Etc...
```

### Step 3: Update mockData.ts

The script will give you a new URL. Replace the old URL in `services/mockData.ts`:

```typescript
// BEFORE (blank video):
src: 'https://mtvwxjuofppthkrwuxnu.supabase.co/storage/v1/object/public/videos/OLD-VIDEO.mp4',

// AFTER (working video):
src: 'https://mtvwxjuofppthkrwuxnu.supabase.co/storage/v1/object/public/videos/CONVERTED-VIDEO.mp4',
```

---

## How to Test Which Videos Are Blank:

1. Go to your feed: https://noveng-frontend-9qa3dgu4w-jonathan-mulondos-projects.vercel.app/feed
2. For each video:
   - ✅ **Working**: Video visible + audio plays
   - ❌ **Blank**: Black screen but audio plays

3. Note which videos are blank (e.g., "WA0008 and WA0010")

4. Convert only those videos using Option 2 above

---

## Why This Happens:

- **HEVC/H.265**: Modern phone codec, smaller files, NOT supported in browsers
- **H.264/AVC**: Older codec, larger files, universally supported

Most Android phones and newer iPhones default to HEVC to save space.

---

## Prevention for Future Videos:

**iPhone**:
- Settings → Camera → Formats → Select "Most Compatible"

**Android**:
- Camera app → Settings → Video encoder → Select "H.264"

**Or**: Always convert videos before uploading using the script!

---

## Need Help?

Let me know which specific videos are showing blank and I can help you convert them!
