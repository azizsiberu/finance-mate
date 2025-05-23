const supabase = require('../../config/supabase');

/**
 * Create users table migration
 */
const up = async () => {
  console.log('Running migration: create users table');

  try {
    // Enable UUID extension if not exists
    try {
      const { error: extError } = await supabase.rpc('create_extension_if_not_exists', { 
        extension_name: 'uuid-ossp' 
      });
      
      if (extError) {
        console.log('Note: Could not enable extension but proceeding anyway');
      }
    } catch (error) {
      console.log('Note: uuid-ossp extension might already be enabled or cannot be enabled from RPC');
    }

    // Check if users table exists
    try {
      const { data } = await supabase.from('users').select('id').limit(1);
      console.log('Users table already exists, skipping creation');
    } catch (error) {
      // Table doesn't exist, create it
      console.log('Creating users table...');
      const { error: createError } = await supabase.rpc('run_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            first_name VARCHAR(100),
            last_name VARCHAR(100),
            profile_image VARCHAR(255),
            currency VARCHAR(10) DEFAULT 'USD',
            language VARCHAR(10) DEFAULT 'en',
            theme VARCHAR(20) DEFAULT 'light',
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      });
      
      if (createError) {
        console.error('Error creating users table:', createError);
        throw createError;
      }
    }

    console.log('Users table migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

/**
 * Drop users table migration
 */
const down = async () => {
  console.log('Running down migration: drop users table');

  try {
    // Drop users table with SQL
    const { error } = await supabase.rpc('run_sql', {
      sql: 'DROP TABLE IF EXISTS users CASCADE;'
    });

    if (error) {
      console.error('Error dropping users table:', error);
      throw error;
    }

    console.log('Users table dropped successfully');
  } catch (error) {
    console.error('Down migration failed:', error);
    throw error;
  }
};

module.exports = {
  up,
  down
};