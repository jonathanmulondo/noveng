import { supabaseAdmin } from '../config/database.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  console.log('🚀 Running database migration...\n');

  try {
    // Read the SQL migration file
    const sqlPath = join(__dirname, '../../sql/create_user_profiles.sql');
    const sql = readFileSync(sqlPath, 'utf8');

    console.log('📄 SQL Migration Content:');
    console.log('─'.repeat(50));
    console.log(sql);
    console.log('─'.repeat(50));
    console.log('\n⚠️  IMPORTANT: This SQL needs to be run in your Supabase SQL Editor\n');
    console.log('📝 Steps to run the migration:');
    console.log('   1. Go to your Supabase Dashboard');
    console.log('   2. Navigate to SQL Editor');
    console.log('   3. Create a new query');
    console.log('   4. Copy and paste the SQL above');
    console.log('   5. Click "Run" to execute\n');

    console.log('🔍 Checking if user_profiles table already exists...\n');

    // Try to query the table to see if it exists
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .limit(1);

    if (error) {
      if (error.message.includes('does not exist') || error.code === '42P01') {
        console.log('❌ Table does not exist yet');
        console.log('👉 Please run the SQL migration in Supabase SQL Editor (see instructions above)\n');
      } else {
        console.log('❌ Error checking table:', error.message);
      }
    } else {
      console.log('✅ user_profiles table already exists!');
      console.log('✅ Migration has been run successfully\n');
    }

  } catch (error) {
    console.error('❌ Migration check failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
runMigration().then(() => {
  console.log('✅ Migration check complete');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
