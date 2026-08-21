let handler = async (m, { conn, args = [] }) => {
    try {
        let link = args[0]
        
        if (!link) {
            return m.reply(`Format: .testgroup <link invite>\n\nContoh: .testgroup https://chat.whatsapp.com/BIMArWjdILZ8UDMfUyLA6j`)
        }

        // Extract invite code
        let match = link.match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/i)
        if (!match) {
            return m.reply(`Link tidak valid`)
        }

        let inviteCode = match[1]
        
        await m.reply(`⏳ Testing groupAcceptInvite('${inviteCode}')...`)

        let result = await conn.groupAcceptInvite(inviteCode)

        // Detailed log
        let response = `
📊 *HASIL TEST groupAcceptInvite*

*Full Response:*
${JSON.stringify(result, null, 2)}

*Detail:*
- Type: ${typeof result}
- Is Object: ${result !== null && typeof result === 'object' ? '✅' : '❌'}
- Keys: ${Object.keys(result).join(', ')}

*Value checks:*
- result.id = ${result?.id || 'undefined'}
- result.jid = ${result?.jid || 'undefined'}
- result[0] = ${result?.[0] || 'undefined'}
- String(result) = ${String(result)}

*Rekomendasi ekstrak:*
${result?.id ? `→ Pakai: let groupId = result.id // ${result.id}` : ''}
${result?.jid ? `→ Atau: let groupId = result.jid // ${result.jid}` : ''}
${!result?.id && !result?.jid ? `→ Pakai: let groupId = String(result)` : ''}
        `.trim()

        await m.reply(response)

    } catch (e) {
        console.log('[testgroup] error:', e)
        await m.reply(`❌ Error:\n\n${e.message}\n\n${e.stack}`)
    }
}

handler.command = /^testgroup$/i
handler.help = ['testgroup <link>']
export default handler