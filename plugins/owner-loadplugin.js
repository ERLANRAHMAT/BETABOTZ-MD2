const { readdirSync } = require('fs')
const { join } = require ('path')
const { pathToFileURL } = require('url')

const pluginFolder = './plugins'
const pluginFilter = file => file.endsWith('.js')

// Pastikan global.plugins sudah didefinisikan
global.plugins = global.plugins || {}

const handler = async (m) => {
  let loaded = 0
  let failed = []

  for (let filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      const filePath = pathToFileURL(join(pluginFolder, filename)).href
      const module = await import(filePath)
      // Simpan plugin jika berhasil dimuat
      global.plugins[filename] = module.default || module
      loaded++
    } catch (e) {
      // Catat error tanpa menghapus plugin dari global.plugins
      failed.push({ filename, error: `${e.name}: ${e.message}` })
      // Jangan hapus entri dari global.plugins, sehingga jika plugin sebelumnya pernah dimuat, entri itu tetap ada
    }
  }

  let reply = `✅ ${loaded} plugin berhasil dimuat`
  if (failed.length > 0) {
    reply += `\n❌ ${failed.length} plugin gagal dimuat:\n\n` +
      failed.map(p => `*• ${p.filename}*\n> ${p.error}`).join('\n\n')
  }

  m.reply(reply)
}

handler.help = ['loadplugin']
handler.tags = ['owner']
handler.command = /^loadplug(in)?$/i
handler.owner = true

module.exports = handler;
