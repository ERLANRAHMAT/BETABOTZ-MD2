const config = require('../bot-config');
const { getContentType } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

// Import semua command
const menuCommand = require('../commands/menu');
const ppobCommand = require('../commands/ppob');
const downloaderCommand = require('../commands/downloader');
const ownerCommand = require('../commands/owner');
const storeCommand = require('../commands/store');
const stickerCommand = require('../commands/sticker');

// Handler untuk command
async function commandHandler(sock, m, store) {
    try {
        if (!m.message) return;
        
        const messageType = getContentType(m.message);
        const body = 
            messageType === 'conversation' ? m.message.conversation :
            messageType === 'extendedTextMessage' ? m.message.extendedTextMessage.text :
            messageType === 'imageMessage' ? m.message.imageMessage.caption :
            messageType === 'videoMessage' ? m.message.videoMessage.caption :
            '';
        
        if (!body) return;
        
        const from = m.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const sender = isGroup ? m.key.participant : from;
        const senderNumber = sender.split('@')[0];
        const isOwner = config.owner.numbers.includes(senderNumber);
        
        // Cek apakah pesan dimulai dengan prefix
        if (!body.startsWith(config.bot.prefix)) return;
        
        // Parse command dan args
        const args = body.slice(config.bot.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        
        // Context object untuk dikirim ke command handler
        const ctx = {
            sock,
            m,
            from,
            sender,
            senderNumber,
            isGroup,
            isOwner,
            args,
            body,
            command,
            reply: async (text) => {
                return await sock.sendMessage(from, { text }, { quoted: m });
            },
            replyWithImage: async (buffer, caption) => {
                return await sock.sendMessage(from, { image: buffer, caption }, { quoted: m });
            },
            replyWithVideo: async (buffer, caption) => {
                return await sock.sendMessage(from, { video: buffer, caption }, { quoted: m });
            },
            replyWithSticker: async (buffer) => {
                return await sock.sendMessage(from, { sticker: buffer }, { quoted: m });
            }
        };
        
        // Route ke command yang sesuai
        switch (command) {
            // Menu Commands
            case 'menu':
            case 'help':
                await menuCommand.main(ctx);
                break;
            
            // PPOB Commands
            case 'pulsa':
            case 'paketdata':
            case 'pln':
            case 'emoney':
            case 'cekppob':
                await ppobCommand.handle(ctx);
                break;
            
            // Downloader Commands
            case 'tiktok':
            case 'tt':
            case 'instagram':
            case 'ig':
            case 'youtube':
            case 'yt':
            case 'ytmp3':
            case 'ytmp4':
            case 'facebook':
            case 'fb':
            case 'twitter':
            case 'x':
                await downloaderCommand.handle(ctx);
                break;
            
            // Owner Commands
            case 'setmode':
            case 'broadcast':
            case 'bc':
            case 'addowner':
            case 'delowner':
            case 'block':
            case 'unblock':
                if (!isOwner) {
                    await ctx.reply(config.messages.ownerOnly);
                    return;
                }
                await ownerCommand.handle(ctx);
                break;
            
            // Store Commands
            case 'store':
            case 'addproduk':
            case 'delproduk':
            case 'listproduk':
            case 'order':
                await storeCommand.handle(ctx);
                break;
            
            // Sticker Commands
            case 'sticker':
            case 's':
            case 'stiker':
                await stickerCommand.handle(ctx);
                break;
            
            default:
                // Command tidak ditemukan
                break;
        }
        
    } catch (error) {
        console.error('Error in command handler:', error);
    }
}

module.exports = commandHandler;
