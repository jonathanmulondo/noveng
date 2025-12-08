import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../../backend/.env') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * Download video from URL to temp file
 */
async function downloadVideo(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(outputPath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(outputPath);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Generate captions using OpenAI Whisper API
 *
 * Usage:
 * node backend/src/scripts/generateCaptions.js https://your-video-url.mp4
 */
async function generateCaptions(videoUrl) {
  try {
    console.log('🎬 Generating captions for video...\n');
    console.log('📥 Downloading video:', videoUrl);

    // Create temp directory if it doesn't exist
    const tempDir = join(__dirname, '../../../temp');
    if (!existsSync(tempDir)) {
      mkdirSync(tempDir, { recursive: true });
    }

    const tempVideoPath = join(tempDir, 'temp-video.mp4');

    // Download video
    await downloadVideo(videoUrl, tempVideoPath);
    console.log('✅ Video downloaded\n');

    console.log('🤖 Transcribing with OpenAI Whisper...');

    // Transcribe using Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: await import('fs').then(fs => fs.createReadStream(tempVideoPath)),
      model: 'whisper-1',
      response_format: 'vtt', // WebVTT format with timestamps
      language: 'en' // Change to your video language
    });

    console.log('✅ Transcription complete!\n');

    // Save caption file
    const captionFileName = videoUrl.split('/').pop().replace('.mp4', '.vtt');
    const captionPath = join(tempDir, captionFileName);

    await import('fs').then(fs =>
      fs.promises.writeFile(captionPath, transcription, 'utf-8')
    );

    console.log('📄 Caption file saved:', captionPath);
    console.log('\nCaption content preview:');
    console.log('------------------------');
    console.log(transcription.substring(0, 500));
    console.log('------------------------\n');

    // Upload caption to Supabase Storage
    console.log('☁️  Uploading caption to Supabase...');

    const captionBuffer = await import('fs').then(fs =>
      fs.promises.readFile(captionPath)
    );

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('captions')
      .upload(captionFileName, captionBuffer, {
        contentType: 'text/vtt',
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Get public URL for caption
    const { data: { publicUrl } } = supabase.storage
      .from('captions')
      .getPublicUrl(captionFileName);

    console.log('✅ Caption uploaded successfully!\n');
    console.log('📎 Caption URL:', publicUrl);
    console.log('\nTo add captions to your video in Feed.tsx:');
    console.log('------------------------');
    console.log(`<video
  ref={videoRef}
  src="${videoUrl}"
  className="w-full h-full object-contain bg-neutral-900"
  loop
  playsInline
  crossOrigin="anonymous"
>
  <track
    kind="captions"
    src="${publicUrl}"
    srcLang="en"
    label="English"
    default
  />
</video>`);
    console.log('------------------------\n');

    // Clean up temp file
    await import('fs').then(fs => fs.promises.unlink(tempVideoPath));
    console.log('🧹 Cleaned up temporary files');

    return {
      captionUrl: publicUrl,
      captionPath,
      transcription
    };

  } catch (error) {
    console.error('❌ Error generating captions:', error.message);

    if (error.message.includes('OPENAI_API_KEY')) {
      console.log('\n⚠️  You need to add OPENAI_API_KEY to your .env file');
      console.log('Get your API key from: https://platform.openai.com/api-keys');
    }

    process.exit(1);
  }
}

// Command line usage
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node generateCaptions.js <video-url>');
  console.log('\nExample:');
  console.log('node generateCaptions.js https://mtvwxjuofppthkrwuxnu.supabase.co/storage/v1/object/public/videos/your-video.mp4');
  console.log('\nThis will:');
  console.log('1. Download the video');
  console.log('2. Transcribe audio using OpenAI Whisper');
  console.log('3. Generate .vtt caption file with timestamps');
  console.log('4. Upload caption to Supabase Storage');
  console.log('5. Give you the code to add captions to your video');
  process.exit(0);
}

generateCaptions(args[0]);
