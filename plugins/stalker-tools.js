const fetch = require('node-fetch');

let handler = async (m, {
  conn,
  args,
  text,
  usedPrefix,
  command
}) => {
  if (command == 'ffstalk') {
    if (!text) throw `Example : ${usedPrefix + command} 919044185`;
    m.reply(wait);
    try {
      let ff = await fetch(`https://api.betabotz.eu.org/api/stalk/ff?id=${text}&apikey=${btc}`).then(res => res.json());
      await conn.reply(m.chat, ff.result.userNameGame, m);
    } catch (e) {
      console.log(e);
      throw eror
    }
  }
  if (command == 'mlstalk') {
    if (text.length < 2) throw `Contoh: ${usedPrefix + command} 2480197|2001`;
    m.reply(wait);
    let [id, server] = text.split('|');
    try {
    let ml = await fetch(`https://api.betabotz.eu.org/api/stalk/ml?id=${id}&server=${server}&apikey=${btc}`).then(res => res.json());
    await conn.reply(m.chat,`*ID:* ${ml.result.user_id}\n*Server:* ${ml.result.server_id}\n*Username:* ${ml.result.userName}\n*Region:* ${ml.result.country}`, m);
    } catch (e) {
      console.log(e);
      throw eror
    }
  }
  if (command == 'supersusstalk') {
    if (!text) throw `Example : ${usedPrefix + command} 20431364`;
    m.reply(wait);
    try {
      let sus = await fetch(`https://api.betabotz.eu.org/api/stalk/supersus?id=${text}&apikey=${btc}`).then(res => res.json());
      let results = sus.result;
      let caption = `*S U P E R S U S*\n\n`;
      caption += `*ID:* ${results.id}\n`;
      caption += `*Name:* ${results.name}\n`;
      caption += `*Account:* ${results.account}\n`;
      caption += `*User ID:* ${results.userId}\n`;
      caption += `*Space ID:* ${results.spaceId}\n`;
      caption += `*Sex:* ${results.sex}\n`;
      caption += `*Cup Number:* ${results.cupNum}\n`;
      caption += `*Bind Type:* ${results.bindType}\n`;
      caption += `*Head ID:* ${results.headId}\n`;
      caption += `*Head URL:* ${results.headUrl}\n`;
      caption += `*Device:* ${results.device}\n`;
      await conn.reply(m.chat, caption, m);
    } catch (e) {
      console.log(e);
      throw eror
    }
  }
  if (command == 'npmstalk') {
    if (!text) throw `Example : ${usedPrefix + command} tiktokdl`;
    m.reply(wait);
    try {
        let npm = await fetch(`https://api.betabotz.eu.org/api/stalk/npm?name=${text}&apikey=${btc}`).then(res => res.json());      
        let caption = `*N P M S T A L K*\n\n`
        caption += `*ID:* ${npm.result._id}\n`
        caption += `*Name:* ${npm.result.name}\n`
        caption += `*Description:* ${npm.result.description}\n`
        caption += `*Main:* ${npm.result.main}\n`
        caption += `*License:* ${npm.result.license}\n`
        caption += `*Homepage:* ${npm.result.homepage}\n`
        caption += `*Keywords:* ${npm.result.keywords}\n`
        caption += `*Repository:* ${npm.result.repository.url}\n`
        caption += `*Bugs:* ${npm.result.bugs.url}\n`       
        let versions = npm.result.versions;
        for (let version in versions) {
            let v = versions[version];
            caption += `\n*Version: ${v.version}*\n`
            caption += `*Description:* ${v.description}\n`
            caption += `*Main:* ${v.main}\n`
            caption += `*License:* ${v.license}\n`
            caption += `*Homepage:* ${v.homepage}\n`
            caption += `*Keywords:* ${v.keywords}\n`
            caption += `*Repository:* ${v.repository.url}\n`
            caption += `*Bugs:* ${v.bugs.url}\n`
        }
        await conn.reply(m.chat, caption, m);
      } catch (e) {
      throw eror
    }
 }
 if (command == 'repostalk') {
    if (!text) throw `Example : ${usedPrefix + command} RTXZY-MD`;
    m.reply(wait);
    try {
      let repo = await fetch(`https://api.betabotz.eu.org/api/stalk/repo?repo=${text}&apikey=${btc}`).then(res => res.json());
      let caption = `*R E P O S T A L K*\n\n`;
      caption += `*ID:* ${repo.result.items[0].id}\n`;
      caption += `*Node ID:* ${repo.result.items[0].nodeId}\n`;
      caption += `*Nama Repo:* ${repo.result.items[0].nameRepo}\n`;
      caption += `*Nama Lengkap Repo:* ${repo.result.items[0].fullNameRepo}\n`;
      caption += `*URL Repo:* ${repo.result.items[0].url_repo}\n`;
      caption += `*Deskripsi:* ${repo.result.items[0].description}\n`;
      caption += `*URL Git:* ${repo.result.items[0].git_url}\n`;
      caption += `*URL SSH:* ${repo.result.items[0].ssh_url}\n`;
      caption += `*URL Clone:* ${repo.result.items[0].clone_url}\n`;
      caption += `*URL SVN:* ${repo.result.items[0].svn_url}\n`;
      caption += `*Homepage:* ${repo.result.items[0].homepage}\n`;
      caption += `*Stargazers:* ${repo.result.items[0].stargazers}\n`;
      caption += `*Watchers:* ${repo.result.items[0].watchers}\n`;
      caption += `*Forks:* ${repo.result.items[0].forks}\n`;
      caption += `*Default Branch:* ${repo.result.items[0].defaultBranch}\n`;
      caption += `*Bahasa:* ${repo.result.items[0].language}\n`;
      caption += `*Private:* ${repo.result.items[0].isPrivate}\n`;
      caption += `*Fork:* ${repo.result.items[0].isFork}\n`;
      caption += `*Created At:* ${repo.result.items[0].createdAt}\n`;
      caption += `*Updated At:* ${repo.result.items[0].updatedAt}\n`;
      caption += `*Pushed At:* ${repo.result.items[0].pushedAt}\n`;
      caption += `*Author Username:* ${repo.result.items[0].author.username}\n`;
      caption += `*Author ID:* ${repo.result.items[0].author.id_user}\n`;
      caption += `*Author Avatar URL:* ${repo.result.items[0].author.avatar_url}\n`;
      caption += `*Author GitHub URL:* ${repo.result.items[0].author.user_github_url}\n`;
      caption += `*Author Type:* ${repo.result.items[0].author.type}\n`;
      caption += `*Is Site Admin:* ${repo.result.items[0].author.isSiteAdmin}\n`;
      await conn.reply(m.chat, caption, m);
    } catch (error) {
      throw eror
    }
  }
  if (command == 'genshinstalk' || command == 'stalkgenshin' || 'gistalk') {
    if (!text) throw `Example : ${usedPrefix + command} 843829161`;
    m.reply(wait);
    try {
      let genshin = await fetch(`https://api.betabotz.eu.org/api/stalk/genshin?id=${text}&apikey=${btc}`).then(res => res.json());
      
      if (!genshin.status) throw 'Failed to fetch Genshin Impact data';
      
      let result = genshin.result[0];
      let caption = `*G E N S H I N  I M P A C T*\n\n`;
      caption += `*Nickname:* ${result.nickname}\n`;
      caption += `*UID:* ${result.uid}\n`;
      caption += `*Level:* ${result.level}\n`;
      caption += `*World Level:* ${result.worldLevel}\n`;
      caption += `*Achievement:* ${result.achievement}\n`;
      caption += `*Card ID:* ${result.cardId}\n`;
      caption += `*Spiral Abyss:* ${result.spiralAbyss}\n`;
      caption += `*Detail:* ${result.detail}\n`;
      
      await conn.sendMessage(m.chat, { image: { url: result.image }, caption: caption}, { quoted: m });
      // await conn.reply(m.chat, caption, m);
    } catch (e) {
      console.log(e);
      throw eror
    }
  }
  if (command == 'hokstalk') {
  if (!text) throw `Example: ${usedPrefix + command} 6467015277108375938`;
  m.reply(wait);
  try {
    let { result } = await fetch(`https://api.betabotz.eu.org/api/stalk/hok?id=${text}&apikey=${btc}`).then(res => res.json());
    if (!result.ok) throw 'Player not found!';
    conn.reply(m.chat, result.name, m);
  } catch (e) {
    throw eror
  }
 }
}

handler.command = handler.help = ['ffstalk', 'mlstalk', 'supersusstalk', 'npmstalk', 'repostalk', 'genshinstalk', 'stalkgenshin', 'gistalk', 'hokstalk']
handler.tags = ['stalk']
handler.limit = true

module.exports = handler