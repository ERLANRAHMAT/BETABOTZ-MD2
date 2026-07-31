import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler = async (m, { conn, usedPrefix }) => {
    try {
        conn.susun = conn.susun ? conn.susun : {};
        let id = m.chat;
        
        if (id in conn.susun) {
            await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.susun[id][0]);
            return;
        }

        let json;
        try {
            let src = await (await fetch(`https://api.betabotz.eu.org/api/game/susunkata?apikey=${lann}`)).json();
            json = src;
        } catch (e) {
            console.log(e);
            throw e;
        }

        if (!json || !json.jawaban) throw new Error('Format data susunkata tidak valid dari API.');

        let caption = `
${json.soal}

┌─⊷ *SOAL*
▢ Tipe: ${json.tipe}
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Ketik ${usedPrefix}susn untuk bantuan
▢ Bonus: ${poin} money
▢ *Balas/ replay soal ini untuk menjawab*
└──────────────
`.trim();

        conn.susun[id] = [
            await conn.reply(m.chat, caption, m),
            json, 
            poin,
            setTimeout(() => {
                if (conn.susun[id]) {
                    conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.susun[id][0]);
                    delete conn.susun[id];
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

handler.help = ['susunkata'];
handler.tags = ['game'];
handler.command = /^susunkata/i;
handler.register = false;
handler.group = false;

export default handler;