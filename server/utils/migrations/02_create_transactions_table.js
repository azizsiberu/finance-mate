const supabase = require('../../config/supabase');

/**
 * Create transactions table migration
 */
const up = async () => {
  console.log('Running migration: create transactions table');

  // Create transactions table with SQL
  const { error } = await supabase.from('transactions').select('id').limit(1).then(async () => {
    console.log('Transactions table already exists, skipping creation');
    return { error: null };
  }).catch(async () => {
    console.log('Creating transactions table...');
    return await supabase.rpc('run_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS transactions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          amount DECIMAL(12,2) NOT NULL,
          type VARCHAR(50) NOT NULL, -- 'income', 'expense', 'transfer'
          category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
          description TEXT,
          date TIMESTAMPTZ NOT NULL,
          payment_method VARCHAR(50),
          location VARCHAR(255),
          is_recurring BOOLEAN DEFAULT FALSE,
          recurring_id UUID, -- NULL if not part of a recurring transaction
          tags TEXT[], -- Array of tags
          attachment_url VARCHAR(255),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
        CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
        CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);
      `
    });
  });

  if (error) {
    console.error('Error creating transactions table:', error);
    throw error;
  }

  console.log('Transactions table migration completed successfully');
};

/**
 * Drop transactions table migration
 */
const down = async () => {
  console.log('Running down migration: drop transactions table');

  // Drop transactions table with SQL
  const { error } = await supabase.rpc('run_sql', {
    sql: 'DROP TABLE IF EXISTS transactions CASCADE;'
  });

  if (error) {
    console.error('Error dropping transactions table:', error);
    throw error;
  }

  console.log('Transactions table dropped successfully');
};

module.exports = {
  up,
  down
};