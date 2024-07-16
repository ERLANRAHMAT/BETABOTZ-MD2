var fetch = require('node-fetch');

let handler = async (m, { conn, text }) => {
    conn.simi2 = conn.simi2 ? conn.simi2 : {};

    if (!text) throw `*• Example:* .simi2 *[on/off]*`;

    if (text === "on") {
        conn.simi2[m.sender] = {
            pesan: []
        };
        m.reply("[ ✓ ] Success create session chat");
    } else if (text === "off") {
        delete conn.simi2[m.sender];
        m.reply("[ ✓ ] Success delete session chat");
    }
};

handler.before = async (m, { conn }) => {
  conn.simi2 = conn.simi2 ? conn.simi2 : {};
  if (m.isBaileys && m.fromMe) return;
  if (!m.text) return;
  if (!conn.simi2[m.sender]) return;

  if (
    m.text.startsWith(".") ||
    m.text.startsWith("#") ||
    m.text.startsWith("!") ||
    m.text.startsWith("/") ||
    m.text.startsWith("\\/")
  ) return;

  if (conn.simi2[m.sender] && m.text) {
    let name = conn.getName(m.sender);
    try {
    let res = await fetch(`https://api.betabotz.eu.org/api/search/simisimi?query=${m.text}&apikey=${lann}`)
    let json = await res.json()
    let data = json.result
      // Send the chatCompletion response
      conn.sendMessage(m.chat, {
        text: "𝙆𝙪𝙘𝙝𝙞𝙣𝙜 𝘽𝙤𝙩 𝘼𝙞" + "\n\n" + data,
        contextInfo: {
          externalAdReply: {
            title: "𝙆𝙪𝙘𝙝𝙞𝙣𝙜 𝘽𝙤𝙩 𝘼𝙞 2024",
            body:
              "𝘽𝙖𝙣𝙩𝙪 𝘿𝙤𝙣𝙖𝙩𝙚 𝙊𝙬𝙣𝙚𝙧 𝘼𝙜𝙖𝙧 𝙩𝙚𝙧𝙪𝙨 𝙪𝙥𝙙𝙖𝙩𝙚 𝘽𝙤𝙩 𝙒𝙝𝙖𝙩𝙨𝙖𝙥𝙥 𝙣𝙮𝙖",
            thumbnailUrl: 'https://telegra.ph/file/06a2d1650e6d619bb7bc9.jpg',
            sourceUrl: null,
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      }, { quoted: m });
    } catch (e) {
      console.log(e);
      throw "error";
    }
  }
};

handler.command = ['simi2'];
handler.tags = ["ai"];
handler.help = ['simi2'].map(a => a + " *[on/off]*");

module.exports = handler