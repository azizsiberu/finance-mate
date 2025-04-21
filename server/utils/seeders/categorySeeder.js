const supabase = require('../../config/supabase');
const { ApiError } = require('../../middlewares/errorHandler');

/**
 * Seed categories table with default categories
 */
const seedCategories = async () => {
  console.log('Seeding categories...');

  // Default categories
  const defaultCategories = [
    { name: 'Food & Drinks', type: 'expense', icon: 'food', color: '#FF5733' },
    { name: 'Shopping', type: 'expense', icon: 'shopping', color: '#33A8FF' },
    { name: 'Housing', type: 'expense', icon: 'home', color: '#33FF57' },
    { name: 'Transportation', type: 'expense', icon: 'car', color: '#FF33A8' },
    { name: 'Vehicle', type: 'expense', icon: 'car', color: '#8B33FF' },
    { name: 'Entertainment', type: 'expense', icon: 'entertainment', color: '#33FFF1' },
    { name: 'Communication', type: 'expense', icon: 'phone', color: '#F1FF33' },
    { name: 'Financial', type: 'expense', icon: 'bank', color: '#FF8B33' },
    { name: 'Investments', type: 'expense', icon: 'chart', color: '#337BFF' },
    { name: 'Income', type: 'income', icon: 'money', color: '#33FF7B' },
    { name: 'Gifts', type: 'income', icon: 'gift', color: '#FF337B' },
    { name: 'Salary', type: 'income', icon: 'salary', color: '#7BFF33' },
    { name: 'Loans', type: 'income', icon: 'loan', color: '#7B33FF' },
    { name: 'Grants', type: 'income', icon: 'grant', color: '#FF7B33' }
  ];

  try {
    // Check if categories already exist to avoid duplicates
    const { data: existingCategories, error: checkError } = await supabase
      .from('categories')
      .select('name');

    if (checkError) {
      throw new ApiError(500, 'Error checking existing categories: ' + checkError.message);
    }

    const existingNames = existingCategories.map(cat => cat.name);
    
    // Filter out categories that already exist
    const categoriesToInsert = defaultCategories.filter(cat => !existingNames.includes(cat.name));

    if (categoriesToInsert.length === 0) {
      console.log('All default categories already exist. No new categories seeded.');
      return;
    }

    // Insert new categories
    const { data, error } = await supabase
      .from('categories')
      .insert(categoriesToInsert);

    if (error) {
      throw new ApiError(500, 'Error seeding categories: ' + error.message);
    }

    console.log(`Successfully seeded ${categoriesToInsert.length} categories`);
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedCategories()
    .then(() => {
      console.log('Category seeding completed.');
      process.exit(0);
    })
    .catch(err => {
      console.error('Category seeding failed:', err);
      process.exit(1);
    });
}

module.exports = seedCategories;