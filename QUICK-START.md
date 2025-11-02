# 🚀 Quick Start Guide

Panduan cepat untuk menjalankan bot dalam 5 menit!

## ⚡ Instalasi Cepat

### Termux (Android)

```bash
# 1. Install dependencies
pkg update && pkg upgrade -y
pkg install nodejs git ffmpeg -y

# 2. Clone repository
git clone <repository-url>
cd whatsapp-bot-ppob

# 3. Install packages
npm install

# 4. Edit config (ganti nomor owner)
nano bot-config.js

# 5. Jalankan bot
npm start

# 6. Scan QR Code dengan WhatsApp
```

### VPS/Server Linux

```bash
# 1. Install dependencies
sudo apt update && sudo apt upgrade -y
sudo apt install nodejs npm git ffmpeg -y

# 2. Clone repository
git clone <repository-url>
cd whatsapp-bot-ppob

# 3. Install packages
npm install

# 4. Edit config
nano bot-config.js

# 5. Jalankan bot
npm start
```

### Panel Pterodactyl

```bash
# 1. Upload files ke panel

# 2. Install packages
npm install

# 3. Edit config via File Manager
# Edit bot-config.js

# 4. Set startup command
npm start

# 5. Start server dan scan QR
```

## 📝 Konfigurasi Minimal

Edit `bot-config.js`:

```javascript
owner: {
    number: '6281234567890', // GANTI INI!
    numbers: ['6281234567890'] // GANTI INI!
}
```

Itu saja! Bot siap digunakan.

## 🎯 Test Bot

Setelah scan QR code, test dengan:

```
.menu
```

Jika bot merespon, berarti berhasil! ✅

## 📱 Command Dasar

```
.menu          - Tampilkan menu
.sticker       - Buat sticker (reply gambar)
.tiktok <url>  - Download TikTok
.youtube <url> - Info YouTube
```

## 🔧 Troubleshooting Cepat

### Bot tidak merespon?
```bash
# Cek mode bot
# Edit bot-config.js, pastikan mode: 'public'
```

### QR Code tidak muncul?
```bash
# Hapus session lama
rm -rf auth_info
npm start
```

### Error saat install?
```bash
# Reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 📚 Dokumentasi Lengkap

- 📖 [README-BOT.md](README-BOT.md) - Dokumentasi lengkap
- 📱 [INSTALL-TERMUX.md](INSTALL-TERMUX.md) - Panduan Termux
- 🐳 [INSTALL-PTERODACTYL.md](INSTALL-PTERODACTYL.md) - Panduan Pterodactyl
- 💰 [CARA-INTEGRASI-PPOB.md](CARA-INTEGRASI-PPOB.md) - Integrasi PPOB
- ❓ [FAQ.md](FAQ.md) - Pertanyaan umum

## 🎉 Selesai!

Bot WhatsApp Anda sudah berjalan!

Untuk fitur lanjutan (PPOB, Store, dll), baca dokumentasi lengkap.

---

Need help? Buat issue di GitHub!
