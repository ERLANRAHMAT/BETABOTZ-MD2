
## Harap Dipahami Sebelum Install - BETATEST 90%

### Pembaruan:

* Menggunakan **ZAPO versi terbaru** (original, bukan mod)
* **Server HTTP Native** Menghapus dependensi `express` untuk performa server yang lebih ringan
* Menggunakan **ESM** (sebelum ny Cjs)
* ***Sesi lokal SQLite** Kredensial disimpan di `sessions/state.sqlite` (pakai `@zapo-js/store-sqlite` + `better-sqlite3`)
* ***Database SQLite** Database bot (`users`, `chats`, `stats`, dll) kini tersimpan di `database/database.sqlite` (WAL, atomic) menggantikan `database.json`; auto-migrasi dari JSON lama saat boot pertama
* **Koneksi Dual Mode** Mendukung Pairing Code secara default, dan QR Code bisa diakses dengan argumen `--qr`
* Wajib menggunakan **panel dengan Node.js 22+**
* Dapat menggunakan **Bun 1.3.1**
* Fitur 90% implementasi dari **website API**
* Penambahan output URL `express.js` agar bisa dijalankan di Render, dsb.
* Informasi API: [WhatsApp](https://whatsapp.com/channel/0029VbCQLA43AzNYDInpyO2v)
* Informasi Bot: [WhatsApp](https://whatsapp.com/channel/0029VaiIG3UJpe8n3Y2MZ51z)

---
## ✨ Link Seputar Bot

| Ikon | Link                               | Deskripsi Singkat                                                                                                |
| :--: | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
|  ▶️  | **https://www.youtube.com/playlist?list=PLuQT2lE0wOYTMf1X4OqlVFeavLsLKa-0t** | **Video tutorial** |
|  ▶️  | **https://www.youtube.com/playlist?list=PLfTmZufvRy8Y** | **Penjelasan Update** |

---

## Note!

### Important:

* Kamu **wajib mengisi ApiKey** agar bot berfungsi dengan baik.
* **Tidak disarankan menginstal** di Termux atau panel tanpa `express`, `ffmpeg`, `imagemagick`, dan `webp`.
* Bot ini menggunakan 80% fitur dari [`RestApi`](https://api.betabotz.eu.org) sebagai media downloader dan fitur lainnya.
* Untuk **PANEL** minimum CPU 75 untuk dapat pairing.

---

## ApiKey & Harga

| No | Plan/Role | Limit          | Expired | Harga  |
|----|-----------|----------------|---------|--------|
| 1  | Free      | 30 Request/day | -       | Gratis |
| 2  | Cheap1    | 3000 Request   | 1 bulan | 3.000  |
| 3  | Cheap2    | 4000 Request   | 1 bulan | 4.000  |
| 4  | PREMIUM   | 5000 Request   | 1 bulan | 5.000  |
| 5  | VIP       | 8000 Request   | 2 bulan | 8.000  |
| 6  | VVIP      | 12000 Request  | 3 bulan | 12.000 |
| 7  | SUPREME   | 20000 Request  | 4 bulan | 20.000 |

> Untuk membeli ApiKey silakan **register**, pilih paket, lalu tekan **Buy Now** [`Pilih`](https://api.betabotz.eu.org/price)

---

## Website API
* **Lann (Wajib):** [`Register`](https://api.betabotz.eu.org)

### ðŸ”§ Konfigurasi ApiKey

1. Setelah mendapatkan ApiKey, masukkan ke `config.js`:

   ```js
   global.lann = 'API_KEY_LANN';
   ```

2. atau kamu bisa memasukan nya ke `.env` dari `.env.example`, setelah itu hapus komentar gunakan yang menggunakan .env di `config.js`:

   ```js
   API_KEY_BETABOTZ=
   API_KEY_BETABOTZ_AKSESKEY=
   ```

3. Jalankan bot dan ketik `.getip`
4. Buka [`Profile API`](https://api.betabotz.eu.org/profile), whitelist IP bot di:
   `Settings -> Management IP`, lalu tempelkan IP dari hasil `.getip`.

---
**Informasi Pembaruan:**  
----  
- ✅ **Update  Lid resolver**  Penanganan lid jadi terbaru
- ✅ **Update  ESM**  Menggunakan ESM 
- ✅ **Menggunakan Zapo Latest**  
- ✅ **Wajib Menggunakan Node.js 22+**
---

---

### Penjelasan Masalah @lid
Beberapa gejala error yang terjadi karena masalah ini antara lain:
- Bot **tidak merespons** pesan di dalam grup.
- Bot **tidak mendeteksi nomor owner**, meskipun sudah tercantum di `global.owner`.
- Bot **tidak mengenali nomor admin** dan tidak menjalankan fitur grup lain yang memerlukan akses admin atau owner.

---

Jika kamu mengalami masalah di atas, silakan ikuti langkah perbaikan yang telah disebutkan.

## Node.js Hosting

Bot ini wajib dijalankan di **Node.js v22+**  
> Butuh hosting siap pakai? Hubungi:
* **Admin Lann:** [`Buy`](https://wa.me/62895423183527)

---

## Info & Diskusi

* Group WhatsApp: [`Join`](https://chat.whatsapp.com/H8XPKS8vmHm2spliGlKY41)

---

## Support

[![Buy Me A Coffee](https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://api.betabotz.eu.org/donasi)

---

## Base Original

Original Base: [`ZukaBet`](https://github.com/HelgaIlham/ZukaBet)

---

## Run on Heroku

[Deploy](https://heroku.com/deploy?template=https://github.com/ERLANRAHMAT/BETABOTZ-MD2)

### Heroku Buildpacks:
```bash
heroku/nodejs
https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git
https://github.com/clhuang/heroku-buildpack-webp-binaries.git
```

---

## Untuk Pengguna Windows/VPS/RDP

1. Install Git â†’ [`Download`](https://git-scm.com/downloads)  
2. Install Node.js â†’ [`Download`](https://nodejs.org/en/download)  
3. Install FFmpeg â†’ [`Download`](https://ffmpeg.org/download.html)  
   âš ï¸ Tambahkan ke `PATH`
4. Install ImageMagick â†’ [`Download`](https://imagemagick.org/script/download.php)

### Jalankan (Pairing Code):
```bash
git clone https://github.com/ERLANRAHMAT/BETABOTZ-MD2
git checkout zapo-esm
cd BETABOTZ-MD2
npm install
npm start
```
---

## Command Baru ketika Startup
### Jalankan (Pairing Code):
```bash
npm start
```
- Running node index.js --autocleartmp

```bash
npm run pairing
```
- Running khusus langsung pairing dengan kode

```bash
npm run pairingqr
```
- Running khusus langsung pairing dengan Qr

---

## Daftar Argumen

```bash
node index.js [--options]
```

| Argumen | Fungsi |
|---------|--------|
| `--qr` | Mengaktifkan mode autentikasi QR Code (secara default menggunakan Pairing Code) |
| `--self` | Hanya Owner & Bot |
| `--pconly` | Hanya merespon chat pribadi |
| `--gconly` | Hanya merespon chat grup |
| `--swonly` | Hanya merespon status |
| `--restrict` | Aktifkan plugin terbatas (risiko kena banned) |
| `--img` | Tampilkan gambar di terminal |
| `--autoread` | Tandai semua pesan masuk sebagai sudah dibaca |
| `--nyimak` | Mode silent — hanya log, tidak membalas |
| `--test` | Mode pengembangan |
| `--prefix <prefix>` | Set prefix (setiap karakter jadi prefix terpisah) |
| `--db <mongodb url>` | Pakai MongoDB (contoh: `--db mongodb://user:pass@host:27017/bot`) |
| `--db json` | Pakai database JSON file (`database.json`) — default sebelumnya |
| `--db sqlite` | Pakai SQLite (`database/database.sqlite`, WAL) — **default** |
| `--db <https://...>` | Pakai cloud adapter |

---

## Website ANIQU-task

Sebuah sistem untuk mengelola dan pengingat yang di kirim melalui discord dan whatsapp 
* **Tidak Wajib** [`Dashbaord`](https://task.aniqu.biz.id)
- Tutorial [Youtube](https://youtube.com/playlist?list=PLGv_-znSuMIwhZPH2y06HWisHZbn7dXL3&si=PltQSbqZT5zotVZx)

---

## Kontributor

Lihat semua kontributor di: [`All Contri`](https://contributor.betabotz.eu.org)
