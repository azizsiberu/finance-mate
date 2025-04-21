-- Database schema for FinanceMate application

-- Users table
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

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'income', 'expense', etc.
  icon VARCHAR(50),
  color VARCHAR(50),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- NULL for default categories
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions table
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

-- Goals table
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

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  billing_cycle VARCHAR(50) NOT NULL, -- 'monthly', 'yearly', 'quarterly', etc.
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  billing_date TIMESTAMPTZ NOT NULL,
  reminder_days INT DEFAULT 3, -- Days before to send reminder
  description TEXT,
  url VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  next_payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  period_type VARCHAR(20) NOT NULL, -- 'monthly', 'weekly', 'yearly'
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'subscription_reminder', 'budget_alert', etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  reference_id UUID, -- ID of the referenced entity (subscription, budget, etc.)
  reference_type VARCHAR(50), -- Type of the referenced entity
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance optimization
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);