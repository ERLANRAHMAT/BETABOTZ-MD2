// @ts-nocheck
// Converted from plugins-esm - automated
 import fetch from 'node-fetch';

let handler: WaPlugin = async (m, { conn }) => {
  try {
  let res = await fetch(`https://api.betabotz.eu.org/api/random/taugasih?apikey=${lann}`).then(result => result.json());
  conn.reply(m.chat, `“${res.taugasih}”`, m);
  } catch (e) {
    console.log(e);
    throw e;
  }
};

handler.help = ['taugasih'];
handler.tags = ['fun'];
handler.command = /^(taugasih)$/i;
handler.limit = true;
handler.admin = false;
handler.fail = null;

export default handler;
