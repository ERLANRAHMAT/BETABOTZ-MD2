const fetch = require("node-fetch");

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `Masukkan URL!\n\nContoh:\n${usedPrefix + command} https://open.spotify.com/track/3zakx7RAwdkUQlOoQ7SJRt`;
  if (!args[0].match(/spotify/gi)) throw `URL Tidak Ditemukan!`;
  m.reply("Tunggu sebentar...");  
		const urll = args[0];
		const apis = await fetch(API('lann', '/api/download/spotify', { url: urll, apikey: lann }));
		if (!apis.ok) throw await apis.text()
var jsons = await apis.json()
if (!jsons.status) throw jsons
var { 
thumbnail, 
title,
name,
duration,
url
} = jsons.result.data
var { 
id,
type
} = jsons.result.data.artist
  var captionvid = `  
  ∘ Title: ${title}
  ∘ Id: ${id}
  ∘ Duration: ${duration}
  ∘ Type: ${type}`
    var pesan = await conn.sendMessage(m.chat, {
    text: captionvid,
    contextInfo: {
    externalAdReply: {
    title: "",
    body: "Powered by",
    thumbnailUrl: thumbnail ,
    sourceUrl: thumbnail,
    mediaType: 1,
    showAdAttribution: true,
    renderLargerThumbnail: true
    }}})
conn.sendMessage(m.chat, { audio: { url: url }, mimetype: 'audio/mpeg', contextInfo: {
    externalAdReply: {
    title: title,
    body: "",
    thumbnailUrl: thumbnail,
    sourceUrl: url,
    mediaType: 1,
    showAdAttribution: true,
    renderLargerThumbnail: true
    }}} , { quoted: pesan })
};
handler.help = ['spotifydl']
handler.command = /^(spotifydl|spotify)$/i
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
