
let handler: WaPlugin = async (m, { conn, usedPrefix }) => {
    let id = m.chat
    conn.absen = conn.absen ? conn.absen : {}
    
    if (!(id in conn.absen)) throw `_*Mohon maaf, Tidak ada absen hari ini !*_\n\n*${usedPrefix}ᴍᴜʟᴀɪᴀʙꜱᴇɴ* - ᴜɴᴛᴜᴋ ᴍᴇᴍᴜʟᴀɪ ᴀʙꜱᴇɴ`

    let absen = conn.absen[id][1]
    const wasVote = absen.includes(m.sender)
    
    if (wasVote) throw '*Kamu sudah absen bang！🙄*'

    try {
        absen.push(m.sender)
        await m.reply(`Done!`)
        
        let d = new Date
        let date = d.toLocaleDateString('id', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        
        let list = absen.map((v, i) => `├ ${i + 1}. @${v.split`@`[0]}`).join('\n')
        let caption = `
Tanggal: ${date}
${conn.absen[id][2]}
┌「 *Absen* 」  
├ Total: ${absen.length}
${list} 
└────
_Silahkan Ketik ${usedPrefix}absen Untuk Absen_
_Ketik ${usedPrefix}cekabsen Untuk Cek Absen_`.trim()
        
        await conn.reply(m.chat, caption, m, { contextInfo: { mentionedJid: absen } })
    } catch (e) {
        console.log(e);
        throw e;
    }
}

handler.help = ['absen']
handler.tags = ['group']
handler.command = /^(absen|hadir)$/i
handler.group = true

export default handler;
