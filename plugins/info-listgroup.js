const fs = require('fs');
const path = require('path');

let handler = async (m, { conn, participants }) => {
	let now = new Date() * 1;
	let groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats && !chat.metadata?.read_only && !chat.metadata?.announce).map(v => v[0]);
    let txt = '';

    let groupDataFile = path.join(__dirname, 'info-listgroup.json');
    let groupData;
    if (fs.existsSync(groupDataFile)) {
        groupData = JSON.parse(fs.readFileSync(groupDataFile, 'utf-8'));
    } else {
        groupData = {};
    }

    for (let jid in groupData) {
        if (!groups.includes(jid)) {
            groups.push(jid);
        }
    }

    for (let jid of groups) {
        let chat = conn.chats[jid] || {};
        let groupInfo = groupData[jid] || {
            isBanned: false,
            welcome: false,
            antiLink: false,
            delete: true,
        };
        groupData[jid] = groupInfo; 
        txt += `${await conn.getName(jid)}\n${jid} [${chat?.metadata?.read_only ? 'Left' : 'Joined'}]\n${groupInfo.expired ? msToDate(groupInfo.expired - now) : '*Tidak Diatur Expired Group*'}
${groupInfo.isBanned ? '✅' : '❌'} _Group Banned_
${groupInfo.welcome ? '✅' : '❌'} _Auto Welcome_
${groupInfo.antiLink ? '✅' : '❌'} _Anti Link_\n\n`;
    }

    m.reply(`List Groups:
Total Group: ${groups.length}

${txt}

`.trim());

    fs.writeFileSync(groupDataFile, JSON.stringify(groupData, null, 2));
}

handler.help = ['grouplist'];
handler.tags = ['group'];
handler.command = /^(group(s|list)|(s|list)group)$/i;

module.exports = handler;

function msToDate(ms) {
  temp = ms
  days = Math.floor(ms / (24 * 60 * 60 * 1000));
  daysms = ms % (24 * 60 * 60 * 1000);
  hours = Math.floor((daysms) / (60 * 60 * 1000));
  hoursms = ms % (60 * 60 * 1000);
  minutes = Math.floor((hoursms) / (60 * 1000));
  minutesms = ms % (60 * 1000);
  sec = Math.floor((minutesms) / (1000));
  return days + " hari " + hours + " jam " + minutes + " menit";
  // 
}