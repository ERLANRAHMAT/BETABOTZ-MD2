let handler = m => m

handler.before = async function (m) {
    let user = db.data.users[m.sender]
    if (m.chat.endsWith('status@broadcast')) {
        console.log('Status Wa!')
    }
    if (user.premiumTime != 0 && user.premium) {
        if (new Date() * 1 >= user.premiumTime) {
            await this.reply(m.chat, `hai @${m.sender.split`@`[0]}\nwaktu premium kamu sudah habis!`, m)
            user.premiumTime = 0
            user.premium = false
        }
    }
}

module.exports = handler
