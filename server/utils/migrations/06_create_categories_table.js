const supabase = require('../../config/supabase');

/**
 * Create categories table migration
 */
const up = async () => {
  console.log('Running migration: create categories table');

  // Create categories table with SQL
  const { error } = await supabase.from('categories').select('id').limit(1).then(async () => {
    console.log('Categories table already exists, skipping creation');
    return { error: null };
  }).catch(async () => {
    console.log('Creating categories table...');
    return await supabase.rpc('run_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS categories (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(100) NOT NULL,
          type VARCHAR(20) NOT NULL, -- 'income', 'expense', 'both'
          icon VARCHAR(50),
          color VARCHAR(20),
          parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
          is_system BOOLEAN DEFAULT FALSE, -- System categories cannot be deleted
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(name, type)
        );
        
        -- Create index for better performance
        CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);
      `
    });
  });

  if (error) {
    console.error('Error creating categories table:', error);
    throw error;
  }

  console.log('Categories table migration completed successfully');
};

/**
 * Drop categories table migration
 */
const down = async () => {
  console.log('Running down migration: drop categories table');

  // Drop categories table with SQL
  const { error } = await supabase.rpc('run_sql', {
    sql: 'DROP TABLE IF EXISTS categories CASCADE;'
  });

  if (error) {
    console.error('Error dropping categories table:', error);
    throw error;
  }

  console.log('Categories table dropped successfully');
};

module.exports = {
  up,
  down
};