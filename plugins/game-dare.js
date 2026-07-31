import fetch from 'node-fetch';
let handler = async (m, { conn }) => {
	try {
	let img = "https://cdn.filn.pp.ua/uploads/betabotzapi/fc17f.jpg";
    let dare = await fetch(
      `https://api.betabotz.eu.org/api/random/dare?apikey=${lann}`,
    ).then((result) => result.json());
    conn.sendFile(m.chat, img, "dare.png", `*DARE*\n\n“${dare.result}”`, m);
  } catch (e) {
    console.log(e);
    throw e;
  }
}
handler.help = ['dare']
handler.tags = ['fun']
handler.command = /^(dare|berani|tantangan)$/i
handler.limit = true

export default handler
