// @ts-nocheck
// Converted from plugins-esm - automated
import fetch from 'node-fetch';
import moment from 'moment'; // Menggunakan moment untuk membandingkan tanggal

let handler: WaPlugin = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    throw `Masukkan input yang benar!\n\nContoh:\n${usedPrefix + command} 8,desember,2027`;
  }

  try {
    // Memecah input pengguna
    let [tanggal, bulan, tahun] = text.split(',');
    if (!tanggal || !bulan || !tahun) throw `Format input salah! Contoh: 15,Desember,2024`;

    m.reply('⏳ Sedang menghitung sisa waktu...\nMohon tunggu sebentar.');

    // Cek apakah tanggal sudah terlewat
    const inputTanggal = moment(`${tahun}-${bulan}-${tanggal}`, 'YYYY-MM-DD');
    const currentDate = moment(); // Mendapatkan tanggal saat ini

    if (inputTanggal.isBefore(currentDate, 'day')) {
      await m.reply('⚠️ Tanggal yang dimasukkan sudah terlewat! Silakan masukkan tanggal yang valid.');
      return; // Menghentikan eksekusi lebih lanjut
    }

    // Ambil data dari API
    let response = await fetch(`https://api.betabotz.eu.org/api/tools/countdown?tanggal=${tanggal}&bulan=${bulan}&tahun=${tahun}&apikey=${lann}`);
    let json = await response.json();

    // Debug API Response
    console.log('Debug Response API:', json);

    // Menampilkan hasil countdown
    if (json.status && json.result && json.result.result1) {
      let sisaWaktu = json.result.result1; // Format API: "0 hari, 19 jam, 18 menit, 9 detik"

      // Kirim pesan ke chat
      await m.reply(`🕒 *Sisa Waktu Menuju ${tanggal} ${bulan} ${tahun}* 🕒\n\nSisa: *${sisaWaktu}*`);
    } else {
      throw `Gagal mendapatkan data waktu countdown. Periksa kembali input tanggalnya.`;
    }
  } catch (e) {
    console.error(e);
    throw `Terjadi kesalahan!\nGagal mendapatkan waktu countdown. Cek input tanggal atau coba lagi nanti.`;
  }
};

handler.help = ['hitungmundur'];
handler.tags = ['tools'];
handler.command = /^(hitungmundur)$/i;

export default handler;
