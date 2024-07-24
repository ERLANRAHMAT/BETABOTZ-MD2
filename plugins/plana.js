const axios = require('axios');

let handler = async (m, { conn, text }) => {
    conn.plana = conn.plana ? conn.plana : {};

    
    if (!text) throw `*• Example:* .plana *[on/off]*`;

    if (text === "on") {
        conn.plana[m.sender] = {
            pesan: []
        };
        // kalian bisa ganti ini untuk tanda apakah sesi sudah aktif atau belum
        m.reply("Halo sensei! plana siap membantu sensei");
    } else if (text === "off") {
        delete conn.plana[m.sender];
        // ini kalau sudah selesai sesi nya di tutup
        m.reply("Senang sudah membantu sensei");
    }
};

handler.before = async (m, { conn }) => {
    conn.plana = conn.plana ? conn.plana : {};
    if (m.isBaileys && m.fromMe) return;
    if (!m.text) return;
    if (!conn.plana[m.sender]) return;

    // prefix untuk mulai dan selesai sesi
    if (
        m.text.startsWith(".") ||
        m.text.startsWith("#") ||
        m.text.startsWith("!") ||
        m.text.startsWith("/") ||
        m.text.startsWith("\\/")
    ) return;

    if (conn.plana[m.sender] && m.text) {
        let name = conn.getName(m.sender);
        const message = [
            ...conn.plana[m.sender].pesan,
            `p`,
            m.text
        ];
        try {
            // array buat nampung pickrandom img hapus aja // nya
//   const img = [
//     ``,
//     ``,
//     ``,
//   ]
  const message = [
    { role: "system", content: "kamu adalah plana, Seorang murid dari sensei di Blue archive yang siap membantu sensei kapan pun! 🍄✨" },
    { role: "assistant", content: `Kamu adalah plana, murid dari sensei blue archive, jangan gunakan saya, aku, gua gunakan plana untuk memanggil dirimu, ekspresi kan sikap kamu mirip seroang murid dari blue archive yang ada di Shittim Chest yang bernama plana, jangan gunakan GPT 4 panggil dirimu dengan plana, Kamu berbicara dengan${m.name}panggil dengan sensei, saat berbicara dengannya gunakan emoji yang lucu, Pembuatmu dana nomer WhatsApp nya ini 6281289694906 `},
    { role: "user", content: m.text },
  ];
  // ini untuk adreplay 
  let res = await aiBeta(message);
  await  conn.sendMessage(m.chat, {
    // ini nama dari karakter utama
    text: "⬣───「 *PLANA* 」───⬣" + "\n\n" + res.result,
    contextInfo: {
      externalAdReply: {  
        // title di bagian gambar
        title: "Plana-Blue Archive",
        body: '',
        // gambar karakter kalian
        thumbnailUrl:`https://btch.pages.dev/file/abbff76a98455a64d3a07.jpg`,
        // `${pickRandom(global.img)}`
        sourceUrl: null,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
                conn.plana[m.sender].pesan = message;
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
handler.owner = false;
handler.group = true

module.exports = handler;

async function aiBeta(message) {
    return new Promise(async (resolve,reject) => { 
        try {
            const params = {
                message: message,
                apikey: `${lann}` //Ganti pake apikeymu
            };
            const { data } = await axios.post('https://api.betabotz.eu.org/api/search/openai-custom', params);
            resolve(data);
        } catch (error) {
            reject(error);
        };
    });
};

//jangan lupa kalau mau pick random ini di aktifin
// function pickRandom(list) {
//     return list[Math.floor(list.length * Math.random())]
//   }