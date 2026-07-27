let handler = async (m, { conn, groupMetadata }) => {
  try {
    const participants = groupMetadata ? groupMetadata.participants : await conn.groupMetadata(m.chat).then(metadata => metadata.participants);
    
    let countIndonesia = 0;
    let countMalaysia = 0;
    let countUSA = 0;
    let countOther = 0;
    let member = participants.length;
    
    participants.forEach(participant => {
      const phoneNumber = participant.id.split('@')[0];
      if (phoneNumber.startsWith("62")) {
        countIndonesia++;
      } else if (phoneNumber.startsWith("60")) {
        countMalaysia++;
      } else if (phoneNumber.startsWith("1")) {
        countUSA++;
      } else {
        countOther++;
      }
    });
    
    const replyMessage = `
┌─⊷ *ASAL NEGARA*
Jumlah Anggota Grup Berdasarkan Negara:
🇮🇩 • Indonesia: ${countIndonesia}
🇲🇾 • Malaysia: ${countMalaysia}
🇺🇲 • USA: ${countUSA}
🏳️ • Negara Lain: ${countOther}
👥 • Jumlah semua member: ${member}
└──────────────
`.trim();

    await m.reply(replyMessage);
  } catch (e) {
    console.log(e);
    throw e;
  }
};

handler.tags = ['group'];
handler.help = ['cekasalmember'];
handler.command = ['cekasalmember', 'asalmember'];
handler.group = true;

export default handler;