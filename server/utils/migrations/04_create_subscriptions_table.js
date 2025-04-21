const supabase = require('../../config/supabase');

/**
 * Create subscriptions table migration
 */
const up = async () => {
  console.log('Running migration: create subscriptions table');

  // Create subscriptions table with SQL
  const { error } = await supabase.from('subscriptions').select('id').limit(1).then(async () => {
    console.log('Subscriptions table already exists, skipping creation');
    return { error: null };
  }).catch(async () => {
    console.log('Creating subscriptions table...');
    return await supabase.rpc('run_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS subscriptions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          name VARCHAR(100) NOT NULL,
          amount DECIMAL(12,2) NOT NULL,
          billing_cycle VARCHAR(20) NOT NULL, -- 'monthly', 'yearly', 'quarterly', 'weekly'
          start_date TIMESTAMPTZ NOT NULL,
          end_date TIMESTAMPTZ,
          next_billing_date TIMESTAMPTZ NOT NULL,
          category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
          description TEXT,
          status VARCHAR(20) DEFAULT 'active', -- 'active', 'cancelled', 'paused'
          auto_renew BOOLEAN DEFAULT TRUE,
          reminder_days INT DEFAULT 3, -- Days before next billing to send reminder
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
        CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing_date ON subscriptions(next_billing_date);
      `
    });
  });

  if (error) {
    console.error('Error creating subscriptions table:', error);
    throw error;
  }

  console.log('Subscriptions table migration completed successfully');
};

/**
 * Drop subscriptions table migration
 */
const down = async () => {
  console.log('Running down migration: drop subscriptions table');

  // Drop subscriptions table with SQL
  const { error } = await supabase.rpc('run_sql', {
    sql: 'DROP TABLE IF EXISTS subscriptions CASCADE;'
  });

  if (error) {
    console.error('Error dropping subscriptions table:', error);
    throw error;
  }

  console.log('Subscriptions table dropped successfully');
};

module.exports = {
  up,
  down
};