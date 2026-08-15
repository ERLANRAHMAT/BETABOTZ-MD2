// @ts-nocheck
// Converted from plugins-esm - automated
let handler: WaPlugin = async (m, { conn, usedPrefix }) => {
    let id = m.chat
    conn.absen = conn.absen ? conn.absen : {}
    
    if (!(id in conn.absen)) throw `_*Tidak ada absen berlangsung digrup ini!*_\n\n*${usedPrefix}mulaiabsen* - untuk memulai absen`

    try {
        let d = new Date
        let date = d.toLocaleDateString('id', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        let absen = conn.absen[id][1]
        let list = absen.map((v, i) => `│ ${i + 1}. @${v.split`@`[0]}`).join('\n')
        
        await conn.reply(m.chat, `*「 ABSEN 」*

Tanggal: ${date}
${conn.absen[id][2]}

┌ *Yang sudah absen:*
│ 
│ Total: ${absen.length}
${list}
│ 
└────

_${global.wm}_`, m, { contextInfo: { mentionedJid: absen } })
    } catch (e) {
        console.log(e);
        throw e;
    }
}

handler.help = ['cekabsen']
handler.tags = ['absen']
handler.command = /^cekabsen$/i
handler.group = true

export default handler;
