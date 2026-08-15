// @ts-nocheck
// Converted from plugins-esm - automated
import axios from 'axios';

let handler: WaPlugin = async (m, { conn, text }) => {
   if (!text) throw `*• Example:* .plana *[on/off]*`;
  try {
   

    conn.plana = conn.plana ? conn.plana : {};

    if (text === "on") {
      if (!conn.plana[m.sender]) {
        conn.plana[m.sender] = {
          pesan: [],
          timeout: setTimeout(() => {
            delete conn.plana[m.sender];
          }, 300000) // 5 minutes timeout
        };
        await conn.sendMessage(m.chat, {
          image: { url: pickRandom(img) },
          caption: "⬣───「 *PLANA* 」───⬣" + "\n\n" + `Halo sensei! plana siap membantu sensei`,
          mentions: [m.sender]
        }, { quoted: m });
      } else {
        clearTimeout(conn.plana[m.sender].timeout);
        conn.plana[m.sender].timeout = setTimeout(() => {
          delete conn.plana[m.sender];
        }, 300000);
      }
    } else if (text === "off") {
      if (conn.plana[m.sender]) {
        clearTimeout(conn.plana[m.sender].timeout);
        delete conn.plana[m.sender];
      }
      await conn.sendMessage(m.chat, {
        image: { url: pickRandom(img) },
        caption: "⬣───「 *PLANA* 」───⬣" + "\n\n" + `Senang sudah membantu sensei`,
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
    conn.plana = conn.plana ? conn.plana : {};
    if (m.isBaileys && m.fromMe) return;
    if (!m.text) return;
    if (!conn.plana[m.sender]) return;

    if (
      m.text.startsWith(".") ||
      m.text.startsWith("#") ||
      m.text.startsWith("!") ||
      m.text.startsWith("/") ||
      m.text.startsWith("\\/")
    ) return;

    if (conn.plana[m.sender] && m.text) {
      clearTimeout(conn.plana[m.sender].timeout);
      conn.plana[m.sender].timeout = setTimeout(() => {
        delete conn.plana[m.sender];
      }, 300000);

      let name = conn.getName(m.sender);
      const messageOuter = [
        ...conn.plana[m.sender].pesan,
        `p`,
        m.text
      ];
      try {
        const message = [
          { role: "system", content: "kamu adalah plana, Seorang murid dari sensei di Blue archive yang siap membantu sensei kapan pun! 🍄✨" },
          { role: "assistant", content: `Kamu adalah plana, murid dari sensei blue archive, jangan gunakan saya, aku, gua gunakan plana untuk memanggil dirimu, ekspresi kan sikap kamu mirip seroang murid dari blue archive yang ada di Shittim Chest yang bernama plana, jangan gunakan GPT 4 panggil dirimu dengan plana, Kamu berbicara dengan${m.name}panggil dengan sensei, saat berbicara dengannya gunakan emoji yang lucu, Pembuatmu dana nomer WhatsApp nya ini 6281289694906 `},
          ...conn.plana[m.sender].pesan.map((msg, i) => ({
            role: i % 2 === 0 ? 'user' : 'assistant',
            content: msg
          })),
          { role: "user", content: m.text },
        ];
        let res = await aiBeta(message);
        await conn.sendMessage(m.chat, {
          image: { url: pickRandom(img) },
          caption: "⬣───「 *PLANA* 」───⬣" + "\n\n" + res.result,
          mentions: [m.sender]
        }, { quoted: m });

        // Ubah cara menyimpan pesan
        conn.plana[m.sender].pesan = [
          ...conn.plana[m.sender].pesan,
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

handler.command = /^(plana)$/i
handler.help = ["plana"];
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
  `https://telegra.ph/file/abbff76a98455a64d3a07.jpg`,
]
function pickRandom(list) {
  try {
    return list[Math.floor(list.length * Math.random())]
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export default handler;
