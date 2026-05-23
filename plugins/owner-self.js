let handler = async (m, { conn, command }) => {
  const isPublic = command === "public";
  global.opts = global.opts || {};

  if (isPublic) {
    if (!global.opts.self) return m.reply("Bot sudah dalam mode Public.");
    global.opts.self = false;
    return m.reply("Berhasil mengubah ke mode Public!");
  } else {
    if (global.opts.self) return m.reply("Bot sudah dalam mode Self.");
    global.opts.self = true;
    return m.reply("Berhasil mengubah ke mode Self!");
  }
};

handler.help = ["self", "public"]
handler.tags = ["owner"]

handler.owner = true

handler.command = /^(self|public)/i

module.exports = handler
