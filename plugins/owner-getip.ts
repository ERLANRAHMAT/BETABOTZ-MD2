// @ts-nocheck
// Converted from plugins-esm - automated
import fetch from 'node-fetch';

let handler: WaPlugin = async (m, { conn }) => {
  let ip = await fetch(`https://api.betabotz.eu.org/ip`).then(response => response.text());
  let message = `your ip: ${ip}`
m.reply(message)
};

handler.help = ['getip']
handler.tags = ['inownerfo']
handler.command = /^(getip)$/i;

export default handler;
