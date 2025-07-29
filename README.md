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
