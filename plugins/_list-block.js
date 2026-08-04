import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  try {
    let block = await conn.fetchBlocklist() || [];
    let text = `List Block:\n\nTotal: *${block.length}* Diblokir\n` + block.map(v => '乂 @' + v.replace(/@.+/, '')).join('\n');
    await conn.reply(m.chat, text, m, { mentions: block });
  } catch (e) {
    console.log(e);
    throw e;
  }
};

handler.help = ['blocklist'];
handler.tags = ['info'];
handler.command = /^listbloc?k|bloc?klist|daftarbloc?k|blocks$/i;
handler.owner = false;

export default handler;