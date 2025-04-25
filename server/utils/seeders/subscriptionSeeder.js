/**
 * Subscription Seeder
 * Seeds the subscriptions table with sample data
 */
const supabase = require('../../config/supabase');

/**
 * Seed subscriptions table with sample data
 */
const seedSubscriptions = async () => {
  try {
    console.log('Seeding subscriptions table...');

    // Check if subscriptions already exist
    const { data: existingSubscriptions, error: checkError } = await supabase
      .from('subscriptions')
      .select('count')
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing subscriptions:', checkError);
      return;
    }

    if (existingSubscriptions && existingSubscriptions.count > 0) {
      console.log(`Found ${existingSubscriptions.count} existing subscriptions, skipping seed.`);
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
    
    console.log(`Creating subscriptions for users: ${users[0].email}${users.length > 1 ? ' and ' + users[1].email : ''}`);

    // Current date for reference
    const currentDate = new Date();
    const startDate = new Date();
    
    // Sample subscriptions data
    const sampleSubscriptions = [
      // User 1 subscriptions
      {
        user_id: user1Id,
        name: 'Netflix',
        amount: 149000,
        billing_cycle: 'monthly',
        category: 'Entertainment',
        description: 'Netflix Subscription',
        start_date: startDate.toISOString(),
        next_billing_date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 15).toISOString(),
        reminder_days: 3,
        status: 'active',
        is_shared: false
      },
      {
        user_id: user1Id,
        name: 'Spotify',
        amount: 59000,
        billing_cycle: 'monthly',
        category: 'Entertainment',
        description: 'Spotify Premium Family Plan',
        start_date: startDate.toISOString(),
        next_billing_date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 5).toISOString(),
        reminder_days: 2,
        status: 'active',
        is_shared: true
      },
      {
        user_id: user1Id,
        name: 'Gym Membership',
        amount: 350000,
        billing_cycle: 'monthly',
        category: 'Health & Fitness',
        description: 'Monthly gym membership at FitnessFusion',
        start_date: startDate.toISOString(),
        next_billing_date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1).toISOString(),
        reminder_days: 5,
        status: 'active',
        is_shared: false
      },
      // User 2 subscriptions (if a second user exists)
      {
        user_id: user2Id,
        name: 'Disney+',
        amount: 39900,
        billing_cycle: 'monthly',
        category: 'Entertainment',
        description: 'Disney+ Subscription',
        start_date: startDate.toISOString(),
        next_billing_date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 20).toISOString(),
        reminder_days: 3,
        status: 'active',
        is_shared: false
      },
      {
        user_id: user2Id,
        name: 'Adobe Creative Cloud',
        amount: 1500000,
        billing_cycle: 'yearly',
        category: 'Software',
        description: 'Adobe Creative Cloud Complete Plan',
        start_date: startDate.toISOString(),
        next_billing_date: new Date(currentDate.getFullYear() + 1, 3, 10).toISOString(),
        reminder_days: 14,
        status: 'active',
        is_shared: false
      },
      {
        user_id: user2Id,
        name: 'Domain & Hosting',
        amount: 750000,
        billing_cycle: 'yearly',
        category: 'Business',
        description: 'Personal website domain and hosting',
        start_date: startDate.toISOString(),
        next_billing_date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 6, 22).toISOString(),
        reminder_days: 14,
        status: 'active',
        is_shared: false
      }
    ];

    // Insert subscriptions
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(sampleSubscriptions)
      .select();

    if (error) {
      console.error('Error seeding subscriptions:', error);
      throw error;
    }

    console.log(`Successfully seeded ${data.length} subscriptions`);
    return data;
  } catch (error) {
    console.error('Error in subscription seeder:', error);
    throw error;
  }
};

// Execute if this script is run directly
if (require.main === module) {
  seedSubscriptions()
    .then(() => {
      console.log('Subscription seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Subscription seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedSubscriptions;