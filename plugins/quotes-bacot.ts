
import fetch from 'node-fetch';
let handler: WaPlugin = async (m, { conn } ) => {   
    try {
      let res = await fetch(
        `https://api.betabotz.eu.org/api/random/bacot?apikey=${lann}`,
      ).then((result) => result.json());
      let anu = `
─────〔 *Bacot* 〕─────

${res.hasl}
`;
      conn.reply(m.chat, anu, m);
    } catch (e) {
      console.log(e);
      throw e;
    }
}
handler.help = ['bacot']
handler.tags = ['quotes']
handler.command = /^(bacot)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

export default handler;
