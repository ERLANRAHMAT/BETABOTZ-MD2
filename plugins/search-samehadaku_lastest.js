let fetch = require('node-fetch')

let handler = async (m, { text, usedPrefix, command }) => {

let res = await fetch(`https://api.betabotz.eu.org/api/webzone/samehadaku-latest?apikey=${lann}`);
const json = await res.json();
const anime = json.result.anime;
let capt = '乂S A M E H A D A K U  L A T E S T乂 \n'; 

for (let item of anime) {
    capt += `
◦ Title: ${item.title}
◦ Episode: ${item.episode}
◦ Posted By: ${item.postedBy}
◦ Release: ${item.release}
◦ Link: ${item.link}
◦ Thumbnail: ${item.thumbnail}
    `;
}
await m.reply(capt);
}

handler.help = ['samehadalast']
handler.tags = ['internet']
handler.command = /^(samehadalast)$/i
handler.limit = true
handler.group = true

module.exports = handler
