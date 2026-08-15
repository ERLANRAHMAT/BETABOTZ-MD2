
import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler: WaPlugin = async (m, { conn, usedPrefix }) => {
    try {
        conn.kimia = conn.kimia ? conn.kimia : {};
        let id = m.chat;
        
        if (id in conn.kimia) {
            await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.kimia[id][0]);
            return;
        }

        let json;
        try {
            let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakkimia?apikey=${lann}`)).json();
            json = src;
        } catch (e) {
            console.log(e);
            throw e;
        }

        if (!json || !json.nama || !json.lambang) throw new Error('Format data tebakkimia tidak valid dari API.');

        let caption = `
*${json.nama}*

┌─⊷ *SOAL*
▢ Apa rumus kimia dari zat kimia/ senyawa di atas?
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Ketik ${usedPrefix}kmi untuk bantuan
▢ Bonus: ${poin} money
▢ *Balas/ replay soal ini untuk menjawab*
└──────────────
`.trim();

        conn.kimia[id] = [
            await conn.reply(m.chat, caption, m),
            json, 
            poin,
            setTimeout(() => {
                if (conn.kimia[id]) {
                    conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.lambang}*`, conn.kimia[id][0]);
                    delete conn.kimia[id];
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

handler.help = ['tebakkimia'];
handler.tags = ['game'];
handler.command = /^tebakkimia/i;
handler.register = false;
handler.group = false;

export default handler;
