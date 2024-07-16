
const axios = require('axios');

let handler = async (m, { conn, text }) => {
    conn.egvuaxrl = conn.egvuaxrl ? conn.egvuaxrl : {};

    if (!text) throw `*• Example:* .autoai *[on/off]*`;

    if (text === "on") {
        conn.egvuaxrl[m.sender] = {
            pesan: []
        };
        m.reply("[ ✓ ] Success create session chat");
    } else if (text === "off") {
        delete conn.egvuaxrl[m.sender];
        m.reply("[ ✓ ] Success delete session chat");
    }
};

handler.before = async (m, { conn }) => {
    conn.egvuaxrl = conn.egvuaxrl ? conn.egvuaxrl : {};
    if (m.isBaileys && m.fromMe) return;
    if (!m.text) return;
    if (!conn.egvuaxrl[m.sender]) return;

    if (
        m.text.startsWith(".") ||
        m.text.startsWith("#") ||
        m.text.startsWith("!") ||
        m.text.startsWith("/") ||
        m.text.startsWith("\\/")
    ) return;

    if (conn.egvuaxrl[m.sender] && m.text) {
        let name = conn.getName(m.sender);
        await conn.sendMessage(m.chat, { react: { text: `⏱️`, key: m.key }});
        const messages = [
            ...conn.egvuaxrl[m.sender].pesan,
            `Lu Adalah NotmeBotz MD, Lu Asissten nya ${name}, Kalo Dia Nanya Jawab singkat, seperti iya jadi iy, lu suka ngebantu orang,dan kata yang lu pake itu ubah dari saya ke gw,dan kata anda ke lu atau Lo, dan kamu adalah orang yang resek, dan cerewet, lu bisa bilang anjing, babi, atau kontol, Lo bie pake emoji ini ✌️ini😏ini👉ini😁ini😂dan ini 🙄, dan jika marah pakai emoji ini 🤬, dan Lo bisa bilang nigga, dan ingat owner lu namanya Herza, Dia Pembuat Lu, dan Lu suka pake bahasa kasar kek, Anj, Babi, Ngent, Asw, Asu, Mmk, Kntl, dan juga lu suka furry, Furry Gay Tapi, lu orangnya Suka Jahil, Lu Suka Bokep Furry Gayz Tapi Lu Gak Gay, Dan juga Umur lu 14 Tahun dan ingat juga pake kata lu gw elo dan gue, dan kalo ada orang yang nanya biar apa atau buat apa? Jawab aja biarin, dan untuk yang nanya buat apa jawab aja, ya gpp, dan lu suka nasi goreng spesial, telor ceplok, telur dadar, ayam goreng, KFC, dan btw minuman yang lu suka tuh Coca Cola, dan Lo Orang Nya Asik, Lu Harus Tau Orng yang namanya Dimz Ama Naaazzzz dan Fianz Menyala, Entar Kalo Ada Yang nanya gitu, dia yang suka ngentau gw, btw lu orang nya santai gk suka ada masalah dan selalu santai, nolep tapi bukan wibu, tapi furry, hobby ngocok dikamar, kontol lu panjang nya 12cm, Lu Gampang Sangean`,
            m.text
        ];
        try {
            const response = await axios.get(`https://api.betabotz.eu.org/api/search/openai-logic`, {
                params: {
                    text: m.text,
                    logic: JSON.stringify(messages),
                    apikey: `${lann}`
                }
            });

            const responseData = response.data;
            if (responseData.status) {
                await conn.sendMessage(m.chat, { react: { text: `✅`, key: m.key }});
                m.reply(responseData.message);
                conn.egvuaxrl[m.sender].pesan = messages;
            } else {
                throw new Error("API response status is false");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    }
};

handler.command = ['autoai'];
handler.tags = ["ai"];
handler.help = ['autoai'].map(a => a + " *[on/off]*");

module.exports = handler;