import fetch from 'node-fetch';

const MAX_IMAGE_SEND = 20;
const STOP_COMMANDS = ['stop', 'berhenti', 'cancel', 'batal'];

async function sendImages(conn, chat, urls, count, quoted, isCancelled) {
  let sent = 0;
  for (let i = 0; i < count && i < urls.length; i++) {
    if (isCancelled?.()) return sent;
    let url = urls[i];
    try {
      await conn.sendMessage(chat, { image: { url }, caption: `Image ${i + 1} / ${count}` }, { quoted });
      sent += 1;
    } catch (e) {
      console.error(e);
      break;
    }
    if (isCancelled?.()) return sent;
  }
  return sent;
}

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) throw `*🚩 Format Salah!*\n\n*Contoh Pencarian:* ${usedPrefix}${command} minato aqua`;

  try {
    await m.reply('⏳ _Sedang mencari gambar, tunggu sebentar..._');

    const q = encodeURIComponent(text);
    // 2. Menggunakan global.lann agar apikey terbaca
    let response = await fetch(`https://api.betabotz.eu.org/api/search/pinterest?text1=${q}&apikey=${global.lann}`);
    let data = await response.json();
    let res = Array.isArray(data.result) ? data.result.filter(Boolean) : [];

    if (res.length < 1) return m.reply('❌ Maaf, foto tidak ditemukan.');

    let user = global.db.data.users[m.sender] || {};
    user.pinterest = {
      step: 'ask',
      query: text,
      results: res,
      total: res.length,
      chat: m.chat,
      ts: Date.now(),
      cancelled: false,
    };
    global.db.data.users[m.sender] = user;

    return m.reply(`✅ Total ditemukan ada *${res.length}* gambar.\n\nBalas pesan ini dengan angka (contoh: 5) untuk menampilkannya.\nBalas *semua* untuk melihat semuanya.\nKetik *stop* untuk membatalkan.`);
  } catch (e) {
    console.error(e);
    throw 'Terjadi kesalahan saat mengambil data dari Pinterest.';
  }
};

handler.all = async function (m) {
  try {
    if (!m.text) return;
    let user = global.db.data.users[m.sender];
    if (!user || !user.pinterest) return;
    let pending = user.pinterest;
    if (pending.chat !== m.chat) return;

    let text = m.text.trim().toLowerCase();
    let total = pending.total;
    let urls = pending.results;
    
    if (STOP_COMMANDS.includes(text)) {
      pending.cancelled = true;
      delete user.pinterest;
      global.db.data.users[m.sender] = user;
      return m.reply('❌ Permintaan Pinterest telah dibatalkan.');
    }

    if (text === 'semua' || text === 'all') {
      let count = total;
      pending.cancelled = false;
      global.db.data.users[m.sender] = user;

      if (count > MAX_IMAGE_SEND) {
        await m.reply(`⚠️ Total ${count} gambar ditemukan. Karena batas aman, bot hanya mengirimkan ${MAX_IMAGE_SEND} gambar pertama.`);
        await sendImages(this, m.chat, urls, MAX_IMAGE_SEND, m, () => pending.cancelled);
        let remaining = urls.slice(MAX_IMAGE_SEND);
        let extra = remaining.map((url, i) => `${MAX_IMAGE_SEND + i + 1}. ${url}`).join('\n');
        if (!pending.cancelled) {
          await this.sendMessage(m.chat, { text: `Link sisa gambar:\n\n${extra}` }, { quoted: m });
        }
        delete user.pinterest;
        global.db.data.users[m.sender] = user;
        return;
      }

      await sendImages(this, m.chat, urls, count, m, () => pending.cancelled);
      delete user.pinterest;
      global.db.data.users[m.sender] = user;
      return;
    }

    let requested = parseInt(text.replace(/[^0-9]/g, ''), 10);
    if (isNaN(requested)) return;
    if (requested < 1) return m.reply('Masukkan angka minimal 1.');
    if (requested > total) return m.reply(`Total gambar hanya ada *${total}*. Silakan balas ulang dengan angka yang benar.`);

    let count = requested;
    pending.cancelled = false;
    global.db.data.users[m.sender] = user;

    if (count > MAX_IMAGE_SEND) {
      await m.reply(`⚠️ Permintaan ${count} gambar. Karena batas aman, bot hanya mengirimkan ${MAX_IMAGE_SEND} gambar pertama.`);
      await sendImages(this, m.chat, urls, MAX_IMAGE_SEND, m, () => pending.cancelled);
      let extra = urls.slice(MAX_IMAGE_SEND, count).map((url, i) => `${MAX_IMAGE_SEND + i + 1}. ${url}`).join('\n');
      if (!pending.cancelled && extra) {
          await this.sendMessage(m.chat, { text: `Link sisa gambar:\n\n${extra}` }, { quoted: m });
      }
      delete user.pinterest;
      global.db.data.users[m.sender] = user;
      return;
    }

    await sendImages(this, m.chat, urls, count, m, () => pending.cancelled);
    delete user.pinterest;
    global.db.data.users[m.sender] = user;
  } catch (e) {
    console.error(e);
  }
};

handler.help = ['pinterest <keyword>'];
handler.tags = ['internet', 'downloader'];
handler.command = /^(pinterest|pin)$/i;

export default handler;