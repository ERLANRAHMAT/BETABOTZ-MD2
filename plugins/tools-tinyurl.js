import fetch from 'node-fetch';
let handler = async (m, { text }) => {
  try {
    if (!text)
      throw "Masukan url/link nya mana?\n> .tinyurl https://google.com";
    let res = await fetch(
      `https://api.betabotz.eu.org/api/tools/tinyurl?link=${text}&apikey=${lann}`,
    );
    let json = await res.json();
    if (json.status) m.reply(json.result);
    else throw "Link Invalid!\nPeriksa url anda";
  } catch (e) {
    console.log(e);
    throw e;
  }
}
handler.help = ['tinyurl'].map(v => v + ' <link>')
handler.tags = ['shortlink']
handler.command = /^tinyurl$/i

export default handler
