import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        if (!args[0]) throw `Link githubnya mana?\nContoh: ${usedPrefix + command} https://github.com/BOTCAHX/RTXZY-MD`;

        let regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/([^\/]+)(?:\/tree\/([^\/]+))?/i;
        
        if (!regex.test(args[0])) throw 'Link GitHub tidak valid!';

        let match = args[0].match(regex);
        let user = match[1];
        let repo = match[2].replace(/\.git$/, '');
        let branch = match[3];

        let url = branch 
            ? `https://api.github.com/repos/${user}/${repo}/zipball/${branch}`
            : `https://api.github.com/repos/${user}/${repo}/zipball`;

        await m.reply(wait);

        let response = await fetch(url, { method: 'HEAD' });
        if (response.status === 404) {
            throw 'Repository atau Branch GitHub tidak ditemukan (404). Pastikan link publik dan benar!';
        }

        let disposition = response.headers.get('content-disposition');
        let filename = disposition && disposition.includes('filename=') 
            ? disposition.split('filename=')[1].replace(/["']/g, '') 
            : `${repo}${branch ? '-' + branch : ''}.zip`;

        await conn.sendMessage(m.chat, { 
            document: { url: url }, 
            mimetype: 'application/zip', 
            fileName: filename 
        }, { quoted: m });

    } catch (e) {
        if (e !== false) {
            console.log(e);
            throw e;
        }
    }
}

handler.help = ['gitclone <url>'];
handler.tags = ['github'];
handler.command = /^gitclone$/i;
handler.limit = true;

export default handler;