const axios = require('axios');

let handler = async (m, {conn, text, usedPrefix, command}) => {
    if (!text) throw `Masukan nama Hp!\n\nContoh:\n${usedPrefix + command} oppo`;
    m.reply(wait);
    const response = await axios.get(`https://api.betabotz.eu.org/api/search/ringtone?text1=${text}&apikey=${lann}`);
    global.res = [

        `${response.data.result[0].audio}`,
        `${response.data.result[1].audio}`,
        `${response.data.result[2].audio}`,
        `${response.data.result[3].audio}`,
        `${response.data.result[4].audio}`,
        `${response.data.result[5].audio}`,
        `${response.data.result[6].audio}`,
        `${response.data.result[7].audio}`,
        `${response.data.result[8].audio}`,
        `${response.data.result[9].audio}`,
        `${response.data.result[10].audio}`,
        `${response.data.result[11].audio}`,
        `${response.data.result[12].audio}`,
    ]
    await conn.sendFile(m.chat, `${pickRandom(global.res)}`, null, m);

}

handler.help = ['ringtone']
handler.tags = ['internet']
handler.command = /^(ringtone)$/i
handler.group = false
handler.limit = true
    
module.exports = handler


function pickRandom(list) {
    return list[Math.floor(list.length * Math.random())]
  }