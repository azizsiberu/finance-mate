/**
 * Transaction Seeder
 * Seeds the transactions table with sample data
 */
const supabase = require('../../config/supabase');

/**
 * Seed transactions table with sample data
 */
const seedTransactions = async () => {
  try {
    console.log('Seeding transactions table...');

    // Check if transactions already exist
    const { data: existingTransactions, error: checkError } = await supabase
      .from('transactions')
      .select('count')
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing transactions:', checkError);
      return;
    }

    if (existingTransactions && existingTransactions.count > 0) {
      console.log(`Found ${existingTransactions.count} existing transactions, skipping seed.`);
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
    
    console.log(`Creating transactions for users: ${users[0].email}${users.length > 1 ? ' and ' + users[1].email : ''}`);

    // Get category IDs
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
    
    // Filter categories by type
    const incomeCategories = categories.filter(cat => cat.type === 'income');
    const expenseCategories = categories.filter(cat => cat.type === 'expense');
    
    if (incomeCategories.length === 0 || expenseCategories.length === 0) {
      console.error('Missing income or expense categories. Please run the category seeder first.');
      return;
    }

    // Current date for reference
    const currentDate = new Date();
    
    // Generate transactions for the past 3 months
    const transactions = [];
    
    // User 1 transactions
    for (let i = 0; i < 30; i++) {
      const isIncome = Math.random() > 0.7; // 30% chance of income, 70% chance of expense
      const category = isIncome 
        ? incomeCategories[Math.floor(Math.random() * incomeCategories.length)]
        : expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
      
      const daysAgo = Math.floor(Math.random() * 90); // Random date within last 90 days
      const transactionDate = new Date();
      transactionDate.setDate(currentDate.getDate() - daysAgo);
      
      transactions.push({
        user_id: user1Id,
        amount: Math.floor(Math.random() * 1000000) / 100 + 10, // Random amount between 10 and 10,000
        type: isIncome ? 'income' : 'expense',
        category: category.name,
        description: `Sample ${isIncome ? 'income' : 'expense'} - ${category.name}`,
        transaction_date: transactionDate.toISOString(),
        is_shared: Math.random() > 0.7, // 30% chance of being shared
        tags: ['sample', 'seeder', category.name.toLowerCase().replace(' ', '-')]
      });
    }
    
    // User 2 transactions (if a second user exists)
    if (user2Id !== user1Id) {
      for (let i = 0; i < 25; i++) {
        const isIncome = Math.random() > 0.7;
        const category = isIncome 
          ? incomeCategories[Math.floor(Math.random() * incomeCategories.length)]
          : expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
        
        const daysAgo = Math.floor(Math.random() * 90);
        const transactionDate = new Date();
        transactionDate.setDate(currentDate.getDate() - daysAgo);
        
        transactions.push({
          user_id: user2Id,
          amount: Math.floor(Math.random() * 1000000) / 100 + 10,
          type: isIncome ? 'income' : 'expense',
          category: category.name,
          description: `Sample ${isIncome ? 'income' : 'expense'} - ${category.name}`,
          transaction_date: transactionDate.toISOString(),
          is_shared: Math.random() > 0.7,
          tags: ['sample', 'seeder', category.name.toLowerCase().replace(' ', '-')]
        });
      }
    }
    
    // Insert transactions in chunks to avoid request size limitations
    const chunkSize = 20;
    for (let i = 0; i < transactions.length; i += chunkSize) {
      const chunk = transactions.slice(i, i + chunkSize);
      
      const { data, error } = await supabase
        .from('transactions')
        .insert(chunk);
        
      if (error) {
        console.error(`Error inserting transaction chunk ${i/chunkSize + 1}:`, error);
        throw error;
      }
    }

    console.log(`Successfully seeded ${transactions.length} transactions`);
    return { count: transactions.length };
  } catch (error) {
    console.error('Error in transaction seeder:', error);
    throw error;
  }
};

// Execute if this script is run directly
if (require.main === module) {
  seedTransactions()
    .then(() => {
      console.log('Transaction seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Transaction seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedTransactions;