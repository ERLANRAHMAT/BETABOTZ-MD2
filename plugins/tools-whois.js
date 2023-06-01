const fetch = require('node-fetch');
const handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    throw `Masukkan Domain/Sub Domain!\n\n*Contoh:* betabotz.org`;
  }
  if (text.includes('https://') || text.includes('http://')) {
    throw `Tolong masukkan domain/sub domain secara lengkap. Contoh: betabotz.org`;
  }
const q = text
const get = await fetch(API('lann', '/api/webzone/whois', { query: q, apikey: lann }));
const gets = await get.json()
m.reply(gets.result.data)
};
handler.command = ['whois'];
handler.tags = ['internet'];
handler.premium = false;
module.exports = handler;