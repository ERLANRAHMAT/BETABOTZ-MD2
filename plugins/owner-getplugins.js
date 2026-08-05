import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let handler = async (m, { usedPrefix, command, text }) => {
    if (!text) throw `text nya mana?\n\contoh: ${usedPrefix + command} menu`
    
    const filename = path.join(__dirname, `./${text}${!/\.js$/i.test(text) ? '.js' : ''}`)
    const listPlugins = fs.readdirSync(__dirname).map(v => v.replace(/\.js/, ''))
    
    if (!fs.existsSync(filename)) return m.reply(`
'${filename}' tidak ditemukan!

*List Plugins:*
${listPlugins.join('\n').trim()}
`.trim())

    m.reply(fs.readFileSync(filename, 'utf8'))
}

handler.help = ['getplugin'].map(v => v + ' [filename]')
handler.tags = ['owner']
handler.command = /^(getplugin|get ?plugin|gp)$/i

handler.rowner = true

export default handler