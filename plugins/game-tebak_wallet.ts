
import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler: WaPlugin = async (m, { conn, usedPrefix }) => {
    try {
        conn.tebakwallet = conn.tebakwallet ? conn.tebakwallet : {};
        let id = m.chat;
        
        if (id in conn.tebakwallet) {
            await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakwallet[id][0]);
            return;
        }

        let json;
        try {
            let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakwallet?apikey=${lann}`)).json();
            json = src;
        } catch (e) {
            console.log(e);
            throw e;
        }

        if (!json || !json.jawaban) throw new Error('Format data tebakwallet tidak valid dari API.');

        let caption = `
${json.soal}

┌─⊷ *SOAL*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Ketik ${usedPrefix}twa untuk bantuan
▢ Bonus: ${poin} money
▢ *Balas/ replay soal ini untuk menjawab*
└──────────────
`.trim();

        conn.tebakwallet[id] = [
            await conn.reply(m.chat, caption, m),
            json, 
            poin,
            setTimeout(() => {
                if (conn.tebakwallet[id]) {
                    conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakwallet[id][0]);
                    delete conn.tebakwallet[id];
                }
            }, timeout)
        ];
    } catch (e) {
        if (e !== false) {
            console.log(e);
            throw e;
        }
    }
};

handler.help = ['tebakwallet'];
handler.tags = ['game'];
handler.command = /^tebakwallet/i;
handler.register = false;
handler.group = true;

export default handler;
