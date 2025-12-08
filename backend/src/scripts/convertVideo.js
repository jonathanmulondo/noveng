import { createClient } from '@supabase/supabase-js';
import { createWriteStream, createReadStream, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import https from 'https';
import dotenv from 'dotenv';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../../backend/.env') });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * Download file from URL
 */
async function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(outputPath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(outputPath);
      });
    }).on('error', reject);
  });
}

/**
 * Convert video to browser-compatible format using FFmpeg
 *
 * Usage:
 * node backend/src/scripts/convertVideo.js "C:\Users\mulon\Pictures\video.mp4"
 * OR
 * node backend/src/scripts/convertVideo.js "https://supabase-url/video.mp4"
 */
async function convertVideo(input) {
  try {
    console.log('🎬 Converting video to browser-compatible format...\n');

    // Create temp directory
    const tempDir = join(__dirname, '../../../temp');
    if (!existsSync(tempDir)) {
      mkdirSync(tempDir, { recursive: true });
    }

    let inputPath = input;
    let isUrl = input.startsWith('http');

    // Download if URL
    if (isUrl) {
      console.log('📥 Downloading video from URL...');
      inputPath = join(tempDir, 'input-video.mp4');
      await downloadFile(input, inputPath);
      console.log('✅ Downloaded\n');
    }

    const fileName = input.split(/[\\/]/).pop().replace(/\.[^.]+$/, '');
    const outputPath = join(tempDir, `${fileName}-converted.mp4`);

    console.log('🔄 Converting with FFmpeg...');
    console.log('   Format: H.264 video, AAC audio');
    console.log('   Resolution: Original (maintains aspect ratio)');
    console.log('   This may take 30-60 seconds...\n');

    // Check if FFmpeg is installed
    let ffmpegPath = 'ffmpeg';
    try {
      await execAsync('ffmpeg -version');
    } catch (err) {
      // Try WinGet installation path
      const wingetPath = 'C:\\Users\\mulon\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.0.1-full_build\\bin\\ffmpeg.exe';
      try {
        await execAsync(`"${wingetPath}" -version`);
        ffmpegPath = wingetPath;
        console.log('✅ Found FFmpeg in WinGet packages\n');
      } catch {
        console.error('❌ FFmpeg not installed!');
        console.log('\n📦 Install FFmpeg:');
        console.log('   Windows: Download from https://ffmpeg.org/download.html');
        console.log('   Or use: winget install ffmpeg');
        console.log('   Mac: brew install ffmpeg');
        console.log('   Linux: sudo apt install ffmpeg');
        process.exit(1);
      }
    }

    // Convert video to H.264 + AAC (universally compatible)
    const ffmpegCommand = `"${ffmpegPath}" -i "${inputPath}" -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k -movflags +faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "${outputPath}" -y`;

    const { stdout, stderr } = await execAsync(ffmpegCommand);

    console.log('✅ Conversion complete!\n');

    // Get file sizes
    const { size: originalSize } = await import('fs').then(fs =>
      fs.promises.stat(inputPath)
    );
    const { size: convertedSize } = await import('fs').then(fs =>
      fs.promises.stat(outputPath)
    );

    console.log('📊 File sizes:');
    console.log(`   Original:  ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Converted: ${(convertedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Savings:   ${(((originalSize - convertedSize) / originalSize) * 100).toFixed(1)}%\n`);

    // Upload to Supabase
    console.log('☁️  Uploading to Supabase...');

    const videoBuffer = await import('fs').then(fs =>
      fs.promises.readFile(outputPath)
    );

    const timestamp = Date.now();
    const uploadFileName = `${timestamp}-${fileName}-converted.mp4`;

    const { data, error } = await supabase.storage
      .from('videos')
      .upload(uploadFileName, videoBuffer, {
        contentType: 'video/mp4',
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(uploadFileName);

    console.log('✅ Upload complete!\n');
    console.log('📎 New video URL:', publicUrl);
    console.log('\n✏️  Update your mockData.ts:');
    console.log('------------------------');
    console.log(`Replace the old src with:
src: '${publicUrl}'`);
    console.log('------------------------\n');

    // Clean up temp files
    if (isUrl && existsSync(inputPath)) {
      unlinkSync(inputPath);
    }
    if (existsSync(outputPath)) {
      unlinkSync(outputPath);
    }
    console.log('🧹 Cleaned up temporary files');

    return publicUrl;

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Command line usage
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node convertVideo.js <video-path-or-url>\n');
  console.log('Examples:');
  console.log('  node convertVideo.js "C:\\Users\\mulon\\Pictures\\video.mp4"');
  console.log('  node convertVideo.js "https://supabase.co/storage/videos/video.mp4"\n');
  console.log('What it does:');
  console.log('  • Converts video to H.264 (universally compatible)');
  console.log('  • Optimizes for web playback');
  console.log('  • Uploads to Supabase');
  console.log('  • Gives you the new URL to use in mockData.ts');
  process.exit(0);
}

convertVideo(args[0]);
