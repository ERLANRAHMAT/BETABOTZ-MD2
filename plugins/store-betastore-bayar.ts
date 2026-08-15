const qrisUrl = global.qris || 'https://cdn.filn.pp.ua/uploads/betabotzapi/41616.jpg';

const handler: WaPlugin = async (message, { conn }) => {
  const replyMessage = `Metode Pembayaran:\n\nDana: 081289694906\n\nSilakan lakukan pembayaran dan kirim bukti pembayaran dengan caption ID Transaksi.`;
  await message.reply(replyMessage);

  await conn.sendMessage(
    message.chat,
    {
      image: { url: qrisUrl },
      caption: 'Scan QRIS untuk pembayaran',
    },
    { quoted: message },
  );
};

handler.customPrefix = /^bayar$/i;
handler.command = /^bayar$/i;

export default handler;
