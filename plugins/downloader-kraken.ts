
import fetch from 'node-fetch';

let handler: WaPlugin = async (m, { conn, text, usedPrefix, command }) => {
        if (!text) throw `*🚩 Example:* ${usedPrefix}${command} https://krakenfiles.com/view/HG9WxZaL08/file.html`
    try {
    
        
        let data = await (await fetch(`https://api.betabotz.eu.org/api/download/kraken?url=${text}&apikey=${lann}`)).json()
        
        if (!data.status || !data.result) throw 'Gagal mengambil data dari Krakenfiles.';

        let msg = `乂 *K R A K E N  D O W N L O A D E🇷*\n\n`
        msg += ` ◦ *Name :* ${data.result.fileName}\n`
        msg += ` ◦ *View :* ${data.result.views}\n`
        msg += ` ◦ *Size :* ${data.result.fileSize}\n`
        msg += ` ◦ *Type :* ${data.result.fileType}\n`
        msg += ` ◦ *Uploaded :* ${data.result.uploadDate}\n`
        msg += ` ◦ *Download :* ${data.result.downloads}\n`
        msg += ` ◦ *Last Download :* ${data.result.lastDownloadDate}\n`
        msg += ` ◦ *Link :* ${data.result.urlDownload}`
        msg += `\n`
        
        await conn.sendFile(m.chat, 'https://krakenfiles.com/images/kf_logo_dark.png', 'thumb_.png', msg, m)
        await conn.sendMessage(m.chat, { document: { url: data.result.urlDownload }, fileName: data.result.fileName, mimetype: data.result.fileType }, { quoted: m })
    } catch (e) {
        if (e !== false) {
            console.log(e);
            throw e;
        }
    }
}

handler.help = ['krakendownload'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command =  /^(krakendl|krakendownload)$/i
handler.limit = true;
handler.register = false;
handler.premium = false;

export default handler;
