import fetch from 'node-fetch';

let timeout = 100000;
let poin = 500;

let handler = async (m, { conn, usedPrefix }) => {
    try {
        conn.tebakjenaka = conn.tebakjenaka ? conn.tebakjenaka : {};
        let id = m.chat;
        
        if (id in conn.tebakjenaka) {
            await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakjenaka[id][0]);
            return;
        }

        let json;
        try {
            let src = await (await fetch(`https://api.betabotz.eu.org/api/game/tebakjenaka?apikey=${lann}`)).json();
            json = src;
        } catch (e) {
            console.log(e);
            throw e;
        }

        if (!json || !json.pertanyaan || !json.jawaban) throw new Error('Format data tebakjenaka tidak valid dari API.');

        let caption = `
${json.pertanyaan}

┌─⊷ *SOAL*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Ketik ${usedPrefix}tbk untuk bantuan
▢ Bonus: ${poin} Kredit sosial
▢ *Balas/ replay soal ini untuk menjawab*
└──────────────
`.trim();

        conn.tebakjenaka[id] = [
            await conn.reply(m.chat, caption, m),
            json, 
            poin,
            setTimeout(() => {
                if (conn.tebakjenaka[id]) {
                    conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakjenaka[id][0]);
                    delete conn.tebakjenaka[id];
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

handler.help = ['tebakjenaka'];
handler.tags = ['game'];
handler.command = /^tebakjenaka/i;
handler.register = false;
handler.group = false;

export default handler;