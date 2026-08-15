
import fetch from 'node-fetch';
let handler: WaPlugin = async (m, { conn }) => {
  try {
    let res = await fetch(
      `https://api.betabotz.eu.org/api/random/quotesanime?apikey=${lann}`,
    );
    let json = await res.json();

    if (json.status && json.result && json.result.length > 0) {
      let randomIndex = Math.floor(Math.random() * json.result.length);
      let animeQuote = json.result[randomIndex];
      let cleanQuotes = animeQuote.quotes.replace(/[\n\r\t]/g, " ");

      let replyMessage = `${cleanQuotes}\n\nCharacter: ${animeQuote.karakter}\nAnime: ${animeQuote.anime}\nEpisode: ${animeQuote.episode}`;

      conn.sendFile(
        m.chat,
        animeQuote.gambar,
        "image.jpg",
        replyMessage,
        m,
        false,
        { contextInfo: { mentionedJid: [m.sender] } },
      );
    } else {
      throw "Invalid API response";
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};

handler.help = ['anime'];
handler.tags = ['quotes'];
handler.command = /^(anime)$/i;

export default handler;
