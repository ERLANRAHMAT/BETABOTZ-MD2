let handler = async (m, { conn }) => {
    try {
        conn.reply(m.chat, `
*DAFTAR HASH*
\`\`\`
${Object.entries(global.db.data.sticker).map(([key, value], index) => `${index + 1}. ${value.locked ? `(Terkunci) ${key}` : key} : ${value.text}`).join('\n')}
\`\`\`
`.trim(), null, {
            mentions: Object.values(global.db.data.sticker).map(x => x.mentionedJid).reduce((a, b) => [...a, ...b], [])
        })
    } catch (e) {
        console.log(e);
        throw e;
    }
}


handler.help = ['listcmd']
handler.tags = ['database', 'premium']
handler.command = ['listcmd', 'infocmd']

export default handler;