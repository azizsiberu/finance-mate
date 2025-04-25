const categorySeeder = require('./seeders/categorySeeder');
const userSeeder = require('./seeders/userSeeder');
const transactionSeeder = require('./seeders/transactionSeeder');
const goalSeeder = require('./seeders/goalSeeder');
const budgetSeeder = require('./seeders/budgetSeeder');
const subscriptionSeeder = require('./seeders/subscriptionSeeder');
const path = require('path');
const fs = require('fs');

/**
 * Run all seeders
 */
const runSeeders = async () => {
  console.log('Running all seeders');

  try {
    // Run specific seeders in order
    // 1. Categories first as they're referenced by other tables
    await categorySeeder();
    
    // 2. Users second as they're referenced by all other tables
    await userSeeder();
    
    // 3. Transactions, goals, subscriptions, and budgets can be seeded in parallel
    await Promise.all([
      transactionSeeder(),
      goalSeeder(),
      subscriptionSeeder(),
      budgetSeeder()
    ]);

    console.log('All seeders completed successfully!');
  } catch (error) {
    console.error('Error running seeders:', error);
    process.exit(1);
  }
};

// Run seeders if called directly
if (require.main === module) {
  runSeeders()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Seeding error:', err);
      process.exit(1);
    });
}

module.exports = runSeeders;