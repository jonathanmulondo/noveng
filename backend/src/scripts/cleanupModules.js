import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Use service role key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function cleanupModules() {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║     🗑️  CLEANUP: DELETE MODULES 2-50                      ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');

  try {
    // Delete all modules except module 1
    const { data, error } = await supabase
      .from('modules')
      .delete()
      .neq('module_number', 1)
      .select();

    if (error) {
      throw error;
    }

    console.log(`✓ Deleted ${data.length} modules (kept only Module 1)`);
    console.log('');
    console.log('Deleted modules:');
    data.forEach(module => {
      console.log(`  - Module ${module.module_number}: ${module.title}`);
    });

    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║                                                           ║');
    console.log('║     ✅ CLEANUP COMPLETE!                                   ║');
    console.log('║                                                           ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('╔═══════════════════════════════════════════════════════════╗');
    console.error('║                                                           ║');
    console.error('║     ✗ CLEANUP FAILED!                                     ║');
    console.error('║                                                           ║');
    console.error('╚═══════════════════════════════════════════════════════════╝');
    console.error('');
    console.error('Error details:', error);
    console.error('');
    process.exit(1);
  }
}

// Run cleanup
cleanupModules();
