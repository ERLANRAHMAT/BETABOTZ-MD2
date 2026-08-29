let handler = async (m, { conn, participants, groupMetadata, text }) => {

    const getGroupAdmins = (participants) => {
        let admins = []
        for (let i of participants) {
            if (i.admin === 'admin' || i.admin === 'superadmin') {
                admins.push(i.id)
            }
        }
        return admins
    }

    let pp = 'https://telegra.ph/file/3c1ea5866a11088685413.jpg'
    try {
        pp = await conn.profilePictureUrl(m.chat, 'image')
    } catch (e) {
    } finally {
        let chat = global.db.data.chats[m.chat] || {}
        
        const groupAdmins = getGroupAdmins(participants)
        let listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.split('@')[0]}`).join('\n')

        if (text && chat.expired) return m.reply(msToDate(chat.expired - new Date() * 1))

        let ownerGroup = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net'

        const check = (status) => status ? '✅' : '❌'

        let caption = `*🏢 INFORMASI GRUP*\n
*ID:* ${groupMetadata.id}
*Nama:* ${groupMetadata.subject}
*Total Anggota:* ${participants.length} Anggota
*Pembuat Grup:* @${ownerGroup.split("@")[0]}

*👨‍⚖️ Admin Grup:*
${listAdmin}

*🛡️ KEAMANAN & LINK*
${check(chat.adminonly)} Admin Only Mode
${check(chat.antiLink)} Anti Link (WA)
${check(chat.antiLinkCh)} Anti Link Channel
${check(chat.antilinkall)} Anti All Link
${check(chat.antilinkig)} Anti Link IG
${check(chat.antilinkyt)} Anti Link YT
${check(chat.antilinkfb)} Anti Link FB
${check(chat.antilinktwit)} Anti Link Twitter
${check(chat.antilinktt)} Anti Link TikTok
${check(chat.antilinktele)} Anti Link Telegram
${check(chat.antilinkwame)} Anti Link Wa.me
${check(chat.antispam)} Anti Spam bot

*👮 MODERASI GRUP*
${check(!chat.delete)} Anti Delete
${check(chat.antibot)} Anti Bot
${check(chat.antiToxic)} Anti Toxic
${check(chat.antiporn)} Anti Porn
${check(chat.antiSticker)} Anti Sticker
${check(chat.viewonce)} Anti ViewOnce
${check(chat.anticall)} Anti Call
${check(chat.antitagsw)} Anti Tag SW

*🤖 FITUR OTOMATIS*
${check(chat.welcome)} Welcome Message
${check(chat.detect)} Detect Event Grup
${check(chat.autodl)} Auto Download
${check(chat.autoacc)} Auto Accept
${check(chat.autohd)} Auto HD
${check(chat.autobio)} Auto Bio Grup
${check(chat.autobackup)} Auto Backup
${check(chat.autotranslate)} Auto Translate
${check(chat.autowm)} Auto Watermark

*🔔 PEMBERITAHUAN*
${check(chat.notifgempa)} Notif Gempa
${check(chat.notifcuaca)} Notif Cuaca
${check(chat.notifsholat)} Notif Sholat

*🎮 MODE INTERAKSI*
${check(chat.rpg)} Mode RPG
${check(chat.nsfw)} Mode NSFW
${check(chat.isBanned)} Bot Banned (Mute)

*💬 PESAN BOT*
*Welcome:* ${chat.sWelcome || "-"}
*Bye:* ${chat.sBye || "-"}
*Promote:* ${chat.sPromote || "-"}
*Demote:* ${chat.sDemote || "-"}

*⏳ SISA WAKTU (EXPIRED)*
${chat.expired ? msToDate(chat.expired - new Date() * 1) : "Permanen"}

*Deskripsi:* 
${groupMetadata.desc || "Tidak ada deskripsi"}
`.trim();

        let mentionedJid = groupAdmins.concat([ownerGroup])
        
        await conn.sendMessage(m.chat, {
            image: { url: pp },
            caption: caption,
            mentions: mentionedJid
        }, { quoted: m })
    }
}

handler.help = ['infogrup']
handler.tags = ['group']
handler.command = /^(gro?upinfo|info(gro?up|gc))$/i
handler.group = true

export default handler

function msToDate(ms) {
    if (ms < 0) return "Waktu telah habis"
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let daysms = ms % (24 * 60 * 60 * 1000);
    let hours = Math.floor((daysms) / (60 * 60 * 1000));
    let hoursms = ms % (60 * 60 * 1000);
    let minutes = Math.floor((hoursms) / (60 * 1000));
    return days + " hari " + hours + " jam " + minutes + " menit";
}