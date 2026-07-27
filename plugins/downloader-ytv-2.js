import youtube from 'yt-search';
let handler = async (m, { conn, text }) => {
  try {
    if (!text) throw "Url nya mana?";
    m.reply("_Proses..._");
    var search = await youtube(text);
    var convert = search.videos[0];
    let url = `https://aemt.me/youtube?url=${convert.url}&filter=audioandvideo&quality=highestvideo&contenttype=video/mp4`;
    conn.sendMessage(
      m.chat,
      { video: { url: url }, mimetype: "video/mp4" },
      { quoted: m },
    );
  } catch (e) {
    console.log(e);
    throw e;
  }
  
}
handler.command = handler.help = ['ytv2']
handler.tags = ['downloader']
export default handler
