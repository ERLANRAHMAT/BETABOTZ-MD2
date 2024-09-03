/*
    made by adrianMD
    ch: https://whatsapp.com/channel/0029VaWXWTD8kyyOvgdf1o3x
    
    do not remove the watermark!! 
    
Thank you for using this code ^-^
edit dikit sama dana
*/

let handler = async (m, { conn }) => {
    conn.tebakheroml = conn.tebakheroml ? conn.tebakheroml : {}
    let id = 'tebakheroml-' + m.chat
    if (!(id in conn.tebakheroml)) throw false
    let json = conn.tebakheroml[id][1]
    m.reply('Clue : ' + '```' + json.jawaban.replace(/[AIUEOaiueo]/ig, '_') + '```' + '\n\n_*Jangan Balas Chat Ini Tapi Balas Soalnya*_')
}
handler.command = /^temel$/i
handler.limit = true
module.exports = handler