// @ts-nocheck
// Converted from plugins-esm - automated
import fetch from 'node-fetch';
let handler: WaPlugin = async (m, { text, usedPrefix, command }) => {
  if (!text) throw(`Input Text Dan Karakter!\nExample: ${usedPrefix + command} hai Kirito|Kirito`)    
  try {
    let [ prompt, logic ] = text.split('|')
    m.reply(`Tunggu sebentar...`)
    let res = await fetch(`https://api.betabotz.eu.org/api/search/c-ai?prompt=${prompt}?&char=${logic}&apikey=${lann}`)
    let json = await res.json()
    m.reply(json.message)
  } catch (e) {
    console.log(e);
    throw e;
  }
}

handler.command = handler.help = ['c-ai','character-ai']
handler.tags = ['tools']
handler.owner = false
handler.limit = false
handler.group = false
handler.private = false

export default handler;
