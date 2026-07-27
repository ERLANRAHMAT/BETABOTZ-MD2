import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler = async (m, { conn, usedPrefix }) => {
    try {
        conn.tebakislami = conn.tebakislami ? conn.tebakislami : {};
        let id = m.chat;
        
        if (id in conn.tebakislami) {
            await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakislami[id][0]);
            return;
        }

        let json;
        try {
            let data = await (await fetch(`https://api.betabotz.eu.org/api/game/kuisislami?apikey=${lann}`)).json();
            json = data;
        } catch (e) {
            console.log(e);
            throw e;
        }

        if (!json || !json.soal || !json.pilihan || !json.jawaban) {
            throw new Error('Format data tebakislami tidak valid dari API.');
        }

        let options = json.pilihan.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n');
        
        let caption = `
${json.soal}

${options}

┌─⊷ *SOAL*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Ketik ${usedPrefix}tsa untuk clue jawaban
▢ *Balas/ replay soal ini untuk menjawab dengan a, b, c, atau d*
└──────────────
`.trim();

        conn.tebakislami[id] = [
            await conn.reply(m.chat, caption, m),
            json, 
            poin,
            setTimeout(() => {
                if (conn.tebakislami[id]) {
                    conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakislami[id][0]);
                    delete conn.tebakislami[id];
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

handler.help = ['tebakislami'];
handler.tags = ['game'];
handler.command = /^tebakislami/i;
handler.register = false;
handler.group = true;

export default handler;