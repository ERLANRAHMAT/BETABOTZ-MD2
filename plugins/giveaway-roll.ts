// @ts-nocheck
// Converted from plugins-esm - automated
let handler: WaPlugin = async (m, { conn, usedPrefix }) => {
    let id = m.chat
    conn.giveway = conn.giveway ? conn.giveway : {}
    
    if (!(id in conn.giveway)) throw `_*Tidak ada GIVEAWAY berlangsung digrup ini!*_\n\n*${usedPrefix}mulaigiveaway* - untuk memulai giveaway`

    let d = new Date
    let date = d.toLocaleDateString('id', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
    
    let absen = conn.giveway[id][1]
    
    if (absen.length === 0) throw `_*Belum ada peserta yang mengikuti giveaway ini!*_`
    
    if (!conn.giveway[id][3]) conn.giveway[id][3] = [] 
    let winners = conn.giveway[id][3]
        let sisaPeserta = absen.filter(user => !winners.includes(user))
    
    if (sisaPeserta.length === 0) {
        throw `_*Semua peserta di grup ini sudah terpilih menjadi pemenang!*_\nTidak ada lagi sisa peserta untuk di-roll.`
    }
    
    let cita = sisaPeserta[Math.floor(Math.random() * sisaPeserta.length)]
    conn.giveway[id][3].push(cita) 

    let tag = `@${cita.split`@`[0]}`
    let loadd = [
        '*Mendapatkan Pemenangnya*'
    ]

    let { key } = await conn.sendMessage(m.chat, {text: '*Mencari Pemenangnya*'})

    for (let i = 0; i < loadd.length; i++) {
        await sleep(1000)
        await conn.sendMessage(m.chat, {text: loadd[i], edit: key })
    } 
    
    return conn.reply(m.chat, `🎊 *CONGRATULATIONS* 🎉
${tag} Kamu Pemenang Giveawaynya🎉

Tanggal: ${date}
————————————————————————
_*Note:* Hapus giveaway setelah selesai dengan menulis *.hapusgiveaway*_`, m, { contextInfo: { mentionedJid: [cita] } })
}

handler.help = ['rollgiveaway']
handler.tags = ['adminry', 'group']
handler.command = /^(rolling|rollgiveaway|rollinggiveaway)$/i
handler.admin = true


const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default handler;
