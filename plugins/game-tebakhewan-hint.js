/*
wa.me/6282285357346
github: https://github.com/sadxzyq
Instagram: https://instagram.com/tulisan.ku.id
*/

let handler = async (m, { conn }) => {
    conn.tebakhewan = conn.tebakhewan ? conn.tebakhewan : {}
    let id = m.chat
    if (!(id in conn.tebakhewan)) throw false
    let json = conn.tebakhewan[id][1]
    conn.reply(m.chat, '```' + json.title.replace(/[AIUEOaiueo]/ig, '_') + '```', m)
}
handler.command = /^hhew$/i

handler.limit = true

module.exports = handler

//danaputra133