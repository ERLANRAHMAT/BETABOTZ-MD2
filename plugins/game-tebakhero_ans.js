/*
    made by adrianMD
    ch: https://whatsapp.com/channel/0029VaWXWTD8kyyOvgdf1o3x
    
    do not remove the watermark!! 
    
Thank you for using this code ^-^
edit dikit sama dana
*/
let similarity = require('similarity')
const threshold = 0.72

let handler = m => m
handler.before = async function(m) {
    let id = 'tebakheroml-' + m.chat
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text || !/Ketik.*temel/i.test(m.quoted.text) || /.*temel/i.test(m.text))
        return !0
    this.tebakheroml = this.tebakheroml ? this.tebakheroml : {}
    if (!(id in this.tebakheroml))
        return m.reply('Soal itu telah berakhir')
    if (m.quoted.id == this.tebakheroml[id][0].id) {
        let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            clearTimeout(this.tebakheroml[id][3])
            delete this.tebakheroml[id]
            return m.reply('*Yah Menyerah :(*')
        }
        let json = JSON.parse(JSON.stringify(this.tebakheroml[id][1]))
        //m.reply(JSON.stringify(json, null, '\t'))
        if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += this.tebakheroml[id][2]
            // benar
            conn.reply(m.chat, `Jawaban benar ✅\n+${this.tebakheroml[id][2]} Exp`, m) 
            clearTimeout(this.tebakheroml[id][3])
            delete this.tebakheroml[id]
        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold)
            m.reply(`*Dikit Lagi!*`)
        else
            // salah
            // sticker
            conn.sendImageAsSticker(m.chat, 'https://telegra.ph/file/360d553042f5072e9442d.jpg', m, { packname: global.packname, author: global.author })
            // no sticker
            //conn.reply(m.chat, 'Salah ❌', m)
    }
    return !0
}
handler.exp = 0

module.exports = handler