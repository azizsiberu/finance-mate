const supabase = require('../../config/supabase');

/**
 * Create budgets table migration
 */
const up = async () => {
  console.log('Running migration: create budgets table');

  // Create budgets table with SQL
  const { error } = await supabase.from('budgets').select('id').limit(1).then(async () => {
    console.log('Budgets table already exists, skipping creation');
    return { error: null };
  }).catch(async () => {
    console.log('Creating budgets table...');
    return await supabase.rpc('run_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS budgets (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          name VARCHAR(100) NOT NULL,
          amount DECIMAL(12,2) NOT NULL,
          period VARCHAR(20) NOT NULL, -- 'monthly', 'yearly', 'weekly', 'custom'
          start_date TIMESTAMPTZ NOT NULL,
          end_date TIMESTAMPTZ NOT NULL,
          category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
          description TEXT,
          color VARCHAR(20),
          is_recurring BOOLEAN DEFAULT FALSE,
          rollover BOOLEAN DEFAULT FALSE, -- Whether unspent amount rolls over to next period
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
        CREATE INDEX IF NOT EXISTS idx_budgets_category_id ON budgets(category_id);
      `
    });
  });

  if (error) {
    console.error('Error creating budgets table:', error);
    throw error;
  }

  console.log('Budgets table migration completed successfully');
};

/**
 * Drop budgets table migration
 */
const down = async () => {
  console.log('Running down migration: drop budgets table');

  // Drop budgets table with SQL
  const { error } = await supabase.rpc('run_sql', {
    sql: 'DROP TABLE IF EXISTS budgets CASCADE;'
  });

  if (error) {
    console.error('Error dropping budgets table:', error);
    throw error;
  }

  console.log('Budgets table dropped successfully');
};

module.exports = {
  up,
  down
};