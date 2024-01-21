let handler = async(m, { conn }) => {
  const asupan = [
    `https://api.betabotz.eu.org/api/asupan/rikagusriani?apikey=${lann}`,
    `https://api.betabotz.eu.org/api/asupan/santuy?apikey=${lann}`,
    `https://api.betabotz.eu.org/api/asupan/ukhty?apikey=${lann}`,
    `https://api.betabotz.eu.org/api/asupan/bocil?apikey=${lann}`,
    `https://api.betabotz.eu.org/api/asupan/gheayubi?apikey=${lann}`,
    `https://api.betabotz.eu.org/api/asupan/natajadeh?apikey=${lann}`,
    `https://api.betabotz.eu.org/api/asupan/euni?apikey=${lann}`,
    `https://api.betabotz.eu.org/api/asupan/douyin?apikey=${lann}`,
    `https://api.betabotz.eu.org/api/api/asupan/cecan?apikey=${lann}`,
    `https://api.betabotz.eu.org/api/api/asupan/hijaber?apikey=${lann}`,
    `https://api.betabotz.eu.org/api/api/asupan/asupan?apikey=${lann}`,
    `https://api.betabotz.eu.org/api/api/asupan/anony?apikey=${lann}`   
  ]
  try {
    const url = pickRandom(asupan);
    await conn.sendFile(m.chat, url, null, '', m);
  } catch (e) {
    console.log(e);
    m.reply('Maaf, video asupan tidak ditemukan');
  }
}

handler.help = ['asupan']
handler.tags = ['downloader']
handler.command = /^asupan$/i
handler.owner = false
handler.premium = false
handler.group = false
handler.private = false

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

module.exports = handler
