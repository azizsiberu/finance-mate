# FinanceMate - Frontend

Frontend aplikasi web FinanceMate, dikembangkan dengan React dan TypeScript.

![FinanceMate Dashboard](src/assets/dashboard-preview.png)

## Teknologi Utama

- React 18
- TypeScript
- React Router
- Axios
- Recharts (visualisasi data)
- Material UI versi 7

Contoh penggunaan Grid di material ui versi 7
import \* as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
backgroundColor: '#fff',
...theme.typography.body2,
padding: theme.spacing(1),
textAlign: 'center',
color: (theme.vars ?? theme).palette.text.secondary,
...theme.applyStyles('dark', {
backgroundColor: '#1A2027',
}),
}));

export default function FullWidthGrid() {
return (
<Box sx={{ flexGrow: 1 }}>
<Grid container spacing={2}>
<Grid size={{ xs: 6, md: 8 }}>
<Item>xs=6 md=8</Item>
</Grid>
<Grid size={{ xs: 6, md: 4 }}>
<Item>xs=6 md=4</Item>
</Grid>
<Grid size={{ xs: 6, md: 4 }}>
<Item>xs=6 md=4</Item>
</Grid>
<Grid size={{ xs: 6, md: 8 }}>
<Item>xs=6 md=8</Item>
</Grid>
</Grid>
</Box>
);
}

## Struktur Folder

```
src/
├── assets/         # Gambar, font, dan file statis lainnya
├── components/     # Komponen React yang dapat digunakan kembali
├── config/         # Konfigurasi aplikasi dan variabel
├── contexts/       # React Context untuk state management
├── hooks/          # Custom React hooks
├── pages/          # Komponen halaman utama
├── services/       # Layanan API dan integrasi pihak ketiga
└── utils/          # Fungsi dan utilitas pembantu
```

## Memulai untuk Pengembangan

### Prasyarat

- Node.js 14+ dan npm/yarn
- Backend FinanceMate berjalan (lihat ../server/README.md)

### Instalasi

1. Clone repositori dan arahkan ke folder client:

```bash
git clone https://github.com/username/finance-mate.git
cd finance-mate/client
```

2. Install dependensi:

```bash
npm install
# atau
yarn
```

3. Buat file `.env.local` dan konfigurasikan variabel lingkungan:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Jalankan server pengembangan:

```bash
npm start
# atau
yarn start
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000).

## Membangun untuk Produksi

```bash
npm run build
# atau
yarn build
```

File statis akan dibuat di folder `build/` dan siap untuk di-deploy ke layanan hosting statis seperti Netlify, Vercel, atau Firebase Hosting.

## Pengujian

```bash
# Menjalankan test
npm test
# atau
yarn test

# Menjalankan test dengan laporan cakupan
npm test -- --coverage
# atau
yarn test --coverage
```

## Fitur Frontend

- **Dashboard Interaktif**: Ringkasan visual keuangan dengan statistik utama
- **Manajemen Transaksi**: Tambah, edit, dan filter transaksi
- **Visualisasi Data**: Grafik dan bagan untuk pengeluaran dan pendapatan
- **Pengaturan Anggaran**: Buat dan kelola anggaran untuk berbagai kategori
- **Pelacakan Tujuan**: Set dan pantau tujuan keuangan
- **Pengingat Langganan**: Kelola dan dapatkan notifikasi untuk langganan
- **Tema Terang/Gelap**: Dukungan untuk preferensi visual pengguna
- **Responsif**: Tampilan yang dioptimalkan untuk desktop dan mobile

## Deployment

FinanceMate frontend dapat di-deploy ke berbagai layanan hosting:

### Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

### Vercel

```bash
npm install -g vercel
vercel
```

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy --only hosting
```

## Lisensi

[MIT](../LICENSE)
