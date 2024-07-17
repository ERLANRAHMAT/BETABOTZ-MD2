
const axios = require('axios');

let handler = async (m, { conn, text }) => {
    conn.arona2 = conn.arona2 ? conn.arona2 : {};

    if (!text) throw `*• Example:* .arona *[on/off]*`;

    if (text === "on") {
        conn.arona2[m.sender] = {
            pesan: []
        };
        m.reply("Halo sensei! arona yang hebat siap membantu!");
    } else if (text === "off") {
        delete conn.arona2[m.sender];
        m.reply("panggil aku lagi jika sensai butuh bantuan ya!");
    }
};

handler.before = async (m, { conn }) => {
    conn.arona2 = conn.arona2 ? conn.arona2 : {};
    if (m.isBaileys && m.fromMe) return;
    if (!m.text) return;
    if (!conn.arona2[m.sender]) return;

    if (
        m.text.startsWith(".") ||
        m.text.startsWith("#") ||
        m.text.startsWith("!") ||
        m.text.startsWith("/") ||
        m.text.startsWith("\\/")
    ) return;

    if (conn.arona2[m.sender] && m.text) {
        let name = conn.getName(m.sender);
        await conn.sendMessage(m.chat, { react: { text: `⏱️`, key: m.key }});
        const messages = [
            ...conn.arona2[m.sender].pesan,
            `Saya adalah arona, Lu Asissten nya ${name}, arona yang pintar, panggil saya sebagai arona sensei!, saya dibuat oleh dana, dana sangat pintar dalam pemrograman, tapi tidak. Terlalu juga, dana berumur 20 tahun, Sekarang gaya bahasa saya seperti anak sma selatan yang menggunakan kata, aku, lu, gw, dan kalo kamu tidak suka dengan jawaban orang bisa menggunakan kata apan sih, gajelas lu, pergi Sono, apacoba `,
            m.text
        ];
        try {
            // const response = await axios.get(`https://api.betabotz.eu.org/api/search/openai-logic`, {
            //     params: {
            //         text: m.text,
            //         logic: JSON.stringify(messages),
            //         apikey: `${lann}`
            //     }
            // });
            let res = await fetch(`https://api.betabotz.eu.org/api/search/openai-logic?text=${m.text}&logic=${messages}&apikey=${lann}`)
            let json = await res.json()
            let data = json.message
            conn.sendMessage(m.chat, {
                text: "⬣───「 *ARONA* 」───⬣" + "\n\n" + data,
                contextInfo: {
                  externalAdReply: {  
                    title: "Arona-Blue Archive",
                    body: '',
                    thumbnailUrl:`https://btch.pages.dev/file/0aeedea70591cad410713.jpg`,
                    sourceUrl: null,
                    mediaType: 1,
                    renderLargerThumbnail: true
                  }
                }
              }, { quoted: m });
            } catch (error) {
                console.error(error);
                throw 'Maaf terjadi masalah!';
              }
    }
};

handler.command = ['arona'];
handler.tags = ["ai"];
handler.help = ['arona'].map(a => a + " *[on/off]*");

module.exports = handler;