
import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler: WaPlugin = async (m, { conn, usedPrefix }) => {
    try {
        conn.tebaklirik = conn.tebaklirik ? conn.tebaklirik : {};
        let id = m.chat;
        
        if (id in conn.tebaklirik) {
            await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebaklirik[id][0]);
            return;
        }

        let json;
        try {
            let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebaklirik?apikey=${lann}`)).json();
            json = src;
        } catch (e) {
            console.log(e);
            throw e;
        }

        if (!json || !json.answer) throw new Error('Format data tebaklirik tidak valid dari API.');

        let caption = `
${json.question}

┌─⊷ *SOAL*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Ketik ${usedPrefix}liga untuk bantuan
▢ Bonus: ${poin} money
▢ *Balas/ replay soal ini untuk menjawab*
└──────────────
`.trim();

        conn.tebaklirik[id] = [
            await conn.reply(m.chat, caption, m),
            json, 
            poin,
            setTimeout(() => {
                if (conn.tebaklirik[id]) {
                    conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.answer}*`, conn.tebaklirik[id][0]);
                    delete conn.tebaklirik[id];
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

handler.help = ['tebaklirik'];
handler.tags = ['game'];
handler.command = /^tebaklirik/i;
handler.register = false;
handler.group = true;

export default handler;
