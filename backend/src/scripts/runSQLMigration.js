import pg from 'pg';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

async function runMigration() {
  console.log('🚀 Running database migration...\n');

  // Parse DATABASE_URL or construct connection string
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in .env file');
    console.log('\n📝 Please add your Supabase database URL to .env:');
    console.log('   DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres\n');
    process.exit(1);
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Connect to database
    console.log('📡 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Read the SQL migration file
    const sqlPath = join(__dirname, '../../sql/create_user_profiles.sql');
    const sql = readFileSync(sqlPath, 'utf8');

    console.log('📄 Executing SQL migration...\n');

    // Execute the entire SQL file
    await client.query(sql);

    console.log('✅ Migration executed successfully!\n');

    // Verify the table was created
    console.log('🔍 Verifying user_profiles table...');
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'user_profiles'
    `);

    if (result.rows.length > 0) {
      console.log('✅ user_profiles table exists!');

      // Check the structure
      const columns = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'user_profiles'
        ORDER BY ordinal_position
      `);

      console.log('\n📋 Table structure:');
      columns.rows.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type}`);
      });

      console.log('\n✅ Migration completed successfully!\n');
    } else {
      console.log('❌ Table was not created properly\n');
    }

  } catch (error) {
    console.error('❌ Migration error:', error.message);

    if (error.message.includes('already exists')) {
      console.log('\n✅ Table already exists - migration not needed!\n');
    } else {
      console.log('\n📝 Manual steps:');
      console.log('   1. Go to your Supabase Dashboard');
      console.log('   2. Navigate to SQL Editor');
      console.log('   3. Copy and paste the content from: backend/sql/create_user_profiles.sql');
      console.log('   4. Click "Run"\n');
    }
  } finally {
    await client.end();
    console.log('📡 Database connection closed');
  }
}

// Run the migration
runMigration().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
