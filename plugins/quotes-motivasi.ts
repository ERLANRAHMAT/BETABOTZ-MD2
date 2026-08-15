// @ts-nocheck
// Converted from plugins-esm - automated
import fetch from 'node-fetch';
let handler: WaPlugin = async (m, { conn }) => {
try {
  let res = await fetch(`https://api.betabotz.eu.org/api/random/motivasi?&apikey=${lann}`);
  let json = await res.json()
  conn.reply(m.chat, `―MOTIVASI―\n\n"${json.result}"`,);
} catch (e) {
        console.log(e);
        throw e;
    }
}
handler.help = ['motivasi']
handler.tags = ['quotes']
handler.command = /^(motivasi)$/i

export default handler;
