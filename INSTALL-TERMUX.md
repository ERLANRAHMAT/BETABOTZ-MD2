# 📱 Panduan Instalasi Bot WhatsApp di Termux

Panduan lengkap untuk menjalankan WhatsApp Bot di Termux (Android).

## 📋 Persyaratan

- Android 7.0 atau lebih baru
- Termux (Download dari F-Droid atau GitHub)
- Koneksi internet stabil
- Minimal 2GB RAM
- Storage kosong minimal 1GB

## 🚀 Langkah Instalasi

### 1. Install Termux

Download Termux dari salah satu sumber berikut:
- **F-Droid** (Recommended): https://f-droid.org/packages/com.termux/
- **GitHub**: https://github.com/termux/termux-app/releases

⚠️ **JANGAN** download dari Google Play Store (versi lama dan tidak di-update)

### 2. Setup Termux

Buka Termux dan jalankan perintah berikut:

```bash
# Izinkan akses storage
termux-setup-storage

# Update package list
pkg update && pkg upgrade -y

# Install dependencies
pkg install nodejs git ffmpeg -y
```

Tekan `Y` atau `Enter` jika diminta konfirmasi.

### 3. Clone Repository

```bash
# Pindah ke folder storage (opsional)
cd /sdcard

# Clone repository
git clone https://github.com/yourusername/whatsapp-bot-ppob.git

# Masuk ke folder bot
cd whatsapp-bot-ppob
```

Atau jika tidak menggunakan git, download ZIP dan extract ke folder Termux.

### 4. Install Dependencies Bot

```bash
# Install semua package yang dibutuhkan
npm install
```

Proses ini membutuhkan waktu 5-10 menit tergantung koneksi internet.

### 5. Konfigurasi Bot

Edit file konfigurasi menggunakan nano:

```bash
nano bot-config.js
```

Ubah bagian berikut:
```javascript
owner: {
    name: 'Nama Anda',
    number: '6281234567890', // Ganti dengan nomor WA Anda
    numbers: ['6281234567890']
},
```

**Cara menggunakan nano:**
- Edit text seperti biasa
- Tekan `Ctrl + X` untuk keluar
- Tekan `Y` untuk save
- Tekan `Enter` untuk konfirmasi

### 6. Jalankan Bot

```bash
npm start
```

### 7. Scan QR Code

1. QR Code akan muncul di terminal
2. Buka WhatsApp di HP Anda
3. Tap menu (3 titik) > Linked Devices
4. Tap "Link a Device"
5. Scan QR Code yang muncul di Termux

✅ Bot berhasil terhubung!

## 🔧 Tips & Tricks

### Agar Bot Tetap Berjalan

#### 1. Gunakan Wake Lock
```bash
termux-wake-lock
```
Ini mencegah Android membunuh proses Termux.

#### 2. Jangan Tutup Termux
- Jangan swipe close aplikasi Termux
- Minimize saja dengan tombol Home

#### 3. Disable Battery Optimization
- Buka Settings > Apps > Termux
- Battery > Unrestricted

### Menjalankan Bot di Background

#### Menggunakan Screen (Recommended)

```bash
# Install screen
pkg install screen -y

# Buat session baru
screen -S bot

# Jalankan bot
npm start

# Detach dari screen (bot tetap jalan)
# Tekan: Ctrl + A, lalu D

# Attach kembali ke screen
screen -r bot

# List semua screen
screen -ls
```

#### Menggunakan Tmux

```bash
# Install tmux
pkg install tmux -y

# Buat session baru
tmux new -s bot

# Jalankan bot
npm start

# Detach dari tmux
# Tekan: Ctrl + B, lalu D

# Attach kembali
tmux attach -t bot
```

### Auto Start Bot Saat Termux Dibuka

Buat file `.bashrc`:

```bash
nano ~/.bashrc
```

Tambahkan di akhir file:
```bash
cd /sdcard/whatsapp-bot-ppob
npm start
```

Save dan keluar. Bot akan otomatis start saat Termux dibuka.

## 🛠️ Troubleshooting

### Error: Cannot find module

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Error: EACCES permission denied

```bash
termux-setup-storage
chmod -R 755 /sdcard/whatsapp-bot-ppob
```

### Bot tiba-tiba mati

Kemungkinan penyebab:
1. Android membunuh proses (gunakan wake lock)
2. Koneksi internet terputus
3. RAM penuh (tutup aplikasi lain)

Solusi:
```bash
# Restart bot
npm start

# Atau gunakan screen/tmux
```

### QR Code tidak muncul

```bash
# Hapus session lama
rm -rf auth_info

# Jalankan ulang
npm start
```

### Sticker tidak bisa dibuat

```bash
# Install ulang ffmpeg
pkg install ffmpeg -y

# Cek apakah ffmpeg terinstall
ffmpeg -version
```

### Bot tidak merespon command

1. Cek mode bot di `bot-config.js` (public/self)
2. Pastikan prefix benar (default: `.`)
3. Cek log error di terminal

## 📊 Monitoring Bot

### Cek Status Bot

```bash
# Cek proses node yang berjalan
ps aux | grep node

# Cek penggunaan RAM
free -h

# Cek storage
df -h
```

### Lihat Log

```bash
# Jalankan dengan log detail
npm start 2>&1 | tee bot.log

# Lihat log
cat bot.log
```

## 🔄 Update Bot

```bash
# Backup auth_info
cp -r auth_info auth_info.backup

# Pull update dari git
git pull

# Install dependencies baru
npm install

# Jalankan bot
npm start
```

## 💾 Backup & Restore

### Backup

```bash
# Backup auth_info (session WhatsApp)
cp -r auth_info /sdcard/backup-auth_info

# Backup database
cp -r database /sdcard/backup-database

# Backup config
cp bot-config.js /sdcard/backup-config.js
```

### Restore

```bash
# Restore auth_info
cp -r /sdcard/backup-auth_info auth_info

# Restore database
cp -r /sdcard/backup-database database

# Restore config
cp /sdcard/backup-config.js bot-config.js
```

## 🔐 Keamanan

1. **Jangan share folder `auth_info`**
   - Berisi session WhatsApp Anda
   - Orang lain bisa akses WA Anda

2. **Backup secara berkala**
   - Backup auth_info setiap minggu
   - Backup database produk

3. **Gunakan mode self untuk testing**
   ```javascript
   mode: 'self' // Hanya owner yang bisa pakai
   ```

4. **Jangan install package sembarangan**
   ```bash
   # Hanya install dari npm official
   npm install <package-name>
   ```

## 📱 Optimasi Performa

### Kurangi Penggunaan RAM

Edit `bot.js`, tambahkan:
```javascript
// Limit memory usage
if (global.gc) {
    setInterval(() => {
        global.gc();
    }, 60000); // Garbage collection setiap 1 menit
}
```

Jalankan dengan:
```bash
node --expose-gc bot.js
```

### Kurangi Log

Edit `bot.js`:
```javascript
logger: pino({ level: 'silent' }) // Matikan log
```

## 🆘 Bantuan

Jika masih ada masalah:

1. Baca dokumentasi lengkap di `README-BOT.md`
2. Cek issue di GitHub repository
3. Tanya di grup support (jika ada)

## 📝 Catatan Penting

- ⚠️ Bot akan mati jika Termux di-force close
- ⚠️ Gunakan wake lock agar bot tetap jalan
- ⚠️ Backup auth_info secara berkala
- ⚠️ Jangan logout WhatsApp Web/Desktop saat bot jalan
- ⚠️ Koneksi internet harus stabil

## ✅ Checklist Instalasi

- [ ] Termux terinstall dari F-Droid/GitHub
- [ ] Node.js, Git, FFmpeg terinstall
- [ ] Repository di-clone
- [ ] Dependencies terinstall (`npm install`)
- [ ] Config sudah diubah (nomor owner)
- [ ] QR Code sudah di-scan
- [ ] Bot merespon command `.menu`
- [ ] Wake lock aktif
- [ ] Battery optimization disabled

---

Selamat! Bot WhatsApp Anda sudah berjalan di Termux! 🎉

Untuk panduan lengkap fitur bot, baca `README-BOT.md`
