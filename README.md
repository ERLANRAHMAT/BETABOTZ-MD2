
---

## ✅ Harap Dipahami Sebelum Instal

### 🔄 Pembaruan:

* Menggunakan **baileys versi terbaru** (original, bukan mod)
* Support **pairing code only** sesuai ketentuan
* Wajib menggunakan **panel dengan Node.js 20+** (sesuai ketentuan baileys terbaru)
* Fitur 90% implementasi dari **website API**
* Penambahan output URL `express.js` agar bisa dijalankan di Render, dsb.
* Informasi API: [WhatsApp](https://whatsapp.com/channel/0029VaApYsQ5Ui2c2rKbpP0S)
* Informasi Bot: [WhatsApp](https://whatsapp.com/channel/0029VaiIG3UJpe8n3Y2MZ51z)

---

## ⚠️ Note!

### 🛑 Important:

* Untuk menggunakan bot ini, kamu **wajib mengisi ApiKey** terlebih dahulu. Jika tidak, bot tidak akan berfungsi dengan baik.
* **Tidak disarankan menginstal** bot ini di Termux atau panel yang tidak memiliki kelengkapan `express`, `ffmpeg`, `imagemagick`, dan `webp`.
* Bot ini menggunakan 80% fitur dari [`RestApi`](https://api.betabotz.eu.org) sebagai media downloader dan berbagai fitur lainnya.

---

## 🔑 ApiKey & Harga

| No | Plan/Role | Limit          | Expired | Harga  |
| -- | --------- | -------------- | ------- | ------ |
| 1  | Free      | 30 Request/day | -       | Gratis |
| 2  | Cheap1    | 3000 Request   | 1 bulan | 3.000  |
| 3  | Cheap2    | 4000 Request   | 1 bulan | 4.000  |
| 4  | PREMIUM   | 5000 Request   | 1 bulan | 5.000  |
| 5  | VIP       | 8000 Request   | 2 bulan | 8.000  |
| 6  | VVIP      | 12000 Request  | 3 bulan | 12.000 |
| 7  | SUPREME   | 20000 Request  | 4 bulan | 20.000 |

> Untuk membeli ApiKey Cheap1–Supreme silakan **register**, pilih paket, lalu tekan tombol **Buy Now** [`Pilih`](https://api.betabotz.eu.org/price)

---

## 🌐 Website API

* **BOTCAHX (Opsional):** [`Register`](https://api.botcahx.eu.org)
* **Lann (Wajib):** [`Register`](https://api.betabotz.eu.org)

### 🔧 Konfigurasi ApiKey

* Setelah mendapatkan ApiKey, paste ke `config.js` pada:

  ```js
  global.btc = 'API_KEY_BOTCAHX';
  global.lann = 'API_KEY_LANN';
  ```
* Jalankan bot, lalu ketik `.getip` pada bot.
* Kunjungi [`Profile API`](https://api.betabotz.eu.org), whitelist IP bot di:
  `Settings -> Management IP`, lalu paste IP dari `.getip`.

---

## ⚙️ Node.js Hosting

Script ini **wajib** dijalankan di Node.js **versi 20+**.

> Jika butuh hosting/panel Node.js 20+, kamu bisa beli ke:

* **Admin Lann:** [`Buy`](https://wa.me/62895628117900)

---

## 💬 BetaBotz MD — Info & Diskusi

* Group WhatsApp Bot: [`Join`](https://chat.whatsapp.com/H8XPKS8vmHm2spliGlKY41)

---

## ☕ Support

<a href="https://api.betabotz.eu.org/donasi" target="_blank">
<img src="https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" height="32px" alt="Sociabuzz">
</a>

## 🧱 Base Original

Original Base: [`ZukaBet`](https://github.com/HelgaIlham/ZukaBet)

---

## ☁️ Run On Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/ERLANRAHMAT/BETABOTZ-MD2)

### Heroku Buildpack

```bash
heroku/nodejs
https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git
https://github.com/clhuang/heroku-buildpack-webp-binaries.git
```

---

## 💻 Untuk Pengguna Windows/VPS/RDP

1. Install Git → [`Download`](https://git-scm.com/downloads)
2. Install Node.js → [`Download`](https://nodejs.org/en/download)
3. Install FFmpeg → [`Download`](https://ffmpeg.org/download.html)
   ⚠️ *Tambahkan FFmpeg ke environment variable (PATH)*
4. Install ImageMagick → [`Download`](https://imagemagick.org/script/download.php)

### Jalankan Script

```bash
git clone https://github.com/ERLANRAHMAT/BETABOTZ-MD2
cd BETABOTZ-MD2
npm i
npm start
```

### Pairing Code

```bash
node index.js --pairing
```

---

## 🙌 Kontributor

Lihat semua kontributor di: [`All Contri`](https://contributor.betabotz.eu.org)

---

