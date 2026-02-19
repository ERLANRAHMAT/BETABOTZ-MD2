let handler = async (m, { conn }) => {
let ye = `@${m.sender.split`@`[0]}`;
let esce = `
Hai ${ye} Bot Ini Menggunakan Script :\n• https://github.com/ERLANRAHMAT/BETABOTZ-MD2 \ndan customasi dari\nhttps://github.com/DanaPutra133/AQUABOT-V4
\n jangan lupa di follow dan Bintang nya! :)
`;
  m.reply(esce);
};
handler.help = ["sc", "sourcecode"];
handler.tags = ["info"];
handler.command = /^(sc|sourcecode)$/i;

module.exports = handler;
