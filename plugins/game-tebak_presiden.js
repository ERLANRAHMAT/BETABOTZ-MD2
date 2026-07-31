import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler = async (m, { conn, usedPrefix }) => {
    try {
        conn.tebakpresiden = conn.tebakpresiden ? conn.tebakpresiden : {};
        let id = m.chat;
        
        if (id in conn.tebakpresiden) {
            await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakpresiden[id][0]);
            return;
        }

        let json;
        try {
            let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakpresiden?apikey=${lann}`)).json();
            json = src;
        } catch (e) {
            console.log(e);
            throw e;
        }

        if (!json || !json.jawaban) throw new Error('Format data tebakpresiden tidak valid dari API.');

        let caption = `
${json.soal}

┌─⊷ *SOAL*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Ketik ${usedPrefix}pra untuk bantuan
▢ Bonus: ${poin} money
▢ *Balas/ replay soal ini untuk menjawab*
└──────────────
`.trim();

        conn.tebakpresiden[id] = [
            await conn.reply(m.chat, caption, m),
            json, 
            poin,
            setTimeout(() => {
                if (conn.tebakpresiden[id]) {
                    conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakpresiden[id][0]);
                    delete conn.tebakpresiden[id];
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

handler.help = ['tebakpresiden'];
handler.tags = ['game'];
handler.command = /^tebakpresiden/i;
handler.register = false;
handler.group = true;

export default handler;