import fetch from 'node-fetch';

let handler = async (m, { text, usedPrefix, command }) => {
  try {
    if (!text) throw `Masukkan pertanyaan!\n\n*Contoh:* Siapa Kamu? `;
    
    let logic = 'Hai Saya Adalah BetaBotz-Md Bot Whatsapp Yang Dikembangkan Oleh Lann,Saya Bernama Betabotz-Md,Saya Dibuat Oleh Lann Dengan Penuh Kesempurnaan Yang Tiada Taraa,Jika Kamu Ingin Mencari Tau Lebih Dalam Tentang Ownerku Visit https://api.betabotz.org';
    
    await m.reply(global.wait);
    
    let js = await fetch(`https://api.betabotz.eu.org/api/search/openai-logic?text=${text}&logic=${logic}&apikey=${global.lann}`);
    let json = await js.json();
    
    await m.reply(json.message);
  } catch (e) {
    console.log(e);
    throw e;
  }
};

handler.command = handler.help = ['ai2', 'openai2', 'chatgpt2'];
handler.tags = ['info'];
handler.premium = false;

export default handler;