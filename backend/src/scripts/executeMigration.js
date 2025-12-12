import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeMigration() {
  console.log('🚀 Executing database migration...\n');

  try {
    // Read the SQL migration file
    const sqlPath = join(__dirname, '../../sql/create_user_profiles.sql');
    const fullSQL = readFileSync(sqlPath, 'utf8');

    console.log('📄 Running SQL migration...\n');

    // Split the SQL into individual statements
    const statements = fullSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    let successCount = 0;
    let errorCount = 0;

    for (const statement of statements) {
      if (!statement) continue;

      try {
        // Execute each statement individually
        const { error } = await supabase.rpc('exec_sql', {
          sql: statement + ';'
        });

        if (error) {
          // Check if it's an "already exists" error, which is fine
          if (error.message.includes('already exists') ||
              error.message.includes('does not exist') ||
              error.code === 'PGRST116') {
            console.log(`⚠️  Skipped (already exists): ${statement.substring(0, 50)}...`);
          } else {
            console.error(`❌ Error executing statement:`, error.message);
            console.error(`   Statement: ${statement.substring(0, 100)}...`);
            errorCount++;
          }
        } else {
          successCount++;
          console.log(`✅ Executed: ${statement.substring(0, 50)}...`);
        }
      } catch (err) {
        console.error(`❌ Exception:`, err.message);
        errorCount++;
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}\n`);

    // Verify the table was created
    console.log('🔍 Verifying user_profiles table...\n');
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);

    if (error) {
      console.log('❌ Table verification failed:', error.message);
      console.log('\n📝 Manual steps required:');
      console.log('   1. Go to your Supabase Dashboard');
      console.log('   2. Navigate to SQL Editor');
      console.log('   3. Run the SQL from: backend/sql/create_user_profiles.sql\n');
      return false;
    } else {
      console.log('✅ user_profiles table exists and is accessible!');
      console.log('✅ Migration completed successfully!\n');
      return true;
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\n📝 Manual steps required:');
    console.log('   1. Go to your Supabase Dashboard');
    console.log('   2. Navigate to SQL Editor');
    console.log('   3. Run the SQL from: backend/sql/create_user_profiles.sql\n');
    return false;
  }
}

// Run the migration
executeMigration().then((success) => {
  process.exit(success ? 0 : 1);
}).catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
