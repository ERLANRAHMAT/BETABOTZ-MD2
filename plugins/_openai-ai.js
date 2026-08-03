import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
       if (!text) throw `*Example:* ${usedPrefix + command} hai`;
    try {
     
        
        conn.beta = conn.beta ? conn.beta : {};
        if (!conn.beta[m.sender]) {
            conn.beta[m.sender] = {
                pesan: []
            };
            conn.beta[m.sender].timeout = setTimeout(() => {
                delete conn.beta[m.sender];
            }, 300000);

            m.reply(`Halo \`${m.name}\`👋, Saya siap membantu anda!`);
        } else {
            clearTimeout(conn.beta[m.sender].timeout);
            conn.beta[m.sender].timeout = setTimeout(() => {
                delete conn.beta[m.sender];
            }, 300000);
        }

        let name = conn.getName(m.sender);
        const previousMessages = conn.beta[m.sender].pesan;
      
        const messages = [
            { role: "system", content: "Kamu adalah BetaBotz Ai Sebuah Ai Yang diciptakan oleh Lann,bantu setiap orang dengan ramah:),berikan emoticon di setiap jawaban" },
            { role: "assistant", content: `Kamu adalah BetaBotz Ai,ai bot yang diciptakan oleh Lann untuk membantu semua permintaan dari user,jawab setiap pertanyaan dengan ramah dan sertai emoticon` },
            ...previousMessages.map((msg, i) => ({ role: i % 2 === 0 ? 'user' : 'assistant', content: msg })),
            { role: "user", content: text }
        ];

        const aiBeta = async function(message) {
            return new Promise(async (resolve, reject) => {
                try {
                    const params = {
                        message: message,
                        apikey: global.lann
                    };
                    const { data } = await axios.post('https://api.betabotz.eu.org/api/search/openai-custom', params);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });
        };

        let res = await aiBeta(messages);
        if (res && res.result) {
            await m.reply(res.result);
            conn.beta[m.sender].pesan = messages.map(msg => msg.content);
        } else {
            throw "Kesalahan dalam mengambil data";
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
};

handler.command = handler.help = ['ai','openai','chatgpt'];
handler.tags = ['tools'];
handler.premium = false;

export default handler;