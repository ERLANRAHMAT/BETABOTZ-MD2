const fs = require("fs");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");

let handler = async (m, { conn, args, usedPrefix, command }) => {
    conn["youtubedl"] = conn["youtubedl"] || {};

    if (!args[0]) {
        if (command === 'ytmp4' || command === 'ytv') {
            return m.reply(`Example: *${usedPrefix + command}* https://www.youtube.com/watch?v=Z28dtg_QmFw`);
        } else if (command === 'ytmp3' || command === 'yta') {
            return m.reply(`Example: *${usedPrefix + command}* https://www.youtube.com/watch?v=Z28dtg_QmFw`);
        } else if (command === 'ytshorts' || command === 'shorts') {
            return m.reply(`Example: *${usedPrefix + command}* https://youtube.com/shorts/aUDYWYqtAR4?si=qnyP58tCoDV7ghjM`);
        }
    }

    if (command === 'ytmp4' || command === 'ytv' || command === 'ytmp3' || command === 'yta' || command === 'ytshorts' || command === 'shorts') {
        conn["youtubedl"][m.sender] = true;

        const isValid = await ytdl.validateURL(args[0]);

        if (!isValid) {
            return m.reply("*your link not supported.*");
        }

        const _filename = `./tmp/${Math.random().toString(36).substring(2, 7)}`;
        const writer = fs.createWriteStream(`${_filename}.mp4`);

        try {
            const { formats, videoDetails } = await ytdl.getInfo(args[0]);
            const { title, publishDate, author } = videoDetails;
            const { user } = author;

            return new Promise(async (resolve, reject) => {
                if (command === 'ytmp4' || command === 'ytv') {
                    ytdl(args[0], {
                        quality: "lowest",
                    }).pipe(writer);
                } else if (command === 'ytmp3' || command === 'yta') {
                    let audio = ytdl(args[0], { quality: 'highestaudio' });
                    const inputFilePath = `${_filename}.webm`;
                    const outputFilePath = `${_filename}.mp3`;

                    audio.pipe(fs.createWriteStream(inputFilePath)).on('finish', async () => {
                        ffmpeg(inputFilePath)
                            .toFormat('mp3')
                            .on('end', async () => {
                                try {
                                    let buffer = fs.readFileSync(outputFilePath);
                                    await conn.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mpeg' }, { quoted: m });
                                } catch (error) {
                                    m.reply("Failed to send the audio");
                                } finally {
                                    fs.unlinkSync(inputFilePath);
                                    fs.unlinkSync(outputFilePath);
                                    delete conn["youtubedl"][m.sender];
                                    resolve();
                                }
                            })
                            .on('error', (err) => {
                                console.log(err);
                                m.reply(`*Convert Error:* ${err.message}`);
                                fs.unlinkSync(inputFilePath);
                                fs.unlinkSync(outputFilePath);
                                delete conn["youtubedl"][m.sender];
                                resolve();
                            })
                            .save(outputFilePath);
                    });
                } else if (command === 'ytshorts' || command === 'shorts') {
                    ytdl(args[0], {
                        quality: "lowest",
                    }).pipe(writer);
                }

                writer.on("error", () => {
                    m.reply("Failed sending video");
                    delete conn["youtubedl"][m.sender];
                    resolve();
                });

                writer.on("close", async () => {
                    try {
                        let mediaObject;

                        if (command === 'ytmp4' || command === 'ytv') {
                            mediaObject = {
                                video: {
                                    stream: fs.createReadStream(`${_filename}.mp4`),
                                },
                                caption: `┌  • *Y o u t u b e - M P 4*\n│  ◦ *Title:* ${title}\n│  ◦ *Published:* ${publishDate}\n└  ◦ *Author:* ${user}`,
                            };
                        } else if (command === 'ytmp3' || command === 'yta') {
                            mediaObject = {
                                audio: {
                                    stream: fs.createReadStream(`${_filename}.mp3`),
                                },
                                mimetype: 'audio/mpeg',
                            };
                        } else if (command === 'ytshorts' || command === 'shorts') {
                            mediaObject = {
                                video: {
                                    stream: fs.createReadStream(`${_filename}.mp4`),
                                },
                                caption: `┌  • *Y o u t u b e - S h o r t s*\n│  ◦ *Title:* ${title}\n│  ◦ *Published:* ${publishDate}\n└  ◦ *Author:* ${user}`,
                            };
                        }

                        await conn.sendMessage(m.chat, mediaObject, { quoted: m });
                    } catch {
                        m.reply("Failed to send the media");
                    }

                    fs.unlinkSync(`${_filename}.mp4`);
                    fs.unlinkSync(`${_filename}.mp3`);
                    delete conn["youtubedl"][m.sender];
                    resolve();
                });
            });
        } catch {
            m.reply("*Failed to get a video or audio!*");
        }
    }
};

handler.help = ["ytmp4", "ytmp3", "ytshorts"].map((v) => v + ' url');
handler.tags = ["downloader"];
handler.command = /^(ytmp4|ytv|ytmp3|yta|ytshorts|shorts)$/i;
handler.register = false;

module.exports = handler;
