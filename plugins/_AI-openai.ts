import axios from 'axios';

let handler: WaPlugin = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*Example:* ${usedPrefix + command} hai`;
    conn.lannh = conn.lannh ? conn.lannh : {};
    if (!conn.lannh[m.sender]) {
        conn.lannh[m.sender] = {
            pesan: []
        };
        conn.lannh[m.sender].timeout = setTimeout(() => {
            delete conn.lannh[m.sender];
        }, 300000);

        m.reply(`Halo \`${m.name}\`👋, Saya siap membantu anda!`);
    } else {
        clearTimeout(conn.lannh[m.sender].timeout);
        conn.lannh[m.sender].timeout = setTimeout(() => {
            delete conn.lannh[m.sender];
        }, 300000);
    }

    const previousMessages = conn.lannh[m.sender].pesan;
  
  
  /**
 * @description Adjust this prompt to your liking.
 * @note Keep the logic reasonable and easy to understand!
 */

    const messages = [
        { role: "system", content: "kamu adalah lannH, Seorang Asisten pribadi yang di buat oleh BOTCAHX yang siap membantu kapan pun!" },
        { role: "assistant", content: `Saya lannH, asisten pribadi yang siap membantu kamu kapan pun! Apa yang bisa saya bantu hari ini?` },
        ...previousMessages.map((msg, i) => ({ role: i % 2 === 0 ? 'user' : 'assistant', content: msg })),
        { role: "user", content: text }
    ];
    try {
        const chat = async function(message) {
            return new Promise<{ result?: string }>(async (resolve, reject) => {
                try {
                    const params = {
                        message: message,
                        apikey: lann
                    };
                    const { data } = await axios.post('https://api.betabotz.eu.org/api/search/openai-custom-v2', params);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });
        };

        let res = await chat(messages);
        if (res && res.result) {
            await m.reply(res.result);
            conn.lannh[m.sender].pesan = [
                ...conn.lannh[m.sender].pesan,
                text,
                res.result
            ];
        } else {
            throw "Kesalahan dalam mengambil data";
        }
    } catch (e) {
        throw eror
    }
};

handler.command = handler.help = ['ai','openai','chatgpt'];
handler.tags = ['ai'];
handler.premium = false
handler.limit = true;
export default handler;
