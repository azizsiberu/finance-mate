# FinanceMate

![FinanceMate Logo](client/src/assets/finance-mate-logo.webp)

**FinanceMate** adalah aplikasi manajemen keuangan pribadi untuk pasangan muda yang komprehensif yang membantu Anda melacak pengeluaran, mengatur anggaran, mengelola langganan, dan mencapai tujuan keuangan Anda dengan mudah dan efisien.

## Fitur Utama

### Dashboard Keuangan Interaktif

- **Ringkasan Real-time**: Lihat saldo, arus kas, dan metrik keuangan utama dalam satu tampilan
- **Kartu Informasi Keuangan**: Widget yang menampilkan statistik penting seperti total pengeluaran, pendapatan, dan sisa anggaran
- **Grafik Interaktif**: Visualisasi tren keuangan harian, mingguan, dan bulanan
- **Indikator Kinerja Keuangan**: Metrik kesehatan keuangan yang mudah dipahami

### Manajemen Transaksi Lengkap

- **Pencatatan Cepat**: Tambahkan transaksi baru dengan mudah melalui form yang intuitif
- **Kategorisasi Otomatis**: Sistem cerdas yang mengkategorikan transaksi berdasarkan pola sebelumnya
- **Import/Export Data**: Dukung impor dari CSV bank dan ekspor data untuk laporan
- **Filter & Pencarian**: Temukan transaksi dengan cepat menggunakan filter kategori, tanggal, jumlah, dll
- **Split Transaksi**: Kemampuan untuk membagi satu transaksi ke beberapa kategori berbeda

### Pengelolaan Anggaran yang Fleksibel

- **Anggaran per Kategori**: Tetapkan batas pengeluaran untuk setiap kategori
- **Periode yang Dapat Disesuaikan**: Pilih anggaran mingguan, bulanan, atau kustom
- **Alert & Notifikasi**: Dapatkan peringatan saat mendekati atau melebihi batas anggaran
- **Analisis Varians**: Bandingkan anggaran vs aktual dengan grafik intuitif
- **Rollover Budget**: Opsi untuk mentransfer saldo anggaran yang tidak terpakai ke periode berikutnya

### Manajemen Langganan yang Cerdas

- **Pelacakan Otomatis**: Identifikasi dan lacak pembayaran berulang secara otomatis
- **Kalender Langganan**: Lihat jadwal pembayaran dalam tampilan kalender
- **Pengingat Jatuh Tempo**: Notifikasi sebelum tanggal pembayaran
- **Analisis Nilai**: Evaluasi pemanfaatan layanan berlangganan
- **Rekomendasi Penghematan**: Saran untuk mengoptimalkan biaya langganan

### Tujuan Keuangan & Tabungan

- **Penetapan Tujuan**: Buat tujuan keuangan dengan target jumlah dan tenggat waktu
- **Progress Visual**: Lihat kemajuan tujuan dengan indikator persentase dan grafik
- **Strategi Pendanaan**: Alokasikan dana secara otomatis ke tujuan dari pendapatan
- **Milestone & Perayaan**: Tandai pencapaian penting dalam perjalanan keuangan
- **Proyeksi Pencapaian**: Prediksi kapan tujuan keuangan akan tercapai berdasarkan pola tabungan

### Analisis & Wawasan Keuangan

- **Laporan Komprehensif**: Laporan pendapatan/pengeluaran, arus kas, dan nilai bersih
- **Tren Pengeluaran**: Analisis pola belanja dari waktu ke waktu
- **Prediksi Keuangan**: Perkiraan pendapatan dan pengeluaran masa depan
- **Perbandingan Periode**: Bandingkan kinerja keuangan antar bulan atau tahun
- **Insight Keuangan**: Tips dan saran berdasarkan pola keuangan Anda

### Keamanan & Privasi

- **Enkripsi End-to-End**: Perlindungan data keuangan yang ketat
- **Autentikasi Multi-faktor**: Lapisan keamanan tambahan untuk akun Anda
- **Sinkronisasi Aman**: Integrasi yang aman dengan rekening bank melalui API
- **Akses Terautentikasi**: Kontrol siapa yang dapat melihat informasi keuangan Anda
- **Kebijakan No-Logging**: Data transaksi sensitif tidak pernah disimpan di server

## Teknologi yang Digunakan

### Frontend

- **React 19**: Library JavaScript untuk membangun antarmuka pengguna
- **TypeScript**: Pengetikan statis untuk pengembangan yang lebih aman
- **Material UI versi 7**: Framework komponen UI modern
- **React Router 7**: Navigasi halaman yang seamless
- **Chart.js & React-chartjs-2**: Visualisasi data interaktif
- **Axios**: Klien HTTP untuk API requests

### Backend

- **Node.js**: Runtime JavaScript untuk server
- **Express.js**: Framework web yang cepat dan minimal
- **Supabase**: Platform backend-as-a-service dengan PostgreSQL
- **JWT**: JSON Web Tokens untuk autentikasi
- **Swagger/OpenAPI**: Dokumentasi API yang interaktif
- **Joi**: Validasi data skema

### Database & Penyimpanan

- **PostgreSQL**: Database relasional yang kuat melalui Supabase
- **Supabase Storage**: Penyimpanan file untuk lampiran dan bukti transaksi

## Arsitektur Aplikasi

FinanceMate menggunakan arsitektur microservice dengan:

- **Frontend SPA**: Aplikasi halaman tunggal React yang berkomunikasi dengan API
- **RESTful API**: Backend Express yang menyediakan endpoints untuk CRUD
- **Supabase Integration**: Lapisan database dan autentikasi
- **Realtime Updates**: Pembaruan live menggunakan fitur realtime Supabase

## Struktur Proyek

```
finance-mate/
├── client/            # Frontend React.js
│   ├── public/        # File statis
│   ├── src/           # Kode sumber frontend
│   │   ├── assets/    # Gambar, font dan file statis lainnya
│   │   ├── components/# Komponen React yang dapat digunakan kembali
│   │   ├── config/    # Konfigurasi aplikasi dan variabel
│   │   ├── contexts/  # React Context untuk state management
│   │   ├── hooks/     # Custom React hooks
│   │   ├── pages/     # Komponen halaman utama
│   │   ├── services/  # Layanan API dan integrasi pihak ketiga
│   │   └── utils/     # Fungsi dan utilitas pembantu
│   └── README.md      # Dokumentasi frontend
├── server/            # Backend Node.js/Express
│   ├── config/        # Konfigurasi
│   ├── controllers/   # Pengendali API
│   ├── middlewares/   # Middleware Express
│   ├── models/        # Model data
│   ├── routes/        # Rute API
│   ├── utils/         # Fungsi utilitas, migrasi, seeder
│   └── README.md      # Dokumentasi backend
└── README.md          # Dokumentasi utama (file ini)
```

## Flow Penggunaan Aplikasi

1. **Onboarding**: Pengguna mendaftar dan mengisi data profil keuangan dasar
2. **Koneksi Akun**: Opsional menghubungkan dengan akun bank atau import data
3. **Setup Anggaran**: Pengguna membuat anggaran awal untuk kategori utama
4. **Pelacakan Harian**: Mencatat transaksi dan melihat status keuangan di dashboard
5. **Perencanaan Tujuan**: Menetapkan tujuan keuangan jangka pendek dan panjang
6. **Analisis Berkala**: Melihat laporan dan wawasan untuk mengoptimalkan keuangan

## Memulai

### Prasyarat

- Node.js v14+
- npm atau yarn
- Akun Supabase

### Menjalankan Aplikasi Lengkap

1. **Set up backend**

```bash
cd server
npm install
# Buat file .env berdasarkan contoh di server/README.md
npm run dev
```

2. **Set up frontend**

```bash
cd client
npm install
# Buat file .env berdasarkan contoh di client/README.md
npm start
```

Frontend akan berjalan di http://localhost:3000 dan backend di http://localhost:5000

### Konfigurasi Lingkungan

#### Frontend (.env.local):

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Backend (.env):

```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
```

## Deployment

### Frontend

Silakan lihat [Frontend Deployment](client/README.md) untuk petunjuk lengkap deploy ke:

- Netlify
- Vercel
- Firebase Hosting

### Backend

Silakan lihat [Backend Deployment](server/README.md) untuk petunjuk lengkap deploy ke:

- Heroku
- Railway
- DigitalOcean App Platform

## Roadmap Fitur

- [ ] **Integrasi API Bank**: Koneksi langsung dengan rekening bank utama di Indonesia
- [ ] **Mobile App**: Versi Android dan iOS dari FinanceMate
- [ ] **Mode Keluarga**: Fitur berbagi dan manajemen keuangan untuk rumah tangga
- [ ] **Financial Advisor AI**: Rekomendasi dan saran berbasis AI
- [ ] **Pelacakan Investasi**: Integrasi dengan saham, reksa dana, dan kripto
- [ ] **Ekspor Pajak**: Bantuan persiapan laporan untuk keperluan pajak

## Kontribusi

Kami sangat terbuka dengan kontribusi! Silakan fork repositori ini, buat branch fitur/perbaikan, dan kirimkan pull request.

1. Fork repositori
2. Buat branch fitur (`git checkout -b fitur/amazing`)
3. Commit perubahan (`git commit -m 'Menambahkan fitur amazing'`)
4. Push ke branch (`git push origin fitur/amazing`)
5. Buka Pull Request

## Lisensi

[MIT](LICENSE)

## Kontak & Dukungan

- **Email**: [email@financemateapp.com](mailto:email@financemateapp.com)
- **Issues**: Buka issue di GitHub untuk bug dan permintaan fitur
- **Discord**: Bergabunglah dengan komunitas kami di [Discord FinanceMate](https://discord.gg/financematecommunity)
- **Twitter**: [@FinanceMateApp](https://twitter.com/financemateapp)
