/**
 * Initialize Storage Folders Script
 * Script untuk membuat struktur folder dasar di Supabase Storage
 * 
 * Catatan: Pastikan Anda menggunakan service_role key di file .env
 * SUPABASE_URL=https://your-project.supabase.co
 * SUPABASE_KEY=your-service-role-key (service_role key, bukan anon key)
 * 
 * Run: node utils/seeders/initStorageFolders.js
 */

const fs = require('fs');
const path = require('path');
const supabase = require('../../config/supabase');

// Daftar folder yang akan dibuat di bucket storage
const folders = [
  'public',
  'profiles',
  'goals',
  'transactions'
];

/**
 * Fungsi untuk membuat folder di Supabase Storage
 * @param {string} bucketName - Nama bucket
 * @param {string} folderPath - Path folder yang akan dibuat
 */
async function createFolder(bucketName, folderPath) {
  try {
    // Buat file placeholder untuk folder
    const placeholderPath = path.join(__dirname, '.placeholder');
    fs.writeFileSync(placeholderPath, '# This is a placeholder file for folder structure');
    
    // Upload placeholder ke path folder di Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(`${folderPath}/.placeholder`, fs.readFileSync(placeholderPath), {
        contentType: 'text/plain',
        upsert: true
      });
      
    if (error) {
      console.error(`Error creating folder ${folderPath}:`, error.message);
    } else {
      console.log(`Folder ${folderPath} created successfully`);
    }
    
    // Hapus file placeholder lokal
    fs.unlinkSync(placeholderPath);
    
  } catch (error) {
    console.error(`Error creating folder ${folderPath}:`, error.message);
  }
}

/**
 * Fungsi utama untuk menginisialisasi semua folder di bucket
 */
async function initializeFolders() {
  const bucketName = 'financemate';
  
  console.log(`Initializing folders in bucket '${bucketName}'...`);
  
  try {
    // Cek apakah bucket sudah ada
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error checking buckets:', listError.message);
      console.log('\nKemungkinan penyebab error:');
      console.log('1. API key yang digunakan bukan service_role key');
      console.log('2. Pastikan menggunakan SUPABASE_KEY yang service_role di .env, bukan anon key');
      return;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    if (bucketExists) {
      console.log(`Bucket '${bucketName}' sudah ada. Langsung membuat folder...`);
    } else {
      console.log(`Bucket '${bucketName}' tidak ditemukan. Mencoba membuat bucket...`);
      try {
        const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
          public: false,
          fileSizeLimit: 50 * 1024 * 1024 // 50MB limit
        });
        
        if (createError) {
          console.error('Error creating bucket:', createError.message);
          console.log('\nBucket tidak dapat dibuat. Kemungkinan penyebab:');
          console.log('1. API key yang digunakan bukan service_role key');
          console.log('2. Bucket sudah ada tapi tidak dapat diakses dengan key yang digunakan');
          console.log('3. Anda tidak memiliki permission untuk membuat bucket');
          
          // Coba gunakan bucket yang sudah ada
          console.log('\nMencoba menggunakan bucket yang sudah ada...');
        } else {
          console.log(`Bucket '${bucketName}' berhasil dibuat.`);
        }
      } catch (err) {
        console.error('Exception creating bucket:', err);
      }
    }
    
    // Buat folder-folder
    console.log('Membuat struktur folder...');
    
    // Buat semua folder secara serial untuk menghindari masalah konkurensi
    for (const folder of folders) {
      await createFolder(bucketName, folder);
    }
    
    console.log('Inisialisasi folder selesai!');
    console.log('\nLangkah selanjutnya:');
    console.log('1. Buka Supabase dashboard dan verifikasi folder berhasil dibuat');
    console.log('2. Atur policy untuk setiap folder menggunakan panduan di storage-policies.js');
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Eksekusi fungsi jika script dijalankan langsung
if (require.main === module) {
  initializeFolders()
    .then(() => {
      console.log('Script selesai dijalankan.');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}

module.exports = initializeFolders;