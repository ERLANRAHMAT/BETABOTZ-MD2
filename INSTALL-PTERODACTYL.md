# 🐳 Panduan Instalasi Bot WhatsApp di Panel Pterodactyl

Panduan lengkap untuk menjalankan WhatsApp Bot di Panel Pterodactyl.

## 📋 Persyaratan

- Akses ke Panel Pterodactyl
- Node.js Egg tersedia
- Minimal 512MB RAM (Recommended: 1GB)
- Minimal 1GB Storage
- Port yang tersedia

## 🚀 Langkah Instalasi

### 1. Buat Server Baru

1. Login ke Panel Pterodactyl
2. Klik **"Create Server"** atau **"Buat Server"**
3. Pilih **Node.js** sebagai Egg/Template
4. Isi detail server:
   - **Server Name**: WhatsApp Bot PPOB
   - **Memory**: 512MB - 1GB
   - **Disk Space**: 1GB - 2GB
   - **CPU**: 100% - 200%

### 2. Konfigurasi Server

Setelah server dibuat:

1. Buka **File Manager**
2. Upload semua file bot ke root directory
3. Atau gunakan Git:

```bash
# Di console panel
git clone https://github.com/yourusername/whatsapp-bot-ppob.git
mv whatsapp-bot-ppob/* .
rm -rf whatsapp-bot-ppob
```

### 3. Install Dependencies

Di console panel, jalankan:

```bash
npm install
```

Tunggu hingga proses selesai (5-10 menit).

### 4. Konfigurasi Bot

Edit file `bot-config.js`:

1. Buka **File Manager**
2. Klik `bot-config.js`
3. Edit bagian owner:

```javascript
owner: {
    name: 'Nama Anda',
    number: '6281234567890', // Ganti dengan nomor WA Anda
    numbers: ['6281234567890']
},
```

4. Save file

### 5. Setup Startup Command

1. Buka tab **Startup**
2. Set **Startup Command**:
   ```bash
   npm start
   ```
3. Save

### 6. Jalankan Bot

1. Kembali ke tab **Console**
2. Klik tombol **Start**
3. QR Code akan muncul di console
4. Scan QR Code dengan WhatsApp Anda

✅ Bot berhasil terhubung!

## 🔧 Konfigurasi Lanjutan

### Environment Variables

Tambahkan di tab **Startup** > **Variables**:

```
NODE_ENV=production
TZ=Asia/Jakarta
```

### Startup Script

Buat file `start.sh`:

```bash
#!/bin/bash
echo "Starting WhatsApp Bot..."
npm start
```

Ubah startup command menjadi:
```bash
bash start.sh
```

### Auto Restart

Jika bot crash, panel akan otomatis restart.

Untuk restart manual:
1. Stop server
2. Start server

## 📊 Monitoring

### Cek Status Bot

Di console panel:

```bash
# Cek proses
ps aux | grep node

# Cek memory usage
free -h

# Cek disk usage
df -h
```

### Lihat Log

Log otomatis muncul di console panel.

Untuk save log ke file:

```bash
npm start 2>&1 | tee bot.log
```

## 🛠️ Troubleshooting

### Bot tidak start

**Penyebab:**
- Dependencies belum terinstall
- Port sudah digunakan
- Memory tidak cukup

**Solusi:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Restart server
```

### QR Code tidak muncul

**Solusi:**
```bash
# Hapus session lama
rm -rf auth_info

# Restart server
```

### Bot crash terus

**Penyebab:**
- Memory tidak cukup
- Error di code
- Koneksi terputus

**Solusi:**
1. Upgrade RAM ke 1GB
2. Cek log error di console
3. Restart server

### Error: ENOSPC

**Penyebab:** Storage penuh

**Solusi:**
```bash
# Hapus cache
npm cache clean --force

# Hapus file temporary
rm -rf temp/*

# Hapus log lama
rm -rf *.log
```

### Error: Cannot find module

**Solusi:**
```bash
npm install
```

## 💾 Backup & Restore

### Backup

1. **Via File Manager:**
   - Download folder `auth_info`
   - Download folder `database`
   - Download file `bot-config.js`

2. **Via Console:**
```bash
# Buat archive
tar -czf backup.tar.gz auth_info database bot-config.js

# Download via SFTP
```

### Restore

1. **Via File Manager:**
   - Upload folder `auth_info`
   - Upload folder `database`
   - Upload file `bot-config.js`

2. **Via Console:**
```bash
# Extract archive
tar -xzf backup.tar.gz
```

### Auto Backup (Cron)

Buat file `backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf backup_$DATE.tar.gz auth_info database bot-config.js
echo "Backup created: backup_$DATE.tar.gz"
```

Jalankan manual atau setup cron job.

## 🔐 Keamanan

### 1. Protect Auth Info

Jangan share folder `auth_info` dengan siapapun!

### 2. Gunakan Environment Variables

Untuk API Key, gunakan environment variables:

```javascript
// bot-config.js
ppob: {
    apiKey: process.env.PPOB_API_KEY || 'YOUR_API_KEY',
}
```

Set di panel:
```
PPOB_API_KEY=your_actual_api_key
```

### 3. Restrict Access

- Gunakan mode `self` untuk testing
- Whitelist IP di panel (jika tersedia)
- Ganti password panel secara berkala

### 4. Update Berkala

```bash
# Pull update dari git
git pull

# Install dependencies baru
npm install

# Restart server
```

## 📈 Optimasi Performa

### 1. Increase Memory Limit

Edit `package.json`:

```json
{
  "scripts": {
    "start": "node --max-old-space-size=512 bot.js"
  }
}
```

### 2. Disable Unnecessary Logs

Edit `bot.js`:

```javascript
logger: pino({ level: 'error' }) // Hanya log error
```

### 3. Clean Temp Files

Buat cron job untuk clean temp:

```bash
# cleanup.sh
#!/bin/bash
rm -rf temp/*
echo "Temp files cleaned"
```

### 4. Monitor Resource Usage

```bash
# Install htop (jika tersedia)
htop

# Atau gunakan top
top
```

## 🔄 Update Bot

### Via Git

```bash
# Backup dulu
cp -r auth_info auth_info.backup

# Pull update
git pull

# Install dependencies baru
npm install

# Restart server
```

### Manual Upload

1. Download file baru
2. Backup `auth_info` dan `database`
3. Upload file baru via File Manager
4. Restore `auth_info` dan `database`
5. Restart server

## 📱 Multiple Instances

Untuk menjalankan multiple bot:

### 1. Buat Server Baru

Ulangi langkah instalasi untuk setiap bot.

### 2. Gunakan Port Berbeda

Jika bot menggunakan port, pastikan setiap instance menggunakan port berbeda.

### 3. Pisahkan Database

Setiap bot harus punya folder `auth_info` dan `database` sendiri.

## 🆘 Bantuan

### Log Error

Jika bot error, cek log di console:

```bash
# Lihat log terakhir
tail -n 100 bot.log

# Follow log real-time
tail -f bot.log
```

### Debug Mode

Jalankan dengan debug:

```bash
NODE_ENV=development npm start
```

### Contact Support

Jika masih ada masalah:
1. Screenshot error di console
2. Buat issue di GitHub
3. Contact panel administrator

## ✅ Checklist Instalasi

- [ ] Server Pterodactyl sudah dibuat
- [ ] Node.js Egg sudah dipilih
- [ ] RAM minimal 512MB
- [ ] Storage minimal 1GB
- [ ] File bot sudah di-upload
- [ ] Dependencies terinstall (`npm install`)
- [ ] Config sudah diubah (nomor owner)
- [ ] Startup command sudah di-set
- [ ] Server sudah di-start
- [ ] QR Code sudah di-scan
- [ ] Bot merespon command `.menu`

## 📝 Catatan Penting

- ⚠️ Jangan stop server saat bot sedang digunakan
- ⚠️ Backup `auth_info` secara berkala
- ⚠️ Monitor penggunaan RAM dan CPU
- ⚠️ Update bot secara berkala
- ⚠️ Jangan share credentials panel

## 🎯 Tips & Tricks

### 1. Gunakan PM2 (Jika tersedia)

```bash
# Install PM2
npm install -g pm2

# Start bot dengan PM2
pm2 start bot.js --name whatsapp-bot

# Auto restart on crash
pm2 startup
pm2 save

# Monitor
pm2 monit

# Logs
pm2 logs whatsapp-bot
```

### 2. Setup Webhook (Opsional)

Untuk notifikasi error:

```javascript
// Di bot.js
process.on('uncaughtException', async (err) => {
    // Kirim ke webhook Discord/Telegram
    await sendWebhook(err.message);
});
```

### 3. Database External (Opsional)

Gunakan MongoDB/MySQL untuk database yang lebih robust:

```bash
npm install mongoose
```

---

Selamat! Bot WhatsApp Anda sudah berjalan di Panel Pterodactyl! 🎉

Untuk panduan lengkap fitur bot, baca `README-BOT.md`
