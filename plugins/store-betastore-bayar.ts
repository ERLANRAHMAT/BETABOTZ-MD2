// @ts-nocheck
// Converted from plugins-esm - automated
import * as baileys from "@whiskeysockets/baileys";


const qrisUrl = global.qris || 'https://cdn.filn.pp.ua/uploads/betabotzapi/41616.jpg'; 

const handler: WaPlugin = async (message, { conn }) => {
  const { generateWAMessageContent, generateWAMessageFromContent, proto } = baileys;
    const replyMessage = `Metode Pembayaran:\n\nDana: 081289694906\n\nSilakan lakukan pembayaran dan kirim bukti pembayaran dengan caption ID Transaksi.`;
    await message.reply(replyMessage);

    const { imageMessage } = await generateWAMessageContent({
        image: { url: qrisUrl }
    }, {
        upload: conn.waUploadToServer
    });

    const msg = generateWAMessageFromContent(message.chat, {
        imageMessage: {
            ...imageMessage,
            caption: 'Scan QRIS untuk pembayaran'
        }
    }, { quoted: message });

    await conn.relayMessage(message.chat, msg.message, {
        messageId: msg.key.id
    });
};

handler.customPrefix = /^bayar$/i;
handler.command = new RegExp;


// no copas code dari luar, logic pakai kepala
// bebas ubah karena open source
// danaputra133
// tutorial pakai ada di: https://youtu.be/P7K5ycatYJA

export default handler;
