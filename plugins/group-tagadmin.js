let handler = async (m, { conn, participants, groupMetadata }) => {

    const getGroupAdmins = (participants) => {
        let admins = []
        for (let i of participants) {
            if (i.admin === "admin" || i.admin === "superadmin") {
                admins.push(i.id)
            }
        }
        return admins
    }

    let pp = './src/avatar_contact.png'
    try {
        pp = await conn.profilePictureUrl(m.chat, 'image')
    } catch (e) {
    } finally {
        let ownerGroup = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
        
        const groupAdmins = getGroupAdmins(participants)
        let listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.split('@')[0]}`).join('\n')
        
        let text = `*「 TAG ADMIN 」*\n

*Name:* 
${groupMetadata.subject}

*Group Owner:* 
@${ownerGroup.split('@')[0]}

*Group Admins:*
${listAdmin}
`.trim()

        let ownernya = [ownerGroup]
        let mentionedJid = groupAdmins.concat(ownernya)
        
        conn.sendFile(m.key.remoteJid, pp, 'pp.jpg', text, m, false, { contextInfo: { mentionedJid } })
    }
}
handler.help = ['tagadmin']
handler.tags = ['group']
handler.command = /^(tagadmin)$/i

handler.group = true

export default handler