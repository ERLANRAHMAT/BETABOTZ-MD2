let fetch = require('node-fetch');

let handler = async (m, { usedPrefix, command, text }) => {
    try {
        if (command === 'growgarden' && !text) {
            m.reply(`Please specify a subcommand: \`stock\` or \`weather\`\nExample: \`${usedPrefix + command} stock\` or \`${usedPrefix + command} weather\``);
            return;
        }
        m.reply(wait);
        if (text.toLowerCase() === 'stock') {
            let res = await (await fetch(`https://api.betabotz.eu.org/api/webzone/grow-and-garden-stock?apikey=${lann}`)).json();
            let content = `*🌱 G R O W  &  G A R D E N  S T O C K S 🌱*\n\n`;

            if (res.status && res.result && res.result.data) {
                let gearStocks = res.result.data.filter(item => item.category === "GEAR STOCKS");
                let eggStocks = res.result.data.filter(item => item.category === "EGG STOCKS");
                let seedsStocks = res.result.data.filter(item => item.category === "SEEDS STOCKS");
                let eventStocks = res.result.data.filter(item => item.category === "EVENT STOCKS");

                content += `*🛠️ Gear Stocks:*\n`;
                gearStocks.forEach(item => {
                    content += `  ◦ ${item.name}: ${item.count}\n`;
                });

                content += `\n*🥚 Egg Stocks:*\n`;
                eggStocks.forEach(item => {
                    content += `  ◦ ${item.name}: ${item.count}\n`;
                });

                content += `\n*🌾 Seeds Stocks:*\n`;
                seedsStocks.forEach(item => {
                    content += `  ◦ ${item.name}: ${item.count}\n`;
                });

                content += `\n*🎉 Event Stocks:*\n`;
                eventStocks.forEach(item => {
                    content += `  ◦ ${item.name}: ${item.count}\n`;
                });
            } else {
                content += 'Data stok tidak ditemukan.';
            }
            await m.reply(content);
        } else if (text.toLowerCase() === 'weather') {
            let res = await (await fetch(`https://api.betabotz.eu.org/api/webzone/grow-and-garden-weather?apikey=${lann}`)).json();
            let content = `*🌦️ G R O W  &  G A R D E N  W E A T H E R 🌦️*\n\n`;

            if (res.status && res.result) {
                content += `📌 *Weather Status*:\n${res.result.description}\n`;
                content += `⏰ *Ends*: ${res.result.endsStatus}`;
            } else {
                content += 'Data cuaca tidak ditemukan.';
            }
            await m.reply(content);
        } else {
            m.reply(`Please specify a subcommand: \`stock\` or \`weather\`\nExample: \`${usedPrefix + command} stock\` or \`${usedPrefix + command} weather\``);
            return;
        }
    } catch (error) {
        throw 'Server Grow Garden Error! Please Contact Admin';
    }
};

handler.command = ['growgarden'];
handler.tags = ['internet'];
handler.limit = true;
module.exports = handler;
