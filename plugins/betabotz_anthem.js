import fetch from 'node-fetch';
let handler = async (m, { conn, command }) => {
  try {
    let audio = 'src/lagu.mp3'
    const img = await fetch(`https://telegra.ph/file/3947ccd86c9e9426eec8b.jpg`).then(res => res.buffer())
    let text = `🎵 Lagu Betabotz 🎵

(Verse 1)
Di GitHub, Betabotz beraksi,
Kode-kode terbuka, semangat tak terganti.
ERLANRAHMAT, sang pemilik,
Menyebarkan bot WhatsApp, tak terhenti.

(Chorus)
Betabotz, oh Betabotz,
Dengan API-nya yang mempesona.
Dari media downloader hingga pairing code,
Fiturnya mengagumkan, tak terbantahkan.

(Verse 2)
Windows, VPS, RDP, semua bisa,
Git, NodeJS, FFmpeg, ImageMagick, jangan lupa.
ApiKey wajib diisi, jangan lupa,
Express, ffmpeg, imagemagick, webp, semua terhubung.

(Chorus)
Betabotz, oh Betabotz,
Dengan API-nya yang mempesona.
Dari media downloader hingga pairing code,
Fiturnya mengagumkan, tak terbantahkan.

(Bridge)
Scraper langka, toanime, remini, dan tozombie,
Uploader dari BOTCAHX dan AEMT, tak terbantahkan.
Menggunakan CDN dan AEMT,
Betabotz-tools, fitur-fitur yang mengagumkan.

(Chorus)
Betabotz, oh Betabotz,
Dengan API-nya yang mempesona.
Dari media downloader hingga pairing code,
Fiturnya mengagumkan, tak terbantahkan.

(Outro)
Terima kasih, Tio Erlan Nayla,
Bo`
    await conn.sendFile(m.chat, img, null, text, m);
    conn.sendMessage(m.chat, { audio: { url: audio }, mimetype: 'audio/mpeg' }, { quoted: m });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

handler.customPrefix = /^(betabotz)$/i 
handler.command = new RegExp
handler.tags = ['main']
export default handler