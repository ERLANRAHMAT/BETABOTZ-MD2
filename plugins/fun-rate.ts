
let handler: WaPlugin = async (m, { args, conn }) => {
    if (!args.length) return conn.reply(m.chat, "Masukkan sesuatu untuk dirate!\nContoh: *.rate seberapa cocok aku dan dia*", m);

    // Menghasilkan angka random antara 1 - 100
    let rating = Math.floor(Math.random() * 100) + 1;

    // Format pesan
    let text = `✨ *Pertanyaan:* ${args.join(" ")}\n📊 *Jawaban:* ${rating}%`;

    // Kirim balasan
    conn.reply(m.chat, text, m);
}

handler.help = ['rate']
handler.tags = ['fun']
handler.command = /^(rate|seberapa|cocok|kece)$/i
handler.group = true
handler.limit = true
handler.fail = null

export default handler;
