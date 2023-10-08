const fetch = require('node-fetch');

let handler = async (m, { conn, args, usedPrefix, command }) => {
 if (!args[0]) {
      throw `Masukkan URL!\n\ncontoh:\n${usedPrefix}${command} https://pin.it/4CVodSq`;
    }  
   try {    
    m.reply('*Mohon tunggu...*');
    const api = await fetch(API('lann', '/api/download/pinterest', { url: `${args[0]}`, apikey: lann }));
    const res = await api.json();  
    var { pin_url, media_type, image } = res.result.data;  
    conn.sendFile(m.chat, image, null, `*Url:* ${pin_url}\n*Mediatype:* ${media_type}\n*Url Download*: ${image}\n`, m);
  } catch (e) {
    console.log(e);
    throw `Terjadi kesalahan!`;
  }
};

handler.help = ['pindl'];
handler.command = /^(pindl)$/i;
handler.tags = ['downloader'];
handler.limit = true;
handler.group = false;
handler.premium = false;
handler.owner = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;
handler.private = false;

module.exports = handler;
