// @ts-nocheck
// Converted from plugins-esm - automated
let handler: WaPlugin = async (m, { conn, usedPrefix }) => {
    let id = m.chat
    conn.absen = conn.absen ? conn.absen : {}
    
    if (!(id in conn.absen)) throw `_*Tidak ada absen berlangsung digrup ini!*_\n\n*${usedPrefix}mulaiabsen* - untuk memulai absen`
    
    try {
        delete conn.absen[id]
        await m.reply(`Done!`)
    } catch (e) {
        console.log(e);
        throw e;
    }
}

handler.help = ['hapusabsen']
handler.tags = ['absen']
handler.command = /^(delete|hapus)absen$/i
handler.group = true
handler.admin = true

export default handler;
