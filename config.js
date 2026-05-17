require("dotenv").config();

global.owner = ["6281289694906"]; // wajib di isi tidak boleh kosong
global.mods = ["6281289694906"]; // wajib di isi tidak boleh kosong
global.prems = ["6281289694906"]; // wajib di isi tidak boleh kosong
global.nameowner = "LANN"; // wajib di isi tidak boleh kosong
global.numberowner = "6281289694906"; // wajib di isi tidak boleh kosong
global.mail = "danaputra10012@gmail.com"; // wajib di isi tidak boleh kosong
global.gc = "https://chat.whatsapp.com/I5RpePh2b5u37OyFjzCNTr"; // wajib di isi tidak boleh kosong
global.instagram = "https://www.instagram.com/dana_putra13/"; // wajib di isi tidak boleh kosong
global.wm = "© BETABOTZ"; // isi nama bot atau nama kalian
global.wait = "_*Tunggu sedang di proses...*_"; // ini pesan simulasi loading
global.eror = "_*Server Error*_"; // ini pesan saat terjadi kesalahan
global.stiker_wait = "*⫹⫺ Stiker sedang dibuat...*"; // ini pesan simulasi saat loading pembuatan sticker
global.qris = "https://cdn.filn.pp.ua/uploads/betabotzapi/41616.jpg";
global.thumb = "https://telegra.ph/file/3a34bfa58714bdef500d9.jpg";
global.packname = "Made With"; // watermark stikcker packname
global.author = "Bot WhatsApp"; // watermark stikcker author
global.maxwarn = "3"; // Peringatan maksimum Warn
global.groupLapor = "120363216901617825@g.us"; // grub dimana bot mengirim laporan error dari user

global.autobio = false; // Set true/false untuk mengaktifkan atau mematikan autobio (default: false)
global.antiporn = false; // Set true/false untuk Auto delete pesan porno (bot harus admin) (default: false)
global.spam = false; // Set true/false untuk anti spam (default: false)
global.gcspam = false; // Set true/false untuk menutup grup ketika spam (default: false)


// Prefix dari bot
global.prefix = './#'

// APIKEY INI WAJIB DI ISI! //
global.lann = "";
// global.lann = process.env.API_KEY_BETABOTZ;
// aktifkan akses .env di atas jika kamu ingin menaruh key api di .env
// Daftar terlebih dahulu https://api.betabotz.eu.org

// AKSESKEY INI DI ISI JIKA DIPERLUKAN (e.g suno ai (ai music ) & fitur prem lainnya//
global.aksesKey = "";
// global.aksesKey = process.env.API_KEY_BETABOTZ_AKSESKEY;
// aktifkan akses .env di atas jika kamu ingin menaruh key api di .env
// Daftar terlebih dahulu https://api.betabotz.eu.org

// Tidak boleh diganti atau di ubah
global.APIs = {
  lann: "https://api.betabotz.eu.org",
};

//Tidak boleh diganti atau di ubah
global.APIKeys = {
  "https://api.betabotz.eu.org": global.lann,
};

let fs = require("fs");
let chalk = require("chalk");
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright("Update 'config.js'"));
  delete require.cache[file];
  require(file);
});
