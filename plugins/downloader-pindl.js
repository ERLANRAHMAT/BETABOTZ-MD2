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

    const api = await fetch(`https://api.betabotz.eu.org/api/download/pinterest?url=${args[0]}&apikey=${lann}`);
    const res = await api.json();

    if (!res.result || !res.result.success) throw `Gagal mengambil data dari API!`;

    let { media_type, image, title, pin_url, video } = res.result.data;

    if (media_type === 'video/mp4') {
      await conn.sendMessage(m.chat, {
        video: { url: video },
        caption: `*Title:* ${title || 'Tidak tersedia'}\n*Mediatype:* ${media_type}\n*Source Url:* ${pin_url}`
      });
    } else {
      await conn.sendMessage(m.chat, {
        image: { url: image },
        caption: `*Title:* ${title || 'Tidak tersedia'}\n*Mediatype:* ${media_type}\n*Source Url:* ${pin_url}`
      });
    }
  } catch (e) {
    console.error(e);
    throw `Terjadi kesalahan! Pastikan URL yang diberikan valid atau coba lagi nanti.`;
  }
};

handler.help = ['pindl'];
handler.command = /^(pindl|pindownload)$/i;
handler.tags = ['downloader'];
handler.limit = true;
handler.premium = false;

export default handler;
