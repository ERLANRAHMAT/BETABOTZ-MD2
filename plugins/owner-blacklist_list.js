let handler = async (m, { conn }) => {
  if (!global.db.data.globalBlacklist) global.db.data.globalBlacklist = [];
  let globalBlacklist = global.db.data.globalBlacklist;

  if (globalBlacklist.length === 0)
    return m.reply("Daftar *Blacklist Global* saat ini masih kosong.");

  // Hilangkan duplikasi berdasarkan angka nomor murninya agar tidak dobel di list
  let uniqueList = [];
  let seenNumbers = new Set();

  for (let id of globalBlacklist) {
    let cleanNum = id.split("@")[0].split(":")[0];
    if (!seenNumbers.has(cleanNum)) {
      seenNumbers.add(cleanNum);
      uniqueList.push(id);
    }
  }

  let txt = `*「 Daftar Nomor Blacklist Global 」*\n\n*Total:* ${uniqueList.length}\n\n┌─[ *Blacklist* ]\n`;
  for (let id of uniqueList) {
    let num = id.split("@")[0];
    let type = id.includes("@lid") ? "(LID)" : "(WA)";
    txt += `├ @${num} _${type}_\n`;
  }
  txt += "└─•";

  return conn.reply(m.chat, txt, m, {
    contextInfo: { mentionedJid: uniqueList },
  });
};

handler.help = ["listblacklist", "listbl"];
handler.tags = ["owner"];
handler.command = /^(listblacklist|listbl)$/i;
handler.owner = true;

export default handler;
