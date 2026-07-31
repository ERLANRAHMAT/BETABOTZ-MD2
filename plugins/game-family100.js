import fs from 'fs';
import fetch from 'node-fetch';

let winScore = 500;
let rewardAmount = 100;

let handler = async (m, { conn }) => {
    try {
        conn.family = conn.family ? conn.family : {};
        let id = m.chat;
        
        if (id in conn.family) {
            if (conn.family[id].id !== undefined) {
                return conn.reply(m.chat, 'Masih ada kuis yang belum terjawab di chat ini\nTunggu 3 menit untuk mengakhiri', conn.family[id].msg);
            }
            delete conn.family[id];
            throw false;
        }

        conn.family[id] = {};
        
        let json;
        try {
            let src = await (await fetch(`https://api.betabotz.eu.org/api/game/family100-2?apikey=${lann}`)).json();
            json = src;
        } catch (e) {
            console.log(e);
            delete conn.family[id];
            throw e;
        }

        if (!json || !json.soal || !json.jawaban) {
            delete conn.family[id];
            throw new Error('Format data family100 tidak valid dari API.');
        }

        let caption = `
 ┌─⊷ *SOAL*
▢ *Soal:* ${json.soal}
▢ Terdapat *${json.jawaban.length}* jawaban${json.jawaban.find(v => v.includes(' ')) ? `
▢ (beberapa jawaban terdapat spasi)
▢ tunggu 3 menit untuk mengakhiri
▢ ketik *nyerah* untuk menyelesaikan permainan
└──────────────
`: ''}

+${rewardAmount} kredit sosial! tiap jawaban benar
    `.trim();

        conn.family[id] = {
            id,
            msg: await m.reply(caption),
            ...json,
            terjawab: Array.from(json.jawaban, () => false),
            winScore,
            rewardAmount, 
            timeout: setTimeout(() => {
                if (conn.family[id]) {
                    let allAnswers = conn.family[id].jawaban.map((jawaban, index) => `(${index + 1}) ${jawaban}`).join('\n');
                    conn.reply(m.chat, `Waktu habis! Game berakhir.\n\nJawaban yang benar:\n${allAnswers}`, conn.family[id].msg);
                    delete conn.family[id];
                }
            }, 180000) // 3 minutes
        };
    } catch (e) {
        if (e !== false) {
            console.log(e);
            throw e;
        }
    }
};

handler.help = ['family100'];
handler.tags = ['game'];
handler.group = true;
handler.command = /^family100$/i;

handler.nyerah = async function (m, { conn }) {
    try {
        let id = m.chat;
        if (conn.family && id in conn.family) {
            conn.reply(m.chat, 'Permainan berakhir karena menyerah.', conn.family[id].msg);
            clearTimeout(conn.family[id].timeout);
            delete conn.family[id];
        } else {
            conn.reply(m.chat, 'Tidak ada permainan yang sedang berlangsung.', m);
        }
    } catch (e) {
        console.log(e);
    }
};

export default handler;