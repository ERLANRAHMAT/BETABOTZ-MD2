# Standar Error Handling (Panduan Kontributor)

Dokumen ini berisi aturan dan standar penulisan kode untuk menangani *error* (Error Handling) pada setiap fitur/plugin di *repository* ini. 

Tujuan dari standar ini adalah untuk memastikan bot tetap stabil (tidak mudah *crash*), mencegah *spam log* di terminal, menghindari *APIKEY* bocor ke user/ public, dan memberikan *User Experience* (UX) yang baik kepada pengguna bot.

Setiap *Pull Request* (PR) atau penambahan plugin baru **wajib** mengikuti pedoman di bawah ini.

---

## 📜 Aturan Dasar (The Do's and Don'ts) 😁

### 1. Wajib Menggunakan `try...catch`
Setiap fungsi utama di dalam `handler` (terutama yang melibatkan proses *asynchronous* seperti `await fetch`, manipulasi file, atau pengunduhan media) **wajib** dibungkus menggunakan blok `try...catch`.

**❌ JANGAN SEPERTI INI:**
```javascript
let handler = async (m, { conn, text }) => {
    let res = await fetch(`https://api.betabotz.eu.org/api/game/tebakjenaka?apikey=${lann}`);
    let json = await res.json();
    m.reply(json.result);
};
```
*(Jika API mati atau error bot akan mengirim result mentah ke user.)*

**✅ YANG BENAR:**
```javascript
let handler = async (m, { conn, text }) => {
    try {
        let res = await fetch(`https://api.betabotz.eu.org/api/game/tebakjenaka?apikey=${lann}`);
        let json = await res.json();
        m.reply(json.result);
    } catch (e) {
        console.log(e);
        throw e;
    }
};
```
*(best practice semua error di tangkap dilempar ke grub lapor yang disediakan di config.)*

### 2. DILARANG KERAS Menggunakan `throw false` atau `throw null`
Sistem `handler.js` dirancang untuk menangkap *throw* berupa **String** atau **Error Object**. Melempar nilai *boolean*, *null*, atau *undefined* akan merusak *error handling* dan bisa menyebabkan *silent fail*.

**❌ JANGAN SEPERTI INI:**
```javascript
if (!text) throw false;
if (!isLimit) throw null;
```

Contoh error jika memaksa menggunakan throw false untuk menghentikan sebuah esksekusi kode 

```
Plugin: group-kick.js
Sender: 
Chat: 120363@g.us
Chat Name: 
Command: .kick

Log Error:
⁠ false 
```


**✅ YANG BENAR:**
```javascript
if (!(id in conn.tebakkpop)) throw "Belum ada soal di chat ini!";
// Atau cukup gunakan return m.reply()
if (!text) return m.reply('Teks tidak boleh kosong!');
```

### 3. Pisahkan antara Log Terminal dan Pesan User
Ketika terjadi *error* pada sistem (misalnya API mati), catat *error* aslinya di terminal untuk proses *debugging* *developer*, tetapi kirimkan pesan yang ramah (*user-friendly*) ke WhatsApp pengguna.

**✅ YANG BENAR:**
```javascript
    } catch (e) {
        // 1. Cetak log asli di terminal server (untuk developer)
        console.error("Error pada plugin downloader:", e); // 
        
        // 2. Lempar string dari config global.eror (untuk user bot dan grub lapor)
        throw e;
    }
```

---

## 🛠️ Template Standar Plugin Bot

Gunakan struktur di bawah ini sebagai *template* saat membuat fitur baru:

```javascript
let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    // 1. VALIDASI INPUT 
    if (!text) throw `*❌ Masukkan parameter yang dibutuhkan!*\n\n*Contoh:* ${usedPrefix + command} query`;

    try {
        // 2. LOADING STATE BISA DI AMBIL DARI CONFIG JUGA global.wait
        await m.reply('⏳ _Sedang memproses, tunggu sebentar..._');

        // 3. LOGIKA UTAMA KODE KAMU
        // let data = await fetchData(text);
        // await conn.sendMessage(m.chat, { text: data }, { quoted: m });

    } catch (e) {
        // 4. ERROR HANDLING
        console.error(e);
        throw e;
    }
};

handler.help = ['namacommand <args>'];
handler.tags = ['kategori'];
handler.command = /^(namacommand)$/i;

handler.limit = true; // Set limit jika perlu

export default handler;
```

---
*Dokumen ini dibuat untuk menjaga ekosistem kode yang bersih, stabil, mudah dan aman dikelola (Open Source).*