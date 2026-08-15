// @ts-nocheck
// Converted from plugins-esm - automated
let handler: WaPlugin = async (m, { conn, usedPrefix }) => {
    let id = m.chat
    conn.giveway = conn.giveway ? conn.giveway : {}
    
    if (!(id in conn.giveway)) throw `_*Tidak ada GIVEAWAY berlangsung digrup ini!*_\n\n*${usedPrefix}mulaigiveaway* - untuk memulai giveaway`

    if (!conn.giveway[id][3] || conn.giveway[id][3].length === 0) {
        throw `_*Belum ada pemenang yang di-roll!*_\nSilakan gunakan *${usedPrefix}rollgiveaway* terlebih dahulu.`
    }

    let d = new Date
    let date = d.toLocaleDateString('id', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
    
    let winners = conn.giveway[id][3]
    let list = winners.map((v, i) => `│ ${i + 1}. @${v.split`@`[0]}`).join('\n')
    
    conn.reply(m.chat, `*「 LIST PEMENANG GIVEAWAY 」*

Tanggal: ${date}
${conn.giveway[id][2] || ''}

┌ *Daftar Pemenang:*
│ 
│ Total: ${winners.length} Orang
${list}
│ 
└────

_${global.wm}_`, m, { contextInfo: { mentionedJid: winners } })
}

handler.help = ['cekmenang']
handler.tags = ['adminry', 'group']
handler.command = /^(cekmenang|listpemenang)$/i
handler.admin = true

export default handler;
