let handler = async (m, { conn }) => {
let ye = `@${m.sender.split`@`[0]}`
let esce = `
Hai ${ye} Bot Ini Menggunakan Script :\n\n• https://github.com/BOTCAHX/RTXZY-MD ( Original Script )\n\n• https://github.com/ERLANRAHMAT/Betabotz-Md2 ( Recode Full My Api )
`
m.reply(esce)
}
handler.help = ['sc', 'sourcecode']
handler.tags = ['info']
handler.command = /^(sc|sourcecode)$/i

module.exports = handler