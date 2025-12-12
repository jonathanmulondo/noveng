import { supabaseAdmin } from '../config/database.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  console.log('🚀 Running database migration using Supabase Admin...\n');

  try {
    // Read the SQL file
    const sqlPath = join(__dirname, '../../sql/create_user_profiles.sql');
    const sql = readFileSync(sqlPath, 'utf8');

    console.log('📄 Executing migration SQL...\n');

    // Try to create the table directly using raw query
    // First, check if table exists
    const { data: existingTable, error: checkError } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .limit(1);

    if (!checkError) {
      console.log('✅ user_profiles table already exists!');
      console.log('✅ Migration not needed\n');
      return true;
    }

    // Table doesn't exist, we need to create it
    console.log('📝 Table does not exist, creating it...\n');
    console.log('⚠️  Supabase SDK cannot execute raw DDL SQL directly.');
    console.log('📋 Please run the following migration in your Supabase SQL Editor:\n');
    console.log('─'.repeat(70));
    console.log(sql);
    console.log('─'.repeat(70));
    console.log('\n📝 Steps:');
    console.log('   1. Go to: https://mtvwxjuofppthkrwuxnu.supabase.co/project/mtvwxjuofppthkrwuxnu/sql');
    console.log('   2. Click "New Query"');
    console.log('   3. Paste the SQL shown above');
    console.log('   4. Click "Run" or press Ctrl/Cmd + Enter');
    console.log('   5. After running, come back and test the signup/login!\n');

    return false;

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    return false;
  }
}

// Run the migration
runMigration().then((success) => {
  if (success) {
    console.log('✅ Migration complete!');
    process.exit(0);
  } else {
    console.log('⏸️  Migration requires manual SQL execution');
    process.exit(0); // Exit 0 since this is expected
  }
}).catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
