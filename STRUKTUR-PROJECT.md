# 📁 Struktur Project WhatsApp Bot

```
whatsapp-bot-ppob/
│
├── 📄 bot.js                          # File utama bot
├── 📄 bot-config.js                   # Konfigurasi bot
├── 📄 package-bot.json                # Dependencies dan scripts
├── 📄 start.sh                        # Startup script
├── 📄 .env.example                    # Contoh environment variables
├── 📄 .gitignore-bot                  # Git ignore file
│
├── 📂 handlers/                       # Handler untuk event
│   ├── message.js                     # Handler pesan masuk
│   └── command.js                     # Handler command
│
├── 📂 commands/                       # Command modules
│   ├── menu.js                        # Command menu/help
│   ├── ppob.js                        # Command PPOB
│   ├── downloader.js                  # Command downloader
│   ├── owner.js                       # Command owner
│   ├── store.js                       # Command store
│   └── sticker.js                     # Command sticker
│
├── 📂 lib/                            # Library dan helper
│   └── helper.js                      # Helper functions
│
├── 📂 database/                       # Database JSON
│   ├── products.json                  # Database produk store
│   └── transactions.json              # Database transaksi
│
├── 📂 auth_info/                      # Session WhatsApp (auto-generated)
│   └── creds.json                     # Credentials
│
├── 📂 temp/                           # File temporary (auto-generated)
│   └── ...                            # Sticker, download, dll
│
└── 📂 docs/                           # Dokumentasi
    ├── README-BOT.md                  # Dokumentasi utama
    ├── INSTALL-TERMUX.md              # Panduan Termux
    ├── INSTALL-PTERODACTYL.md         # Panduan Pterodactyl
    ├── CARA-INTEGRASI-PPOB.md         # Panduan PPOB
    ├── FAQ.md                         # Frequently Asked Questions
    ├── CHANGELOG.md                   # Changelog
    └── CONTRIBUTING.md                # Panduan kontribusi
```

## 📝 Penjelasan File

### File Utama

#### `bot.js`
File utama yang menjalankan bot. Berisi:
- Inisialisasi Baileys
- Connection handler
- Event listener
- Auto reconnect

#### `bot-config.js`
Konfigurasi bot. Berisi:
- Info owner
- Bot settings (prefix, mode, dll)
- PPOB settings
- Store settings
- Downloader settings
- Messages template

#### `package-bot.json`
Dependencies dan scripts. Berisi:
- List dependencies
- NPM scripts
- Project metadata

#### `start.sh`
Startup script untuk menjalankan bot dengan auto-check dependencies.

### Handlers

#### `handlers/message.js`
Handler untuk semua pesan masuk. Berisi:
- Message parser
- View Once handler (RVO)
- Message logger
- Mode checker (public/self)

#### `handlers/command.js`
Handler untuk command. Berisi:
- Command parser
- Command router
- Context builder
- Permission checker

### Commands

#### `commands/menu.js`
Command untuk menampilkan menu/help.

#### `commands/ppob.js`
Command untuk PPOB. Berisi:
- Pembelian pulsa
- Pembelian paket data
- Pembelian token PLN
- Top up e-money
- Cek produk PPOB

#### `commands/downloader.js`
Command untuk download media. Berisi:
- TikTok downloader
- Instagram downloader
- YouTube downloader (MP3 & MP4)
- Facebook downloader
- Twitter/X downloader

#### `commands/owner.js`
Command khusus owner. Berisi:
- Set mode (public/self)
- Broadcast message
- Add/delete owner
- Block/unblock user

#### `commands/store.js`
Command untuk store/toko. Berisi:
- Tampilkan store
- List produk
- Order produk
- Add/delete produk (owner)

#### `commands/sticker.js`
Command untuk membuat sticker dari gambar/video.

### Library

#### `lib/helper.js`
Helper functions. Berisi:
- Format functions (number, currency, date)
- Validation functions
- File operations
- Utility functions

### Database

#### `database/products.json`
Database produk store dalam format JSON.

#### `database/transactions.json`
Database transaksi PPOB dan store dalam format JSON.

### Folder Auto-Generated

#### `auth_info/`
Folder yang berisi session WhatsApp. **JANGAN DIHAPUS** saat bot sudah login.

#### `temp/`
Folder untuk file temporary seperti sticker, download, dll. Bisa dihapus secara berkala.

## 🔄 Flow Aplikasi

### 1. Startup
```
start.sh → bot.js → Initialize Baileys → Scan QR Code → Connected
```

### 2. Message Flow
```
Pesan Masuk → handlers/message.js → Log & Process → handlers/command.js → Route ke Command
```

### 3. Command Flow
```
Command → Parse → Check Permission → Execute → Reply
```

### 4. PPOB Flow
```
Command PPOB → Validate → Call API → Save Transaction → Reply Result
```

### 5. Downloader Flow
```
Command Download → Validate URL → Call API → Download Media → Send Media
```

## 🎯 Cara Menambah Fitur

### 1. Tambah Command Baru

Buat file di `commands/`:
```javascript
// commands/mycommand.js
async function handle(ctx) {
    const { reply } = ctx;
    await reply('Hello from my command!');
}

module.exports = { handle };
```

Daftarkan di `handlers/command.js`:
```javascript
case 'mycommand':
    await myCommand.handle(ctx);
    break;
```

### 2. Tambah Helper Function

Tambahkan di `lib/helper.js`:
```javascript
function myHelper() {
    // Your code here
}

module.exports = {
    // ... existing exports
    myHelper
};
```

### 3. Tambah Database

Buat file JSON di `database/`:
```json
[]
```

Buat CRUD functions:
```javascript
const fs = require('fs');
const dbPath = './database/mydata.json';

function read() {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function write(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}
```

## 📊 Dependencies

### Production
- `@whiskeysockets/baileys` - WhatsApp library
- `axios` - HTTP client
- `chalk` - Terminal colors
- `cheerio` - HTML parser
- `file-type` - File type detection
- `fluent-ffmpeg` - FFmpeg wrapper
- `moment-timezone` - Date/time
- `pino` - Logger
- `qrcode-terminal` - QR code display
- `ytdl-core` - YouTube downloader

### Development
- `nodemon` - Auto-restart

## 🔐 File Penting (Jangan Dihapus)

- ✅ `auth_info/` - Session WhatsApp
- ✅ `database/` - Database
- ✅ `bot-config.js` - Konfigurasi
- ✅ `.env` - Environment variables (jika ada)

## 🗑️ File yang Bisa Dihapus

- ❌ `temp/` - File temporary
- ❌ `node_modules/` - Bisa di-reinstall
- ❌ `*.log` - Log files

## 📦 Backup Checklist

Sebelum update atau reinstall, backup:
- [ ] `auth_info/`
- [ ] `database/`
- [ ] `bot-config.js`
- [ ] `.env` (jika ada)

---

Untuk informasi lebih lanjut, baca dokumentasi lengkap di `README-BOT.md`
