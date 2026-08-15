// @ts-nocheck
// Converted from plugins-esm - automated
let handler: WaPlugin = async (m, { conn }) => {
    conn.tebakgambar = conn.tebakgambar ? conn.tebakgambar : {}
    let id = m.chat
    if (!(id in conn.tebakgambar)) throw "Belum ada soal di chat ini!";
    let json = conn.tebakgambar[id][1]
    m.reply('```' + json.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/gi, '_') + '```\n*BALAS SOALNYA, BUKAN PESAN INI!*')
}
handler.command = /^hint$/i

handler.limit = true

export default handler;
