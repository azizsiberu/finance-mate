const supabase = require('../../config/supabase');

/**
 * Create goals table migration
 */
const up = async () => {
  console.log('Running migration: create goals table');

  try {
    // Check if goals table exists
    try {
      const { data } = await supabase.from('goals').select('id').limit(1);
      console.log('Goals table already exists, skipping creation');
    } catch (error) {
      // Table doesn't exist, create it
      console.log('Creating goals table...');
      const { error: createError } = await supabase.rpc('run_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS goals (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            name VARCHAR(100) NOT NULL,
            target_amount DECIMAL(12,2) NOT NULL,
            current_amount DECIMAL(12,2) DEFAULT 0,
            target_date TIMESTAMPTZ,
            description TEXT,
            category VARCHAR(50),
            priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
            status VARCHAR(20) DEFAULT 'in_progress', -- 'in_progress', 'achieved', 'failed'
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
          
          -- Create index for better performance
          CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
        `
      });
      
      if (createError) {
        console.error('Error creating goals table:', createError);
        throw createError;
      }
    }

    console.log('Goals table migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

/**
 * Drop goals table migration
 */
const down = async () => {
  console.log('Running down migration: drop goals table');

  try {
    // Drop goals table with SQL
    const { error } = await supabase.rpc('run_sql', {
      sql: 'DROP TABLE IF EXISTS goals CASCADE;'
    });

    if (error) {
      console.error('Error dropping goals table:', error);
      throw error;
    }

    console.log('Goals table dropped successfully');
  } catch (error) {
    console.error('Down migration failed:', error);
    throw error;
  }
};

module.exports = {
  up,
  down
};