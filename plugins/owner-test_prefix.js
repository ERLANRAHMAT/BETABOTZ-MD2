let handler = async (m, { conn }) => {
    m.reply(`global.prefix = ${global.prefix}\ntypeof global.prefix = ${typeof global.prefix}\nconn.prefix = ${conn.prefix}\ntypeof conn.prefix = ${typeof conn.prefix}`);
}
handler.command = /^(testprefix)$/i
handler.owner = true
export default handler;
