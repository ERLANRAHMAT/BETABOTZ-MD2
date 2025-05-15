let handler = m => m

handler.before = async function(m, { conn }) {
  if (!conn.msgStore) conn.msgStore = new Map()

  if (m.message?.protocolMessage?.type === 0) {
    if (!db.data.chats[m.chat]?.antidelete) return

    const { key } = m.message.protocolMessage
    const storeKey = `${key.remoteJid}|${key.id}`
    const deleted = conn.msgStore.get(storeKey)
    if (!deleted) return

    const type = Object.keys(deleted.message)[0]
    const content = deleted.message[type]

    try {
      if (typeof deleted.download === 'function') {
        const media = await deleted.download()
        const mType = type.replace('Message', '')
        const options = { quoted: deleted, [mType]: media }
        if (content.caption)     options.caption     = content.caption
        if (content.mimetype)    options.mimetype    = content.mimetype
        if (content.gifPlayback) options.gifPlayback = true
        if (content.ptt)         options.ptt         = true
        await conn.sendMessage(key.remoteJid, options)
      } else {
        const text = extractText(content, type)
        const mentions = content.mentions || []
        const msg = `*[ Anti Delete ]*\n\n📝 *Jenis:* _${type}_\n💬 *Pesan:* _${text}_` +
                    (mentions.length ? `\n\n*Mention:* ${mentions.join(' ')}` : '')
        await conn.sendMessage(key.remoteJid, { text: msg, mentions }, { quoted: deleted })
      }
    } catch {
      await conn.sendMessage(
        key.remoteJid,
        { text: '*Media yang dihapus tidak dapat dikembalikan.*' },
        { quoted: deleted }
      )
    }
    return
  }

  if (m.key && m.message) {
    const storeKey = `${m.key.remoteJid}|${m.key.id}`
    conn.msgStore.set(storeKey, m)
  }
}

function extractText(content, type) {
  if (type === 'conversation') return content
  if (type === 'extendedTextMessage') return content.text || content.caption
  if (type === 'buttonsMessage') return content.contentText
  if (type === 'buttonsResponseMessage') return content.selectedDisplayText
  if (type === 'templateMessage') {
    const t = content.hydratedTemplate || content
    const sub = Object.keys(t)[0]
    return extractText(t[sub], sub)
  }
  if (type === 'listMessage') return content.description || content.text
  if (type === 'listResponseMessage') return content.title || content.description
  if (type === 'hydratedTemplate') return content.hydratedContentText || content.contentText
  return content.text || content.caption || '[Tidak diketahui isi pesan]'
}

module.exports = handler;
