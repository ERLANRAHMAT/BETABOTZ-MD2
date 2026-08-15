
import fetch from 'node-fetch';

let handler: WaPlugin = async (m, { conn }) => {   
    try {
        let res = await fetch(`https://api.betabotz.eu.org/api/webzone/gore?apikey=${lann}`).then(result => result.json());
        
        let anu = `
─────> *GORE* <─────

*JUDUL*:
${res.result.title}\n
*AUTHOR*: ${res.result.author}
*VIEW*: ${res.result.views}
*COMMENT*: ${res.result.comments}
*LINK*: ${res.result.url}\n
\`gunakan vpn jika ingin menonton\`
`;

        conn.sendMessage(m.chat, {
            text: anu,
            mentions: [m.sender]
        }, {});
    } catch (e) {
        if (e !== false) {
            console.log(e);
            throw e;
        }
    }
}

handler.help = ['gore']
handler.tags = ['internet', 'downloader'];
handler.command = /^(gore)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

export default handler;
