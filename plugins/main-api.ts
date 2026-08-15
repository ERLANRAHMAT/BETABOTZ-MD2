// @ts-nocheck
// Converted from plugins-esm - automated
import fetch from 'node-fetch';
let handler: WaPlugin = async (m, { text }) => {
if (!text) throw `Masukan Apikey!`
  try {
    let api = await fetch(`https://api.betabotz.eu.org/api/checkkey?apikey=${text}`)
    let body = await api.text()
    m.reply(body)  
  } catch (e) {
    console.log(e) 
    m.reply('Apikey tidak terdaftar!')
  }
}          
handler.command = handler.help = ['checkapi','api'];
handler.tags = ['main'];
handler.private = true

export default handler;
