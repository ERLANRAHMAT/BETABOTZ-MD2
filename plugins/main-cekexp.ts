// @ts-nocheck
// Converted from plugins-esm - automated
import fetch from 'node-fetch';
let handler: WaPlugin = async (m, { text }) => {
if (!text) throw `Masukan Username Di Website Api!`
  try {
    let api = await fetch(`https://api.betabotz.eu.org/api/checkexp?username=${text}`)
    let body = await api.text()
    m.reply(body)  
  } catch (e) {
    console.log(e) 
    m.reply('Username tidak terdaftar!')
  }
}          
handler.command = handler.help = ['checkexp','cekexp', 'expapi'];
handler.tags = ['main'];
handler.private = true;
handler.owner = true;
handler.rowner = true;

export default handler;
