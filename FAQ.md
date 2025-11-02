# ❓ FAQ (Frequently Asked Questions)

## Umum

### Q: Apakah bot ini gratis?
A: Ya, bot ini open source dan gratis. Namun untuk fitur PPOB, Anda perlu deposit saldo di provider PPOB.

### Q: Apakah bot ini aman?
A: Ya, selama Anda tidak share folder `auth_info` dan API key Anda dengan orang lain.

### Q: Bisa digunakan untuk bisnis?
A: Ya, bot ini cocok untuk bisnis PPOB, toko online, dan layanan digital lainnya.

### Q: Apakah bisa multi-device?
A: Ya, bot menggunakan Baileys yang support multi-device WhatsApp.

## Instalasi

### Q: Kenapa npm install error?
A: Pastikan Node.js versi 16 atau lebih baru. Coba:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Q: Kenapa QR code tidak muncul?
A: Pastikan terminal support QR code. Atau hapus folder `auth_info` dan coba lagi.

### Q: Bisa install di Windows?
A: Ya, install Node.js dan Git terlebih dahulu, lalu ikuti langkah instalasi.

### Q: Bisa install di HP tanpa Termux?
A: Tidak, untuk Android harus menggunakan Termux atau deploy ke VPS/Panel.

## Penggunaan

### Q: Kenapa bot tidak merespon?
A: Cek:
- Mode bot (public/self)
- Prefix yang digunakan
- Koneksi internet
- Log error di console

### Q: Bagaimana cara ganti prefix?
A: Edit `bot-config.js`, ubah `prefix: '.'` menjadi prefix yang diinginkan.

### Q: Bagaimana cara ganti mode public/self?
A: Gunakan command `.setmode public` atau `.setmode self` (owner only).

### Q: Kenapa command owner tidak bisa digunakan?
A: Pastikan nomor Anda sudah terdaftar di `bot-config.js` bagian `owner.numbers`.

## PPOB

### Q: Provider PPOB apa yang didukung?
A: Semua provider yang menggunakan REST API. Contoh: DigiFlazz, VIP Reseller, dll.

### Q: Bagaimana cara integrasi PPOB?
A: Baca panduan lengkap di `CARA-INTEGRASI-PPOB.md`.

### Q: Kenapa transaksi PPOB gagal?
A: Cek:
- Saldo API mencukupi
- API Key benar
- Kode produk sesuai
- Koneksi ke API provider

### Q: Apakah transaksi PPOB real?
A: Ya, jika sudah diintegrasikan dengan API provider yang real.

### Q: Bagaimana cara cek saldo PPOB?
A: Implementasikan fungsi `checkBalance()` di `commands/ppob.js`.

## Downloader

### Q: Kenapa download TikTok gagal?
A: API downloader kadang berubah. Update API endpoint di `commands/downloader.js`.

### Q: Apakah bisa download video panjang?
A: Tergantung ukuran. WhatsApp limit file 100MB untuk video.

### Q: Kenapa YouTube download error?
A: Pastikan `ytdl-core` terinstall. Atau gunakan API alternatif.

### Q: Apakah bisa download dari platform lain?
A: Ya, tambahkan API downloader untuk platform yang diinginkan.

## Store

### Q: Bagaimana cara tambah produk?
A: Gunakan command `.addproduk <id> <nama> <harga> <stok> <deskripsi>` (owner only).

### Q: Apakah ada payment gateway?
A: Belum, saat ini manual. Anda bisa integrasikan dengan Midtrans, Xendit, dll.

### Q: Bagaimana cara tracking order?
A: Order disimpan di `database/transactions.json`. Implementasikan command untuk cek status.

### Q: Apakah bisa auto-confirm payment?
A: Bisa, integrasikan dengan payment gateway yang support webhook.

## Sticker

### Q: Kenapa sticker tidak bisa dibuat?
A: Pastikan FFmpeg terinstall:
```bash
# Termux
pkg install ffmpeg

# Linux/VPS
sudo apt install ffmpeg
```

### Q: Apakah bisa sticker animated?
A: Ya, reply video dengan command `.sticker`.

### Q: Kenapa sticker pecah/blur?
A: Bot auto-resize ke 512x512. Gunakan gambar dengan resolusi bagus.

## RVO (View Once)

### Q: Apakah RVO otomatis?
A: Ya, bot otomatis screenshot foto/video yang dikirim 1x lihat.

### Q: Apakah pengirim tahu foto di-screenshot?
A: Tidak, bot screenshot secara otomatis tanpa notifikasi.

### Q: Apakah bisa disable RVO?
A: Ya, comment code di `handlers/message.js` bagian `handleViewOnce`.

## Termux

### Q: Kenapa bot mati saat Termux ditutup?
A: Gunakan `screen` atau `tmux` untuk background process.

### Q: Bagaimana cara bot tetap jalan?
A: Gunakan `termux-wake-lock` dan disable battery optimization.

### Q: Apakah bisa auto-start saat HP restart?
A: Bisa, gunakan Termux:Boot addon.

### Q: Kenapa Termux sering crash?
A: Kemungkinan RAM tidak cukup. Tutup aplikasi lain atau upgrade RAM.

## Pterodactyl

### Q: Berapa RAM yang dibutuhkan?
A: Minimal 512MB, recommended 1GB.

### Q: Kenapa bot crash terus?
A: Cek log error. Kemungkinan memory limit atau error di code.

### Q: Apakah bisa multiple bot?
A: Ya, buat server baru untuk setiap bot.

### Q: Bagaimana cara backup session?
A: Download folder `auth_info` via File Manager atau SFTP.

## Error & Troubleshooting

### Q: Error: Cannot find module
A: Jalankan `npm install` untuk install dependencies.

### Q: Error: EACCES permission denied
A: Jalankan dengan sudo atau ubah permission folder.

### Q: Error: Connection closed
A: Koneksi WhatsApp terputus. Bot akan auto-reconnect.

### Q: Error: Rate limit exceeded
A: Terlalu banyak request. Tunggu beberapa menit.

### Q: Bot spam error di console
A: Cek log error dan fix bug di code.

## Keamanan

### Q: Apakah aman menyimpan API key di config?
A: Lebih baik gunakan environment variables (`.env` file).

### Q: Bagaimana cara protect bot dari spam?
A: Implementasikan rate limiting di `lib/helper.js`.

### Q: Apakah bisa di-hack?
A: Jika Anda tidak share `auth_info` dan API key, relatif aman.

### Q: Bagaimana cara backup data?
A: Backup folder `auth_info`, `database`, dan file `bot-config.js`.

## Pengembangan

### Q: Bagaimana cara tambah command baru?
A: Buat file baru di folder `commands/` dan daftarkan di `handlers/command.js`.

### Q: Apakah bisa custom menu?
A: Ya, edit file `commands/menu.js`.

### Q: Bagaimana cara integrasikan dengan database?
A: Gunakan MongoDB, MySQL, atau PostgreSQL. Install driver yang sesuai.

### Q: Apakah bisa tambah fitur AI?
A: Ya, integrasikan dengan OpenAI, Google AI, atau API AI lainnya.

### Q: Dimana dokumentasi Baileys?
A: https://github.com/WhiskeySockets/Baileys

## Lisensi & Support

### Q: Apakah boleh dijual?
A: Tergantung lisensi. Jika MIT, boleh dijual dengan mencantumkan credit.

### Q: Bagaimana cara kontribusi?
A: Fork repository, buat perubahan, dan submit Pull Request.

### Q: Dimana bisa minta bantuan?
A: Buat issue di GitHub repository atau join grup support (jika ada).

### Q: Apakah ada versi premium?
A: Tidak, bot ini sepenuhnya gratis dan open source.

---

Masih ada pertanyaan? Buat issue di GitHub repository!
