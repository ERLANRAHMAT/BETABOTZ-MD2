import fetch from 'node-fetch';

let handler = async (m, { conn, command }) => {
    try {
        let api1 = `https://api.betabotz.eu.org/api/cecan/${command}?apikey=${lann}`;
        let api2 = `https://api.botcahx.eu.org/api/cecan/${command}?apikey=${btc}`;
        
        let buffer = await fetch(api1)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.buffer();
            })
            .catch(async (err) => {
                console.log(`API 1 failed with error: ${err}. Trying API 2...`);
                let res2 = await fetch(api2);
                if (!res2.ok) throw new Error(`API 2 HTTP error! status: ${res2.status}`);
                return await res2.buffer();
            });

        await conn.sendFile(m.chat, buffer, 'hasil.jpg', `Random ${command}`, m);
    } catch (e) {
        console.log(e);
        throw e;
    }
}

handler.help = handler.command = ['china','vietnam','thailand','indonesia','korea','japan','malaysia','justinaxie','jeni','jiso','ryujin','rose','hijaber'];
handler.tags = ['downloader'];
handler.limit = true;

export default handler;