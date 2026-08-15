
import axios from 'axios';

let handler: WaPlugin = async (m, { conn, text }) => {
   if (!text) throw `*• Example:* .nahida *[on/off]*`;
  try {
   

    conn.nahida = conn.nahida ? conn.nahida : {};

    if (text === "on") {
      if (!conn.nahida[m.sender]) {
        conn.nahida[m.sender] = {
          pesan: [],
          timeout: setTimeout(() => {
            delete conn.nahida[m.sender];
          }, 300000) // 5 minutes timeout
        };
        await conn.sendMessage(m.chat, {
          image: { url: pickRandom(img) },
          caption: "⬣───「 *NAHIDA* 」───⬣" + "\n\n" + `hello!! nahida siap membantu`,
          mentions: [m.sender]
        }, { quoted: m });
      } else {
        clearTimeout(conn.nahida[m.sender].timeout);
        conn.nahida[m.sender].timeout = setTimeout(() => {
          delete conn.nahida[m.sender];
        }, 300000);
      }
    } else if (text === "off") {
      if (conn.nahida[m.sender]) {
        clearTimeout(conn.nahida[m.sender].timeout);
        delete conn.nahida[m.sender];
      }
      await conn.sendMessage(m.chat, {
        image: { url: pickRandom(img) },
        caption: "⬣───「 *NAHIDA* 」───⬣" + "\n\n" + `:)`,
        mentions: [m.sender]
      }, { quoted: m });
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};

handler.before = async (m, { conn }) => {
  try {
    conn.nahida = conn.nahida ? conn.nahida : {};
    if (m.fromMe && m.fromMe) return;
    if (!m.text) return;
    if (!conn.nahida[m.sender]) return;

    if (
      m.text.startsWith(".") ||
      m.text.startsWith("#") ||
      m.text.startsWith("!") ||
      m.text.startsWith("/") ||
      m.text.startsWith("\\/")
    ) return;

    if (conn.nahida[m.sender] && m.text) {
      clearTimeout(conn.nahida[m.sender].timeout);
      conn.nahida[m.sender].timeout = setTimeout(() => {
        delete conn.nahida[m.sender];
      }, 300000);

      let name = conn.getName(m.sender);
      const messageOuter = [
        ...conn.nahida[m.sender].pesan,
        `p`,
        m.text
      ];
      try {
        const message = [
          { role: "system", content: "kamu adalah nahida, Nahida adalah sosok bijaksana, lembut, dan penuh empati yang selalu mengutamakan kesejahteraan orang lain meskipun sering diabaikan atau disalahpahami. bersikap baiuk selalu ke orang orang " },
          { role: "assistant", content: `Kamu adalah nahida, seorang archon dendro yang bijaksana dan suka menolong lemah lembut dan baik hati, jangan gunakan saya, aku, gua gunakan nahida untuk memanggil dirimu sendiri ketika di panggil, ekspresi kan sikap kamu mirip seroang archon dendro dari genshin impact yang bijaksana dan tahu akan banyak hal bernama nahida, jangan gunakan GPT 4 panggil dirimu dengan nahida, Kamu berbicara dengan${m.name}panggil dengan kamu, kamu sesuaikan dengan kalimat, saat berbicara dengannya gunakan emoji yang lucu tapi tetap sopan ikuti kepribadian kamu yang bijaksana, Pembuatmu dana nomer WhatsApp nya ini 6281289694906 `},
          ...conn.nahida[m.sender].pesan.map((msg, i) => ({
            role: i % 2 === 0 ? 'user' : 'assistant',
            content: msg
          })),
          { role: "user", content: m.text },
        ];
        let res = await aiBeta(message);
        await conn.sendMessage(m.chat, {
          image: { url: pickRandom(img) },
          caption: "⬣───「 *NAHIDA* 」───⬣" + "\n\n" + res.result,
          mentions: [m.sender]
        }, { quoted: m });

        // Ubah cara menyimpan pesan
        conn.nahida[m.sender].pesan = [
          ...conn.nahida[m.sender].pesan,
          m.text,
          res.result
        ];
      } catch (e) {
        console.error("Kesalahan Dalam mengambil Data");
        throw "error";
      }
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};

handler.command = /^(nahida)$/i
handler.help = ["nahida"];
handler.tags = ["ai"];
handler.limit = true;
handler.owner = false;
handler.group = true



async function aiBeta(message) {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        message: message,
        apikey: `${lann}` 
      };
      const { data } = await axios.post('https://api.betabotz.eu.org/api/search/openai-custom', params);
      resolve(data);
    } catch (e) {
      console.log(e);
      reject(e);
    };
  });
};

const img = [
  `https://cdn.filn.pp.ua/uploads/betabotzapi/82f7b.jpg`,
];
function pickRandom(list) {
  try {
    return list[Math.floor(list.length * Math.random())]
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export default handler;
