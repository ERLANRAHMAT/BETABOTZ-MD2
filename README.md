
## Harap Dipahami Sebelum Instal

### Pembaruan:

* Menggunakan **baileys versi terbaru** (original, bukan mod)
* Support **pairing code only** sesuai ketentuan
* Wajib menggunakan **panel dengan Node.js 20+** (sesuai ketentuan baileys terbaru)
* Fitur 90% implementasi dari **website API**
* Penambahan output URL `express.js` agar bisa dijalankan di Render, dsb.
* Informasi API: [WhatsApp](https://whatsapp.com/channel/0029VaApYsQ5Ui2c2rKbpP0S)
* Informasi Bot: [WhatsApp](https://whatsapp.com/channel/0029VaiIG3UJpe8n3Y2MZ51z)

---

## Note!

### Important:

* Kamu **wajib mengisi ApiKey** agar bot berfungsi dengan baik.
* **Tidak disarankan menginstal** di Termux atau panel tanpa `express`, `ffmpeg`, `imagemagick`, dan `webp`.
* Bot ini menggunakan 80% fitur dari [`RestApi`](https://api.betabotz.eu.org) sebagai media downloader dan fitur lainnya.

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

* **BOTCAHX (Opsional):** [`Register`](https://api.botcahx.eu.org)
* **Lann (Wajib):** [`Register`](https://api.betabotz.eu.org)

### ðŸ”§ Konfigurasi ApiKey

1. Setelah mendapatkan ApiKey, masukkan ke `config.js`:

   ```js
   global.btc = 'API_KEY_BOTCAHX';
   global.lann = 'API_KEY_LANN';
   ```

2. Jalankan bot dan ketik `.getip`
3. Buka [`Profile API`](https://api.betabotz.eu.org), whitelist IP bot di:
   `Settings -> Management IP`, lalu tempelkan IP dari hasil `.getip`.

---

## Konfigurasi Owner & LID

### Menjalankan Bot & Mendapatkan LID

1. Clone repositori:
   ```bash
   git clone https://github.com/ERLANRAHMAT/BETABOTZ-MD2
   ```
2. Masuk direktori:
   ```bash
   cd BETABOTZ-MD2
   ```
3. Instal dependensi:
   ```bash
   npm install
   ```
4. Jalankan bot:
   ```bash
   npm start
   ```

5. Dapatkan LID:
   * Buat grup WA, lalu ketik `.getlid`
   * Salin `LID Target` dari bot

### Mengisi `config.js` dengan LID

Contoh:
```js
global.owner = ['6285842647866', '26777']
global.mods  = ['6285842647866', '26777']
global.prems = ['6285842647866', '26777']
```

**Video Panduan:**
[Tutorial Fix LID BETABOTZ-MD2](https://youtube.com/playlist?list=PLuQT2lE0wOYQNhk2E8JAerojcZj8ckMYs&si=kehl9mWEVmctVms0)

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

Bot ini wajib dijalankan di **Node.js v20+**  
> Butuh hosting siap pakai? Hubungi:
* **Admin Lann:** [`Buy`](https://wa.me/62895628117900)

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

### Jalankan:
```bash
git clone https://github.com/ERLANRAHMAT/BETABOTZ-MD2
cd BETABOTZ-MD2
npm install
npm start
```

### Pairing Code
```bash
node index.js --pairing
```

---

## Kontributor

Lihat semua kontributor di: [`All Contri`](https://contributor.betabotz.eu.org)
