import { supabaseAdmin } from '../config/database.js';

async function createUserTables() {
  console.log('Creating user_profiles table...');

  // Create user_profiles table
  const { error } = await supabaseAdmin.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS user_profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        level INTEGER DEFAULT 1,
        current_xp INTEGER DEFAULT 0,
        next_level_xp INTEGER DEFAULT 100,
        streak_days INTEGER DEFAULT 0,
        total_learning_hours DECIMAL(10,2) DEFAULT 0,
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create index for faster lookups
      CREATE INDEX IF NOT EXISTS user_profiles_email_idx ON user_profiles(email);

      -- Enable Row Level Security
      ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

      -- Policy: Users can read their own profile
      CREATE POLICY IF NOT EXISTS "Users can read own profile"
        ON user_profiles FOR SELECT
        USING (auth.uid() = id);

      -- Policy: Users can update their own profile
      CREATE POLICY IF NOT EXISTS "Users can update own profile"
        ON user_profiles FOR UPDATE
        USING (auth.uid() = id);

      -- Policy: Service role can insert profiles
      CREATE POLICY IF NOT EXISTS "Service role can insert profiles"
        ON user_profiles FOR INSERT
        WITH CHECK (true);
    `
  });

  if (error) {
    console.error('Error creating user_profiles table:', error);
    return false;
  }

  console.log('✓ user_profiles table created successfully');
  return true;
}

// Run the migration
createUserTables().then(() => {
  console.log('Migration complete');
  process.exit(0);
}).catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
