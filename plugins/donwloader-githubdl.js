let handler = async (m, { args, usedPrefix, command }) => {
    try {
        if (!args[0]) throw 'usernamenya mana om'
        if (!args[1]) throw 'repo nya mana?'
        if (!args[2]) throw 'masukkan nama branch'
        let url = `https://github.com/${args[0]}/${args[1]}/archive/refs/heads/${args[2]}.zip`
        //F
        m.reply(`compressing data to file zip*`)
        conn.sendFile( m.chat, url, `${args[1]} ${args[2]}.zip`, null, m)
    } catch (e) {
        if (e !== false) {
            console.log(e);
            throw e;
        }
    }
}
handler.help = ['githubdl']
handler.tags = ['github']
handler.command = /githubdl/i

handler.limit = true

export default handler;