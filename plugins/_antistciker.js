async function before(m, { isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return;
    let chat = global.db.data.chats[m.chat];
    if (!chat || !chat.antiSticker) return;
    const isNormalSticker = m.mtype === "stickerMessage";
    const isLottieSticker = m.message?.lottieStickerMessage || m.msg?.lottieStickerMessage || m.mtype === "lottieStickerMessage";
    if ((isNormalSticker || isLottieSticker) && m.isGroup) {
        // jika kamu mau stiker normal nya gak di delete kamu bisa ganti if di atas ke sini
        // if ((isLottieSticker) && m.isGroup) {
        if (isAdmin || !isBotAdmin) {
            return;
        } else {
            await this.sendMessage(m.chat, { delete: m.key });
        }
    }
    return;
}

module.exports = { before };