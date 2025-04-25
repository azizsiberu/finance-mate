/**
 * User Seeder
 * Seeds the users table with sample data
 */
const supabase = require('../../config/supabase');
const bcrypt = require('bcryptjs');

/**
 * Seed users table with sample data
 */
const seedUsers = async () => {
  try {
    console.log('Seeding users table...');

    // Check if users already exist
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('count')
      .single();

    if (checkError) {
      console.error('Error checking existing users:', checkError);
      return;
    }

    if (existingUsers && existingUsers.count > 0) {
      console.log(`Found ${existingUsers.count} existing users, skipping seed.`);
      return;
    }

    // Hash passwords for sample users
    const salt = await bcrypt.genSalt(10);
    const passwordHash1 = await bcrypt.hash('Password123!', salt);
    const passwordHash2 = await bcrypt.hash('Password123!', salt);

    // Sample users data
    const sampleUsers = [
      {
        email: 'john.doe@example.com',
        password: passwordHash1,
        first_name: 'John',
        last_name: 'Doe',
        currency: 'USD',
        language: 'en',
        theme: 'light'
      },
      {
        email: 'jane.smith@example.com',
        password: passwordHash2,
        first_name: 'Jane',
        last_name: 'Smith',
        currency: 'IDR',
        language: 'id',
        theme: 'dark'
      }
    ];

    // Insert sample users
    const { data, error } = await supabase
      .from('users')
      .insert(sampleUsers)
      .select();

    if (error) {
      console.error('Error seeding users:', error);
      throw error;
    }

    console.log(`Successfully seeded ${data.length} users`);
    return data;
  } catch (error) {
    console.error('Error in user seeder:', error);
    throw error;
  }
};

// Execute if this script is run directly
if (require.main === module) {
  seedUsers()
    .then(() => {
      console.log('User seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('User seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedUsers;