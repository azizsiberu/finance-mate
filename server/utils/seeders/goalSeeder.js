/**
 * Goal Seeder
 * Seeds the goals table with sample data
 */
const supabase = require('../../config/supabase');

/**
 * Seed goals table with sample data
 */
const seedGoals = async () => {
  try {
    console.log('Seeding goals table...');

    // Check if goals already exist
    const { data: existingGoals, error: checkError } = await supabase
      .from('goals')
      .select('count')
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing goals:', checkError);
      return;
    }

    if (existingGoals && existingGoals.count > 0) {
      console.log(`Found ${existingGoals.count} existing goals, skipping seed.`);
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
    
    console.log(`Creating goals for users: ${users[0].email}${users.length > 1 ? ' and ' + users[1].email : ''}`);

    // Define goal categories
    const goalCategories = ['Savings', 'Emergency Fund', 'Investment', 'Travel', 'Education', 'Home', 'Vehicle', 'Wedding', 'Retirement'];

    // Current date for reference
    const currentDate = new Date();
    
    // Sample goals data
    const sampleGoals = [
      // User 1 goals
      {
        user_id: user1Id,
        name: 'Emergency Fund',
        target_amount: 50000000,
        current_amount: 15000000,
        target_date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 6, 1).toISOString(),
        description: 'Build an emergency fund to cover 6 months of expenses',
        category: 'Emergency Fund',
        priority: 'high',
        status: 'in_progress'
      },
      {
        user_id: user1Id,
        name: 'Dream Vacation',
        target_amount: 25000000,
        current_amount: 5000000,
        target_date: new Date(currentDate.getFullYear() + 1, 5, 15).toISOString(),
        description: 'Saving for a dream vacation to Japan',
        category: 'Travel',
        priority: 'medium',
        status: 'in_progress'
      },
      {
        user_id: user1Id,
        name: 'New Laptop',
        target_amount: 15000000,
        current_amount: 15000000,
        target_date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 15).toISOString(),
        description: 'Saving for a new MacBook Pro',
        category: 'Education',
        priority: 'low',
        status: 'achieved'
      },
      // User 2 goals (if a second user exists)
      {
        user_id: user2Id,
        name: 'House Down Payment',
        target_amount: 150000000,
        current_amount: 50000000,
        target_date: new Date(currentDate.getFullYear() + 2, 3, 1).toISOString(),
        description: 'Saving for a down payment on a house',
        category: 'Home',
        priority: 'high',
        status: 'in_progress'
      },
      {
        user_id: user2Id,
        name: 'Investment Portfolio',
        target_amount: 100000000,
        current_amount: 35000000,
        target_date: new Date(currentDate.getFullYear() + 3, 8, 30).toISOString(),
        description: 'Building an investment portfolio for early retirement',
        category: 'Investment',
        priority: 'medium',
        status: 'in_progress'
      }
    ];

    // Insert goals
    const { data, error } = await supabase
      .from('goals')
      .insert(sampleGoals)
      .select();

    if (error) {
      console.error('Error seeding goals:', error);
      throw error;
    }

    console.log(`Successfully seeded ${data.length} goals`);
    return data;
  } catch (error) {
    console.error('Error in goal seeder:', error);
    throw error;
  }
};

// Execute if this script is run directly
if (require.main === module) {
  seedGoals()
    .then(() => {
      console.log('Goal seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Goal seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedGoals;