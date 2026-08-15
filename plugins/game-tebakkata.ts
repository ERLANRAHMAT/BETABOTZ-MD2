
import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler: WaPlugin = async (m, { conn, usedPrefix }) => {
    try {
        conn.tbkata = conn.tbkata ? conn.tbkata : {};
        let id = m.chat;
        
        if (id in conn.tbkata) {
            await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tbkata[id][0]);
            return;
        }

        let json;
        try {
            let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakkata?apikey=${lann}`)).json();
            json = src;
        } catch (e) {
            console.log(e);
            throw e;
        }

        if (!json || !json.soal || !json.jawaban) throw new Error('Format data tebakkata tidak valid dari API.');

        let caption = `
${json.soal}

┌─⊷ *SOAL*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Ketik ${usedPrefix}tkaa untuk bantuan
▢ Bonus: ${poin} money
▢ *Balas/ replay soal ini untuk menjawab*
└──────────────
`.trim();

        conn.tbkata[id] = [
            await conn.reply(m.chat, caption, m),
            json, 
            poin,
            setTimeout(() => {
                if (conn.tbkata[id]) {
                    conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tbkata[id][0]);
                    delete conn.tbkata[id];
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

handler.help = ['tebakkata'];
handler.tags = ['game'];
handler.command = /^tebakkata/i;
handler.register = false;
handler.group = true;

export default handler;
