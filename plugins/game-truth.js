import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
    try {
        let img = 'https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg';
        let res = await fetch(`https://api.betabotz.eu.org/api/random/truth?apikey=${lann}`);
        let truth = await res.json();

        if (!truth || !truth.result) throw new Error('Format data truth tidak valid dari API.');

        await conn.sendFile(m.chat, img, 'truth.png', `*TRUTH*\n\n“${truth.result}”`, m);
    } catch (e) {
        console.log(e);
        throw e;
    }
};

handler.help = ['truth'];
handler.tags = ['fun'];
handler.command = /^(truth|kebenaran|kejujuran)$/i;
handler.limit = true;

export default handler;