function handler(m, { text }) {
    try {
    let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text
    m.reply(teks.replace(/[aiueo]/gi, '$&ve'))
    } catch (e) {
      console.log(e);
      throw e;
    }
    
}
handler.help = ['purba <teks>']
handler.tags = ['fun']
handler.command =  /^(purba)$/i

export default handler