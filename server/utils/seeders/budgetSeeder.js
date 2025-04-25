/**
 * Budget Seeder
 * Seeds the budgets table with sample data
 */
const supabase = require('../../config/supabase');
const moment = require('moment');

/**
 * Seed budgets table with sample data
 */
const seedBudgets = async () => {
  try {
    console.log('Seeding budgets table...');

    // Check if budgets already exist
    const { data: existingBudgets, error: checkError } = await supabase
      .from('budgets')
      .select('count')
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing budgets:', checkError);
      return;
    }

    if (existingBudgets && existingBudgets.count > 0) {
      console.log(`Found ${existingBudgets.count} existing budgets, skipping seed.`);
      return;
    }

    // Get user IDs
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .order('created_at', { ascending: true })
      .limit(2);

    if (userError) {
      console.error('Error fetching users:', userError);
      throw userError;
    }

    if (!users || users.length === 0) {
      console.error('No users found. Please run the user seeder first.');
      return;
    }

    const user1Id = users[0].id;
    const user2Id = users.length > 1 ? users[1].id : users[0].id;
    
    console.log(`Creating budgets for users: ${users[0].email}${users.length > 1 ? ' and ' + users[1].email : ''}`);

    // Get categories
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('id, name, type');

    if (categoryError) {
      console.error('Error fetching categories:', categoryError);
      throw categoryError;
    }

    if (!categories || categories.length === 0) {
      console.error('No categories found. Please run the category seeder first.');
      return;
    }

    // Filter expense categories
    const expenseCategories = categories.filter(cat => cat.type === 'expense');

    if (expenseCategories.length === 0) {
      console.error('No expense categories found. Please run the category seeder first.');
      return;
    }

    // Current date for reference
    const currentDate = new Date();
    const currentMonth = moment(currentDate).format('YYYY-MM');
    const lastMonth = moment(currentDate).subtract(1, 'month').format('YYYY-MM');
    
    // Budget amounts by category (in IDR)
    const budgetAmounts = {
      'Food & Dining': 2000000,
      'Groceries': 2500000,
      'Transportation': 1000000,
      'Housing': 3500000,
      'Utilities': 1500000,
      'Entertainment': 1000000,
      'Shopping': 1500000,
      'Health & Fitness': 800000,
      'Personal Care': 500000,
      'Education': 1000000,
      'Gifts & Donations': 500000,
      'Travel': 2000000,
      'Makanan': 2000000,
      'Belanja': 2500000,
      'Transportasi': 1000000,
      'Perumahan': 3500000,
      'Tagihan': 1500000,
      'Hiburan': 1000000,
      'Kesehatan': 800000,
      'Perawatan Diri': 500000,
      'Pendidikan': 1000000,
      'Donasi': 500000,
      'Perjalanan': 2000000
    };
    
    // Shared categories
    const sharedCategories = [
      'Housing', 'Utilities', 'Groceries', 
      'Perumahan', 'Tagihan', 'Belanja'
    ];

    // Budgets for current month and last month
    const budgets = [];
    
    // Create budgets for user 1
    for (const category of expenseCategories) {
      const amount = budgetAmounts[category.name] || 500000;
      const isShared = sharedCategories.includes(category.name);
      
      // Current month budget
      budgets.push({
        user_id: user1Id,
        category: category.name,
        amount: amount,
        period: currentMonth,
        spent_amount: Math.floor(amount * (Math.random() * 0.8)),
        rollover: false,
        is_shared: isShared,
        notes: `Budget for ${category.name}`
      });
      
      // Last month budget
      budgets.push({
        user_id: user1Id,
        category: category.name,
        amount: Math.floor(amount * (0.9 + Math.random() * 0.2)),
        period: lastMonth,
        spent_amount: Math.floor(amount * (Math.random() * 1.1)),
        rollover: false,
        is_shared: isShared,
        notes: `Last month budget for ${category.name}`
      });
    }
    
    // Create budgets for user 2 if exists
    if (user2Id !== user1Id) {
      for (const category of expenseCategories) {
        const amount = budgetAmounts[category.name] || 500000;
        const isShared = sharedCategories.includes(category.name);
        
        // Current month budget
        budgets.push({
          user_id: user2Id,
          category: category.name,
          amount: amount,
          period: currentMonth,
          spent_amount: Math.floor(amount * (Math.random() * 0.8)),
          rollover: false,
          is_shared: isShared,
          notes: `Budget for ${category.name}`
        });
        
        // Last month budget
        budgets.push({
          user_id: user2Id,
          category: category.name,
          amount: Math.floor(amount * (0.9 + Math.random() * 0.2)),
          period: lastMonth,
          spent_amount: Math.floor(amount * (Math.random() * 1.1)),
          rollover: false,
          is_shared: isShared,
          notes: `Last month budget for ${category.name}`
        });
      }
    }

    // Insert budgets in chunks to avoid request size limitations
    const chunkSize = 20;
    for (let i = 0; i < budgets.length; i += chunkSize) {
      const chunk = budgets.slice(i, i + chunkSize);
      
      const { data, error } = await supabase
        .from('budgets')
        .insert(chunk);
        
      if (error) {
        console.error(`Error inserting budget chunk ${i/chunkSize + 1}:`, error);
        throw error;
      }
    }

    console.log(`Successfully seeded ${budgets.length} budgets`);
    return { count: budgets.length };
  } catch (error) {
    console.error('Error in budget seeder:', error);
    throw error;
  }
};

// Execute if this script is run directly
if (require.main === module) {
  seedBudgets()
    .then(() => {
      console.log('Budget seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Budget seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedBudgets;