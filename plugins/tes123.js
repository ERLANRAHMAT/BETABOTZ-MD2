let handler = async (m, { conn }) => {
    let wm = global.wm
    let _uptime = process.uptime() * 1000
    let uptimex = clockString(_uptime)
    let txt = `*_Aktif Kak ada yang saya bisa bantu\nketik .menu untuk mengakses bot_*`.trim()
let sgc = global.gc
conn.sendMessage(m.chat, {
text: txt,
contextInfo: { forwardingScore: 9999, isForwarded: true, 
externalAdReply: {
title: ucapan,
body: wm,
thumbnailUrl: img,
sourceUrl: instagram,
mediaType: 1,
renderLargerThumbnail: true
}}},
{ quoted: m })
}
handler.help = ['mode']
handler.tags = ['main']

handler.customPrefix = /^(tes|bot|p|test)$/i
handler.command = new RegExp
handler.limit = false

module.exports = handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function clockString(ms) {
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let daysms = ms % (24 * 60 * 60 * 1000);
    let hours = Math.floor((daysms) / (60 * 60 * 1000));
    let hoursms = ms % (60 * 60 * 1000);
    let minutes = Math.floor((hoursms) / (60 * 1000));
    let minutesms = ms % (60 * 1000);
    let sec = Math.floor((minutesms) / (1000));
    return days + " Hari " + hours + " Jam " + minutes + " Menit " + sec + " Detik";
  }
