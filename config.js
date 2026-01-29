global.owner = ['62895401166720']  
global.mods = ['62895401166720'] 
global.prems = ['62895401166720']
global.nameowner = 'Lann'
global.numberowner = '62895401166720'
global.mail = 'support@tioprm.eu.org' 
global.gc = 'https://chat.whatsapp.com/G4f1fTpz9zL4EH3FyIcaPR'
global.instagram = 'https://instagram.com/erlanrahmat_14'
global.wm = '© Tio'
global.wait = '_*Tunggu sedang di proses...*_'
global.eror = '_*Server Error*_'
global.stiker_wait = '*⫹⫺ Stiker sedang dibuat...*'
global.packname = 'Made With'
global.author = 'Bot WhatsApp'
global.maxwarn = '2' // Peringatan maksimum
global.antiporn = true // Auto delete pesan porno (bot harus admin)

// Prefix
global.prefix = './#'
//INI WAJIB DI ISI!//
global.lann = ''
global.aksesKey = '' // Register dan buy 
//Daftar terlebih dahulu https://api.betabotz.eu.org

global.APIs = {   
  lann: 'https://api.betabotz.eu.org',
}
global.APIKeys = { 
  'https://api.betabotz.eu.org': global.lann, 
}

let fs = require('fs')
let chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  delete require.cache[file]
  require(file)
})
