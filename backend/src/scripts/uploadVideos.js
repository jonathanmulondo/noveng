import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../../backend/.env') });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * Upload video to Supabase Storage
 *
 * Usage:
 * node backend/src/scripts/uploadVideos.js path/to/video.mp4 "My Arduino Project"
 */
async function uploadVideo(filePath, caption = '') {
  try {
    console.log('📹 Uploading video to Supabase...\n');

    // Read the video file
    const videoBuffer = readFileSync(filePath);
    const fileName = filePath.split(/[\\/]/).pop();
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(uniqueFileName, videoBuffer, {
        contentType: 'video/mp4',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(uniqueFileName);

    console.log('✅ Video uploaded successfully!\n');
    console.log('📎 Public URL:', publicUrl);
    console.log('\nAdd this to your feed in services/mockData.ts:');
    console.log('\n{');
    console.log(`  id: 'post_${Date.now()}',`);
    console.log(`  author: 'YourName',`);
    console.log(`  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',`);
    console.log(`  type: 'video',`);
    console.log(`  src: '${publicUrl}',`);
    console.log(`  caption: '${caption || 'Your caption here'} #arduino #diy',`);
    console.log(`  likes: 0,`);
    console.log(`  comments: 0,`);
    console.log(`  tags: ['arduino', 'diy']`);
    console.log('},\n');

    return publicUrl;
  } catch (error) {
    console.error('❌ Error uploading video:', error.message);
    process.exit(1);
  }
}

// Command line usage
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node uploadVideos.js <video-path> [caption]');
  console.log('Example: node uploadVideos.js my-project.mp4 "My awesome Arduino project"');
  process.exit(0);
}

uploadVideo(args[0], args[1]);
