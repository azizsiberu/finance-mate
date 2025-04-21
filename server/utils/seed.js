const categorySeeder = require('./seeders/categorySeeder');
const path = require('path');
const fs = require('fs');

/**
 * Run all seeders
 */
const runSeeders = async () => {
  console.log('Running all seeders');

  try {
    // Run specific seeders
    await categorySeeder();
    
    // Add more seeders here as they are developed
    // await userSeeder();
    // await transactionSeeder();
    // etc.

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