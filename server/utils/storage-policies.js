/**
 * Supabase Storage Policies untuk FinanceMate
 * 
 * Panduan untuk membuat policies di Supabase Storage melalui UI
 */

/**
 * Cara Membuat Storage Policies di Supabase
 * 
 * 1. Login ke dashboard Supabase
 * 2. Pilih project Anda
 * 3. Pilih menu "Storage" di sidebar
 * 4. Pilih atau buat bucket "financemate"
 * 5. Pilih tab "Policies"
 * 6. Klik tombol "Add Policy"
 * 7. Pilih template policy yang sesuai
 * 8. Sesuaikan policy sesuai kebutuhan
 */

/**
 * Policy yang direkomendasikan untuk bucket "financemate"
 */

const storagePoliciesGuide = `
# PANDUAN POLICY SUPABASE STORAGE

## 1. FOLDER PUBLIC (AKSES UNTUK SEMUA PENGGUNA)

Pilih template: "Allow access to files in a folder to anonymous users"
- Policy Type: Select
- Allowed operation: SELECT
- Role: PUBLIC (Everyone)
- Prefix (folder): public/

## 2. FOLDER PROFILES (FOTO PROFIL)

### Policy 1: Mengizinkan semua user yang login melihat foto profil
Pilih template: "Give users access to a folder only to authenticated users"
- Policy Type: Select
- Allowed operation: SELECT
- Role: authenticated
- Prefix (folder): profiles/

### Policy 2: Mengizinkan user mengupload foto profil mereka sendiri
Pilih template: "Custom"
- Policy Name: Users can upload their own profile pictures
- Policy Type: INSERT
- Role: authenticated
- Policy definition: 
  storage.foldername(name)[1] = 'profiles' AND name ~ concat('profiles/', auth.uid(), '.*')

### Policy 3: Mengizinkan user menghapus foto profil mereka sendiri
Pilih template: "Custom"
- Policy Name: Users can delete their own profile pictures
- Policy Type: DELETE
- Role: authenticated
- Policy definition:
  storage.foldername(name)[1] = 'profiles' AND name ~ concat('profiles/', auth.uid(), '.*')

## 3. FOLDER GOALS (FILE TUJUAN KEUANGAN)

### Policy 1: Mengizinkan user melihat file goals mereka
Pilih template: "Custom"
- Policy Name: Users can view their own goals files
- Policy Type: SELECT
- Role: authenticated
- Policy definition: 
  storage.foldername(name)[1] = 'goals' AND 
  (
    name ~ concat('goals/', auth.uid(), '.*') OR
    name ~ concat('goals/shared_', auth.uid(), '.*')
  )

### Policy 2: Mengizinkan user mengupload file ke goals
Pilih template: "Give users access to a folder only to authenticated users"
- Policy Type: INSERT
- Allowed operation: INSERT
- Role: authenticated
- Prefix (folder): goals/

### Policy 3: Mengizinkan user menghapus file goals mereka
Pilih template: "Custom"
- Policy Name: Users can delete their own goals files
- Policy Type: DELETE
- Role: authenticated
- Policy definition:
  storage.foldername(name)[1] = 'goals' AND 
  (
    name ~ concat('goals/', auth.uid(), '.*') OR
    name ~ concat('goals/shared_', auth.uid(), '.*')
  )

## 4. FOLDER TRANSACTIONS (BUKTI TRANSAKSI)

### Policy 1: Mengizinkan user melihat file transaksi mereka
Pilih template: "Custom"
- Policy Name: Users can view their own transactions files
- Policy Type: SELECT
- Role: authenticated
- Policy definition:
  storage.foldername(name)[1] = 'transactions' AND 
  (
    name ~ concat('transactions/', auth.uid(), '.*') OR
    name ~ concat('transactions/shared_', auth.uid(), '.*')
  )

### Policy 2: Mengizinkan user mengupload file transaksi
Pilih template: "Give users access to a folder only to authenticated users"
- Policy Type: INSERT
- Allowed operation: INSERT
- Role: authenticated
- Prefix (folder): transactions/

### Policy 3: Mengizinkan user menghapus file transaksi mereka
Pilih template: "Custom"
- Policy Name: Users can delete their own transactions files
- Policy Type: DELETE
- Role: authenticated
- Policy definition:
  storage.foldername(name)[1] = 'transactions' AND 
  (
    name ~ concat('transactions/', auth.uid(), '.*') OR
    name ~ concat('transactions/shared_', auth.uid(), '.*')
  )
`;

// Tambahkan panduan tentang format penamaan file yang direkomendasikan
const fileNamingConvention = `
# FORMAT PENAMAAN FILE YANG DIREKOMENDASIKAN

## Foto Profil
- Format: profiles/{user_id}-{timestamp}.jpg
- Contoh: profiles/abc123-1650789012345.jpg

## File Tujuan Keuangan
- Format: goals/{user_id}-{goal_id}-{timestamp}.jpg
- Format untuk shared files: goals/shared_{user_id}-{goal_id}-{timestamp}.jpg
- Contoh: goals/abc123-goal001-1650789012345.jpg

## Bukti Transaksi
- Format: transactions/{user_id}-{transaction_id}-{timestamp}.jpg
- Format untuk shared files: transactions/shared_{user_id}-{transaction_id}-{timestamp}.jpg
- Contoh: transactions/abc123-tx001-1650789012345.jpg
`;

// Panduan cara menguji akses storage
const testingStorageAccess = `
# CARA MENGUJI AKSES STORAGE

1. Jalankan storage seeder untuk mengunggah file test:
   node server/utils/seeders/storageSeeder.js

2. Coba akses URL yang dihasilkan dari seeder
   - Tanpa login: seharusnya bisa mengakses file di folder public
   - Dengan login: seharusnya bisa mengakses file di folder profiles, goals, transactions

3. Gunakan endpoint API untuk mengupload file:
   - POST /users/upload-profile-picture untuk foto profil
   - POST /goals/:goalId/upload-file untuk file tujuan keuangan

4. Periksa apakah file yang diunggah memiliki akses yang tepat sesuai policy
`;

module.exports = {
  storagePoliciesGuide,
  fileNamingConvention,
  testingStorageAccess
};