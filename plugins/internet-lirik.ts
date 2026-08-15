
import fetch from 'node-fetch';
let handler: WaPlugin = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (!text) throw `Ex: ${usedPrefix}${command} Bawa dia kembali`
    await m.reply(wait);
    try {
      let data = await (
        await fetch(
          `https://api.betabotz.eu.org/api/search/lirik?lirik=${text}&apikey=${lann}`,
        )
      ).json();
      let caption = `
${data.result.lyrics}

ℹ️ More info:
🔗 ${data.result.image}
🎤 Artist: ${data.result.artist}`;
      await conn.sendMessage(
        m.chat,
        {
          image: { url: data.result.image },
          caption: caption,
          mentions: [m.sender],
        },
        { quoted: m },
      );
      await conn.sendMessage(
        m.chat,
        {
          image: { url: data.result.image },
          caption: caption,
          mentions: [m.sender],
        },
        { quoted: m },
      );
      await conn.sendMessage(
        m.chat,
        {
          image: { url: data.result.image },
          caption: caption,
          mentions: [m.sender],
        },
        { quoted: m },
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
}

handler.help = ['lirik'].map(v => v + ' <Title>')
handler.tags = ['internet']
handler.command = /^(lirik|lyrics|lyric)$/i

export default handler;
