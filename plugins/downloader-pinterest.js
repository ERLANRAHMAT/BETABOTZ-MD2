import fetch from 'node-fetch';
;

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

let handler = async (m, { conn, usedPrefix, command, args }) => {
  try {
      if (!args[0]) throw `*🚩 Example:* ${usedPrefix}${command} minato aqua`;
    await m.reply('Sedang mencari...');

    const q = encodeURIComponent(args.join(' '));
    let response = await fetch(`https://api.betabotz.eu.org/api/search/pinterest?text1=${q}&apikey=${lann}`);
    let data = await response.json();
    let res = Array.isArray(data.result) ? data.result.filter(Boolean) : [];

    if (res.length < 1) return m.reply('Error, Foto Tidak Ditemukan');

    let user = global.db.data.users[m.sender] || {};
    user.pinterest = {
      step: 'ask',
      query: args.join(' '),
      results: res,
      total: res.length,
      chat: m.chat,
      ts: Date.now(),
      cancelled: false,
    };
    global.db.data.users[m.sender] = user;

    return m.reply(`Total ditemukan ada *${res.length}* gambar.
Balas dengan angka berapa yang ingin ditampilkan, balas dengan *semua* jika ingin menampilkan semuanya, atau ketik *stop* untuk membatalkan.`);
  } catch (e) {
    if (e !== false) {
      console.log(e);
      throw e;
    }
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
      return m.reply('Permintaan Pinterest telah dibatalkan.');
    }

    if (text === 'semua' || text === 'all') {
      let count = total;
      pending.cancelled = false;
      global.db.data.users[m.sender] = user;

      if (count > MAX_IMAGE_SEND) {
        await m.reply(`Total ${count} gambar ditemukan.`);
        await sendImages(this, m.chat, urls, MAX_IMAGE_SEND, m, () => pending.cancelled);
        let remaining = urls.slice(MAX_IMAGE_SEND);
        let extra = remaining.map((url, i) => `${MAX_IMAGE_SEND + i + 1}. ${url}`).join('\n');
        if (!pending.cancelled) {
          await this.sendMessage(m.chat, { text: `Link gambar sisanya:\n${extra}` }, { quoted: m });
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
    if (requested > total) return m.reply(`Total hanya *${total}*. Silakan reply ulang dengan angka yang benar.`);

    let count = requested;
    pending.cancelled = false;
    global.db.data.users[m.sender] = user;

    if (count > MAX_IMAGE_SEND) {
      await m.reply(`Permintaan ${count} gambar. Karena batas aman, saya mengirim ${MAX_IMAGE_SEND} gambar pertama saja.`);
      await sendImages(this, m.chat, urls, MAX_IMAGE_SEND, m, () => pending.cancelled);
      let extra = urls.slice(MAX_IMAGE_SEND, count).map((url, i) => `${MAX_IMAGE_SEND + i + 1}. ${url}`).join('\n');
      if (!pending.cancelled && extra) await this.sendMessage(m.chat, { text: `Link gambar sisanya:\n${extra}` }, { quoted: m });
      delete user.pinterest;
      global.db.data.users[m.sender] = user;
      return;
    }

    await sendImages(this, m.chat, urls, count, m, () => pending.cancelled);
    delete user.pinterest;
    global.db.data.users[m.sender] = user;
  } catch (e) {
    if (e !== false) {
      console.log(e);
      throw e;
    }
  }
};

handler.help = ['pinterest <keyword>'];
handler.tags = ['internet', 'downloader'];
handler.command = /^(pinterest|pin)$/i;

export default handler;