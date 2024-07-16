const { G4F } = require("g4f");
let Airi = new G4F();

let handler = async (m, { conn, text }) => {
    conn.autoai = conn.autoai ? conn.autoai : {};

    
    if (!text) throw `*• Example:* .plana *[on/off]*`;

    if (text === "on") {
        conn.autoai[m.sender] = {
            pesan: []
        };
        // kalian bisa ganti ini untuk tanda apakah sesi sudah aktif atau belum
        m.reply("Halo sensei! plana siap membantu sensei");
    } else if (text === "off") {
        delete conn.autoai[m.sender];
        // ini kalau sudah selesai sesi nya di tutup
        m.reply("Senang sudah membantu sensei");
    }
};

handler.before = async (m, { conn }) => {
    conn.autoai = conn.autoai ? conn.autoai : {};
    if (m.isBaileys && m.fromMe) return;
    if (!m.text) return;
    if (!conn.autoai[m.sender]) return;

    // prefix untuk muai dan selesai sesi
    if (
        m.text.startsWith(".") ||
        m.text.startsWith("#") ||
        m.text.startsWith("!") ||
        m.text.startsWith("/") ||
        m.text.startsWith("\\/")
    ) return;

    if (conn.autoai[m.sender] && m.text) {
        let name = conn.getName(m.sender);
        const messages = [
            ...conn.autoai[m.sender].pesan,
            `p`,
            m.text
        ];
        try {
      const options = [
    {model: "gpt-4"}
  ];
  // di sini saya pakai model karater plana, kalau kalian mau ganti tapi model asisten bisa ganti kata plana itu dengan
  // nama karakter yang kalian mau
  const messages = [
    { role: "system", content: "kamu adalah plana, Seorang murid dari sensei di Blue archive yang siap membantu sensei kapan pun! 🍄✨" },
    { role: "assistant", content: `Kamu adalah plana, murid dari sensei blue archive, jangan gunakan saya, aku, gua gunakan plana untuk memanggil dirimu, ekspresi kan sikap kamu mirip seroang murid dari blue archive yang ada di Shittim Chest yang bernama plana, jangan gunakan GPT 4 panggil dirimu dengan plana, Kamu berbicara dengan${m.name}panggil dengan sensei, saat berbicara dengannya gunakan emoji yang lucu, Pembuatmu dana nomer WhatsApp nya ini 6281289694906 `},
    { role: "user", content: m.text },
  ];
  // ini untuk adreplay 
  let res = await Airi.chatCompletion(messages, options);
  await  conn.sendMessage(m.chat, {
    // ini nama dari karakter utama
    text: "⬣───「 *PLANA* 」───⬣" + "\n\n" + res,
    contextInfo: {
      externalAdReply: {  
        // title di bagian gambar
        title: "Plana-Blue Archive",
        body: '',
        // gambar karakter kalian
        thumbnailUrl:`https://btch.pages.dev/file/abbff76a98455a64d3a07.jpg`,
        sourceUrl: null,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
                conn.autoai[m.sender].pesan = messages;
        } catch (e) {
            console.error("Kesalahan Dalam mengambil Data");
            throw "error";
        }
    }
};

// command untuk memulai/ mengakhiri sesi 

handler.command = /^(plana)$/i
handler.help = ["plana"];
handler.tags = ["ai"];
handler.limit = true;
handler.owner = true;
handler.group =- true

module.exports = handler;


// jika tidak work kalian bisa install g4f dahulu dengan $ npm i g4f 
// atau cek dokumentasi https://www.npmjs.com/package/g4f