// @ts-nocheck
let handler: WaPlugin = async (m, { conn, args, command }) => {
	let group = m.chat
        await m.reply('Bot akan keluar dari group', m.chat) 
        await sleep(1000)
        await conn.groupLeave(group)
        }
handler.command = handler.help = ['out', 'leavegc']
handler.tags = ['group']

handler.owner = true



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default handler;
