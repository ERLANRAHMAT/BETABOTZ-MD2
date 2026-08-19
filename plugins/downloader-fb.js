import fetch from 'node-fetch';
var handler = async (m, { conn, args, usedPrefix, command }) => {
if (!args[0]) throw `Masukan URL!\n\ncontoh:\n${usedPrefix + command} https://www.facebook.com/100084756252836/videos/3391018171153874/?idorvanity=2765173437119338&mibextid=rS40aB7S9Ucbxw6v`;
if (!args[0].match(/https?:\/\/(www\.|m\.|web\.)?(facebook\.com|fb\.watch|fb\.gg)/gi)) throw "❌ URL Facebook Tidak Ditemukan!";
  try {
    m.reply('*Please wait..*');
const url = args[0];
const get = await fetch(`https://api.betabotz.eu.org/api/download/fbdown?url=${url}&apikey=${lann}`);
var js = await get.json()   
conn.sendFile(m.chat, js.result[0]._url, 'fb.mp4', '', m);
  } catch (e) {
      console.log(e);
      throw e;
  }
};
handler.help = ['facebook'];
handler.command = /^(fb|facebook|facebookdl|fbdl|fbdown|dlfb)$/i;
handler.tags = ['downloader'];
handler.limit = true;
handler.group = true;
handler.premium = false;
handler.owner = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;
handler.private = false;
export default handler;
