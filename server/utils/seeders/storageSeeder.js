/**
 * Storage Seeder - Upload test files to Supabase Storage
 * 
 * This script uploads test files to Supabase Storage to verify configuration and access.
 * 
 * Usage:
 * node storageSeeder.js
 */

const fs = require('fs');
const path = require('path');
const { uploadFile } = require('../storage');

// Path to the logo files
const logoPath = path.join(__dirname, '../../../client/src/assets/finance-mate-logo.webp');
const logoPathNoBg = path.join(__dirname, '../../../client/src/assets/finance-mate-logo-no-bg.webp');

/**
 * Upload test files to various folders in the storage bucket
 */
async function seedStorage() {
  try {
    console.log('Starting storage seeding...');
    
    // Read logo files
    console.log(`Reading logo from ${logoPath}...`);
    const logoBuffer = fs.readFileSync(logoPath);
    const logoNoBgBuffer = fs.readFileSync(logoPathNoBg);
    
    console.log('Files loaded successfully. Starting upload...');
    
    // Upload test files to different folders
    const results = await Promise.all([
      // Profile test
      uploadFile(
        logoBuffer, 
        'profiles/test-profile-picture.webp', 
        'image/webp'
      ).then(url => ({ path: 'profiles/test-profile-picture.webp', url })),
      
      // Goal test
      uploadFile(
        logoNoBgBuffer, 
        'goals/test-goal-image.webp', 
        'image/webp'
      ).then(url => ({ path: 'goals/test-goal-image.webp', url })),
      
      // Transaction test
      uploadFile(
        logoBuffer, 
        'transactions/test-receipt.webp', 
        'image/webp'
      ).then(url => ({ path: 'transactions/test-receipt.webp', url }))
    ]);
    
    console.log('Storage seeding completed successfully!');
    console.log('Uploaded files:');
    results.forEach(result => {
      console.log(`- ${result.path}: ${result.url}`);
    });
    
    return results;
  } catch (error) {
    console.error('Error seeding storage:', error);
    throw error;
  }
}

// Execute if script is run directly
if (require.main === module) {
  seedStorage()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Storage seeding failed:', err);
      process.exit(1);
    });
}

module.exports = seedStorage;