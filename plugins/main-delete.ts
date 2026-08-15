
let handler: WaPlugin = async (m, { conn, command }) => {
    if (!m.quoted) throw 'Reply pesan yang ingin dihapus';
    
    try {
        let key = {
            remoteJid: m.chat,
            id: m.quoted.id,
            participant: m.quoted.sender
        };
        if (m.quoted.fromMe || m.quoted.sender === conn.user.jid) {
            key.fromMe = true;
        } else {
            key.fromMe = false;
        }
        await conn.sendMessage(m.chat, { delete: key });
        
    } catch (e) {
        console.log(e);
        throw e;
    }
};

handler.help = ['del', 'delete'];
handler.tags = ['tools'];
handler.admin = true;
handler.botAdmin = true; 
handler.command = ['del', 'delete', 'unsend'];

export default handler;
