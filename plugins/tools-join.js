let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i

let handler = async (m, { conn, text }) => {
    let [_, code] = text.match(linkRegex) || []
    if (!code) throw 'Link invalid'
    try {
        let res = await conn.groupAcceptInvite(code)
        let groupId = typeof res === 'string' ? res : res?.gid
        m.reply(`Berhasil join grup ${groupId}`)
    } catch (error) {
        let errorText = `${error?.message || ''} ${error?.data || ''}`.toLowerCase()
        if (errorText.includes('not-authorized')) {
            return m.reply('Gagal join grup. Link undangan sudah tidak berlaku, grup memerlukan persetujuan admin, atau akun bot tidak diizinkan bergabung.')
        }
        throw error
    }
}
handler.help = ['join <chat.whatsapp.com>']
handler.tags = ['tools']

handler.command = /^join$/i
handler.admin = true;
handler.owner = true;

export default handler
