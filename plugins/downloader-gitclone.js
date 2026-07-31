let regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
import fetch from 'node-fetch';
let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        if (!args[0]) throw 'link githubnya mana? contoh: https://github.com/BOTCAHX/RTXZY-MD'

        if (!regex.test(args[0])) throw 'link salah!'

        let [, user, repo] = args[0].match(regex) || []
        repo = repo.replace(/.git$/, '')
        let url = `https://api.github.com/repos/${user}/${repo}/zipball`
        let response = await fetch(url, { method: 'HEAD' })
        let disposition = response.headers.get('content-disposition')
        let filename = disposition ? disposition.match(/attachment; filename=(.*)/)[1] : `${repo}.zip`
        m.reply(wait)
        await conn.sendMessage(m.chat, { document: { url: url }, mimetype: 'application/zip', fileName: filename.replace('.zip.zip','.zip')}, { quoted : m })
    } catch (e) {
        if (e !== false) {
            console.log(e);
            throw e;
        }
    }
}
handler.help = ['gitclone <url>']
handler.tags = ['github']
handler.command = /gitclone/i

handler.limit = true

export default handler;