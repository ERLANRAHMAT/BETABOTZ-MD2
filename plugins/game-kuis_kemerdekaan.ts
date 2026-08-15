
import fetch from 'node-fetch';

let timeout = 100000;
let poin = 10000;

let handler: WaPlugin = async (m, { conn, usedPrefix }) => {
    try {
        conn.merdeka = conn.merdeka ? conn.merdeka : {};
        let id = m.chat;
        
        if (id in conn.merdeka) {
            await conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.merdeka[id][0]);
            return;
        }

        let json;
        try {
            let src = await (await fetch(`https://api.betabotz.eu.org/api/game/kuismerdeka?apikey=${lann}`)).json();
            json = src;
        } catch (e) {
            console.log(e);
            throw e;
        }

        if (!json || !json.jawaban) throw new Error('Format data kuismerdeka tidak valid dari API.');

        let caption = `
${json.soal}

┌─⊷ *SOAL*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Ketik ${usedPrefix}mka untuk bantuan
▢ Bonus: ${poin} money
▢ *Balas/ replay soal ini untuk menjawab*
└──────────────
`.trim();

        conn.merdeka[id] = [
            await conn.reply(m.chat, caption, m),
            json, 
            poin,
            setTimeout(() => {
                if (conn.merdeka[id]) {
                    conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.merdeka[id][0]);
                    delete conn.merdeka[id];
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

handler.help = ['kuismerdeka'];
handler.tags = ['game'];
handler.command = /^kuismerdeka/i;
handler.register = false;
handler.group = true;

export default handler;
