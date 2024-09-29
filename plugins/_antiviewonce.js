exports.before = async function(m) {
    if (m.isBaileys && m.fromMe) return;
    let chat = db.data.chats[m.chat];
    if (chat.viewonce && m.isGroup && m.mtype === 'viewOnceMessageV2') {
        let val = { ...m };
        let msg = val.message?.viewOnceMessage?.message || val.message?.viewOnceMessageV2?.message;
        delete msg[Object.keys(msg)[0]].viewOnce;
        val.message = msg;
        await this.sendMessage(m.chat, { forward: val }, { quoted: m });
    }
    return;
};
