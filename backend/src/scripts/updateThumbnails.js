import 'dotenv/config';
import { supabase } from '../config/database.js';

const ARDUINO_IMAGES = [
  'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80', // Electronic circuit board close-up
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80', // Arduino microcontroller board
  'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=800&q=80', // Breadboard with wiring and components
  'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80', // Colorful LED lights and circuits
  'https://images.unsplash.com/photo-1581093458791-9f3c3250e8e9?auto=format&fit=crop&w=800&q=80', // Electronic sensors and modules
];

async function updateThumbnails() {
  try {
    console.log('🖼️  Updating module thumbnails...\n');

    // Fetch all modules
    const { data: modules, error } = await supabase
      .from('modules')
      .select('id, module_number, title')
      .order('module_number', { ascending: true });

    if (error) throw error;

    console.log(`Found ${modules.length} modules\n`);

    // Update each module with rotating images
    for (const module of modules) {
      const imageIndex = (module.module_number - 1) % ARDUINO_IMAGES.length;
      const thumbnailUrl = ARDUINO_IMAGES[imageIndex];

      const { error: updateError } = await supabase
        .from('modules')
        .update({ thumbnail_url: thumbnailUrl })
        .eq('id', module.id);

      if (updateError) {
        console.error(`❌ Failed to update module ${module.module_number}:`, updateError.message);
      } else {
        console.log(`✅ Module ${module.module_number}: ${module.title}`);
      }
    }

    console.log(`\n🎉 Successfully updated ${modules.length} module thumbnails!`);
  } catch (error) {
    console.error('❌ Error updating thumbnails:', error.message);
    process.exit(1);
  }
}

updateThumbnails();
