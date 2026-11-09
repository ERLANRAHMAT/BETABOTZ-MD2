import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `Masukkan URL!\n\nContoh:\n${usedPrefix}${command} https://pin.it/4CVodSq`;
  }
  if (!args[0].startsWith('https://')) {
    throw `Harus memasukkan URL yang valid dengan format *https://*\n\nContoh: https://pin.it/4CVodSq`;
  }

  try {
    m.reply('Mohon tunggu, sedang memproses...');

    const api = await fetch(`https://api.betabotz.eu.org/api/download/pinterest?url=${encodeURIComponent(args[0].trim())}&apikey=${lann}`);
    const res = await api.json();

    if (!res.success || !res.result?.data) throw `Gagal mengambil data dari API!`;

    let { media_type, image, pin_title, title, pin_url, video } = res.result.data;
    let displayTitle = pin_title || (title && title !== 'Pinterest Downloader' ? title : 'Pinterest Media');

    if (video || (media_type && media_type.includes('video'))) {
      await conn.sendMessage(m.chat, {
        video: { url: video },
        caption: `*Title:* ${displayTitle}\n*Mediatype:* ${media_type || '-'}\n*Source Url:* ${pin_url}`
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, {
        image: { url: image },
        caption: `*Title:* ${displayTitle}\n*Mediatype:* ${media_type || '-'}\n*Source Url:* ${pin_url}`
      }, { quoted: m });
    }
  } catch (e) {
      console.log(e);
      throw e;
  }
};

handler.help = ['pindl'];
handler.command = /^(pindl|pindownload)$/i;
handler.tags = ['downloader'];
handler.limit = true;
handler.premium = false;

export default handler;
