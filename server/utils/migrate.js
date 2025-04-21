const fs = require('fs');
const path = require('path');

/**
 * Run all migrations
 * @param {string} direction - 'up' or 'down'
 */
const runMigrations = async (direction = 'up') => {
  if (direction !== 'up' && direction !== 'down') {
    throw new Error("Direction must be 'up' or 'down'");
  }

  console.log(`Running migrations: ${direction}`);

  // Get all migration files
  const migrationsDir = path.join(__dirname, 'migrations');
  let migrationFiles;
  
  try {
    migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js'))
      .sort();
  } catch (err) {
    console.error('Error reading migrations directory:', err);
    process.exit(1);
  }

  // For 'down' migrations, reverse the order
  if (direction === 'down') {
    migrationFiles.reverse();
  }

  // Run each migration
  for (const file of migrationFiles) {
    try {
      const migration = require(path.join(migrationsDir, file));
      
      console.log(`Running migration: ${file}`);
      await migration[direction]();
      console.log(`Completed migration: ${file}`);
    } catch (err) {
      console.error(`Error running migration ${file}:`, err);
      process.exit(1);
    }
  }

  console.log('All migrations completed successfully!');
};

// Run migrations based on command line argument
if (require.main === module) {
  const direction = process.argv[2] || 'up';
  runMigrations(direction)
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Migration error:', err);
      process.exit(1);
    });
}

module.exports = runMigrations;