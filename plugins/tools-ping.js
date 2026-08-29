import os from 'os';
import { totalmem, freemem } from 'os';
import { performance } from 'perf_hooks';
import { sizeFormatter } from 'human-readable';

var format = sizeFormatter({
  std: "JEDEC",
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
});

function createBar(percent) {
  let p = Math.max(0, Math.min(100, percent));
  let totalBlocks = 15;
  let filledBlocks = Math.round((p / 100) * totalBlocks);
  let emptyBlocks = totalBlocks - filledBlocks;
  return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
}

var handler = async (m, { conn }) => {
  let old = performance.now();
  await m.reply('_Testing speed..._');
  let neww = performance.now();
  let speed = (neww - old).toFixed(0);

  var _muptime;
  if (process.send) {
    process.send('uptime');
    _muptime = await new Promise(resolve => {
      process.once('message', resolve);
      setTimeout(resolve, 1000);
    }) * 1000;
  }
  var muptime = clockString(_muptime);

  const used = process.memoryUsage();
  const totalMem = totalmem();
  const freeMem = freemem();
  const usedMem = totalMem - freeMem;
  
  let ramPercent = (usedMem / totalMem) * 100;
  let heapPercent = (used.heapUsed / used.heapTotal) * 100;

  let loadAvg = os.loadavg();
  let cpus = os.cpus();
  let cpuModel = cpus && cpus[0] ? cpus[0].model.trim() : 'Unknown';
  let cpuSpeed = cpus && cpus[0] ? cpus[0].speed : 0;
  
  let cpuUsagePercent = Math.min(100, Math.max(0, (loadAvg[0] / cpus.length) * 100));

  var txt = `≡ *S Y S T E M   S T A T U S*
▶ Speed : ${speed} ms
▶ Uptime : ${muptime.trim()}
▶ RSS : ${(used.rss / 1024 / 1024 / 1024).toFixed(1)} GB · Ext ${(used.external / 1024 / 1024).toFixed(1)} MB
▶ CPU : ${cpuModel} (${cpuSpeed} MHz)
▶ Cores : ${cpus.length} · Load ${loadAvg[0].toFixed(2)} / ${loadAvg[1].toFixed(2)} / ${loadAvg[2].toFixed(2)}
▶ OS : ${os.platform()} ${os.arch()} · ${os.uptime ? clockString(os.uptime() * 1000).trim() : ''}
▶ Node : ${process.version} · PID ${process.pid}

CPU · ${cpuUsagePercent.toFixed(1)}%
\`${createBar(cpuUsagePercent)}\`

RAM · ${format(usedMem)} / ${format(totalMem)}
\`${createBar(ramPercent)}\`

HEAP · ${format(used.heapUsed)} / ${format(used.heapTotal)}
\`${createBar(heapPercent)}\`
`.trim();

  await conn.sendMessage(
    m.chat,
    {
      image: { url: "https://telegra.ph/file/ec8cf04e3a2890d3dce9c.jpg" },
      caption: txt,
      mentions: [m.sender],
    },
    { quoted: m }
  );
};

handler.help = ['ping', 'speed'];
handler.tags = ['info'];
handler.command = /^(ping|speed|pong|ingfo)$/i;
export default handler;

function clockString(ms) {
  var d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
  var h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
  var m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  var s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [d > 0 ? `${d}D ` : '', `${h.toString().padStart(2, '0')}:`, `${m.toString().padStart(2, '0')}:`, `${s.toString().padStart(2, '0')}`].join('');
}