# WhatsApp Bot PPOB & Downloader

Bot WhatsApp multifungsi dengan fitur lengkap untuk PPOB, Downloader, Store, dan lainnya.

## 🌟 Fitur Utama

### 💰 PPOB (Payment Point Online Bank)
- ✅ Pembelian Pulsa
- ✅ Paket Data
- ✅ Token PLN
- ✅ Top Up E-Money (GoPay, OVO, DANA, ShopeePay)
- ✅ Cek Harga Produk

### 📥 Downloader
- ✅ TikTok (No Watermark)
- ✅ Instagram (Photo & Video)
- ✅ YouTube (MP3 & MP4)
- ✅ Facebook
- ✅ Twitter/X

### 🏪 Store Menu
- ✅ Tambah/Hapus Produk
- ✅ List Produk
- ✅ Order Produk
- ✅ Manajemen Stok

### 🎨 Sticker Maker
- ✅ Sticker dari Gambar
- ✅ Sticker dari Video (Animated)
- ✅ Auto Resize & Convert

### 👑 Owner Menu
- ✅ Set Mode (Public/Self)
- ✅ Broadcast Message
- ✅ Add/Delete Owner
- ✅ Block/Unblock User

### 📸 Auto RVO (Read View Once)
- ✅ Otomatis screenshot foto/video yang dikirim 1x lihat
- ✅ Kirim ulang tanpa view once

## 📋 Persyaratan

### Untuk Termux (Android)
```bash
pkg update && pkg upgrade
pkg install nodejs git ffmpeg
```

### Untuk VPS/Server Linux
```bash
sudo apt update && sudo apt upgrade
sudo apt install nodejs npm git ffmpeg
```

### Untuk Panel Pterodactyl
- Node.js 18.x atau lebih baru
- Memory minimal 512MB
- Storage minimal 1GB

## 🚀 Instalasi

### 1. Clone Repository
```bash
git clone <repository-url>
cd whatsapp-bot-ppob
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Konfigurasi Bot
Edit file `bot-config.js`:
```javascript
owner: {
    name: 'Owner Bot',
    number: '6281234567890', // Ganti dengan nomor owner
    numbers: ['6281234567890']
},

bot: {
    name: 'WhatsApp Bot',
    prefix: '.',
    mode: 'public', // 'public' atau 'self'
},

ppob: {
    enabled: true,
    apiKey: 'YOUR_PPOB_API_KEY', // Ganti dengan API Key PPOB
    apiUrl: 'https://api.digiflazz.com/v1',
    username: 'YOUR_USERNAME',
}
```

### 4. Jalankan Bot
```bash
npm start
```

### 5. Scan QR Code
Scan QR code yang muncul di terminal menggunakan WhatsApp Anda.

## 📱 Cara Penggunaan

### Menu Utama
```
.menu atau .help
```

### PPOB
```
.pulsa 081234567890 10000
.paketdata 081234567890 TSEL5GB
.pln 12345678901 50000
.emoney gopay 081234567890 50000
.cekppob
```

### Downloader
```
.tiktok <url>
.instagram <url>
.youtube <url>
.ytmp3 <url>
.ytmp4 <url>
.facebook <url>
.twitter <url>
```

### Store
```
.store
.listproduk
.order PROD001
.addproduk PROD001 NamaProduk 50000 10 Deskripsi (owner only)
.delproduk PROD001 (owner only)
```

### Sticker
```
Reply gambar/video dengan:
.sticker atau .s
```

### Owner Menu
```
.setmode public/self
.broadcast <pesan>
.addowner 6281234567890
.delowner 6281234567890
.block 6281234567890
.unblock 6281234567890
```

## 🔧 Instalasi di Termux

### 1. Install Termux
Download Termux dari F-Droid atau GitHub

### 2. Setup Termux
```bash
termux-setup-storage
pkg update && pkg upgrade
pkg install nodejs git ffmpeg
```

### 3. Clone & Install
```bash
git clone <repository-url>
cd whatsapp-bot-ppob
npm install
```

### 4. Jalankan Bot
```bash
npm start
```

### Tips Termux:
- Gunakan `termux-wake-lock` agar bot tetap berjalan
- Jangan tutup aplikasi Termux
- Gunakan `screen` atau `tmux` untuk background process

## 🐳 Instalasi di Panel Pterodactyl

### 1. Buat Server Baru
- Pilih Node.js Egg
- Alokasi minimal 512MB RAM
- Storage minimal 1GB

### 2. Upload Files
Upload semua file bot ke server

### 3. Install Dependencies
```bash
npm install
```

### 4. Konfigurasi Startup
Set startup command:
```bash
npm start
```

### 5. Start Server
Klik tombol Start di panel

### Tips Pterodactyl:
- Pastikan port sudah dialokasikan
- Monitor penggunaan RAM
- Backup auth_info secara berkala

## 🔐 Keamanan

1. **Jangan share file `auth_info`** - Berisi session WhatsApp Anda
2. **Ganti nomor owner** di `bot-config.js`
3. **Simpan API Key dengan aman**
4. **Gunakan mode `self`** jika ingin bot hanya merespon owner
5. **Backup database** secara berkala

## 🛠️ Troubleshooting

### Bot tidak merespon
- Cek koneksi internet
- Pastikan bot sudah scan QR code
- Cek mode bot (public/self)

### Error saat install
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Sticker tidak bisa dibuat
```bash
# Install ffmpeg
pkg install ffmpeg  # Termux
sudo apt install ffmpeg  # Linux/VPS
```

### PPOB tidak berfungsi
- Cek API Key di `bot-config.js`
- Pastikan saldo API mencukupi
- Cek koneksi ke API provider

## 📝 Integrasi API PPOB

Bot ini support berbagai provider PPOB:
- DigiFlazz
- VIP Reseller
- Paydisini
- Dan lainnya

Edit `bot-config.js` dan `commands/ppob.js` untuk integrasi API.

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buat Pull Request.

## 📄 Lisensi

MIT License

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat Issue di repository ini.

## ⚠️ Disclaimer

Bot ini hanya untuk tujuan edukasi. Penggunaan untuk tujuan ilegal adalah tanggung jawab pengguna.

---

© 2024 WhatsApp Bot PPOB & Downloader
