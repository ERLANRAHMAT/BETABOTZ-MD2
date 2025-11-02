const config = require('../bot-config');
const { getContentType, downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

// Handler untuk semua pesan masuk
async function messageHandler(sock, m, store) {
    try {
        if (!m.message) return;
        
        const messageType = getContentType(m.message);
        const from = m.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const sender = isGroup ? m.key.participant : from;
        
        // Cek apakah pesan dari owner
        const isOwner = config.owner.numbers.includes(sender.split('@')[0]);
        
        // Cek mode bot
        if (config.bot.mode === 'self' && !isOwner) return;
        
        // Handle View Once Messages (RVO)
        if (messageType === 'viewOnceMessageV2' || messageType === 'viewOnceMessage') {
            await handleViewOnce(sock, m);
        }
        
        // Log pesan
        const senderName = m.pushName || 'Unknown';
        const messageContent = getMessageContent(m.message);
        console.log(`[${isGroup ? 'GROUP' : 'PRIVATE'}] ${senderName}: ${messageContent}`);
        
    } catch (error) {
        console.error('Error in message handler:', error);
    }
}

// Fungsi untuk handle View Once Messages
async function handleViewOnce(sock, m) {
    try {
        const msg = m.message.viewOnceMessageV2 || m.message.viewOnceMessage;
        const messageContent = msg.message;
        
        if (!messageContent) return;
        
        const type = getContentType(messageContent);
        const from = m.key.remoteJid;
        
        // Download media
        const buffer = await downloadMediaMessage(
            { message: messageContent },
            'buffer',
            {},
            { 
                logger: console,
                reuploadRequest: sock.updateMediaMessage
            }
        );
        
        // Kirim kembali tanpa view once
        if (type === 'imageMessage') {
            await sock.sendMessage(from, {
                image: buffer,
                caption: `📸 *View Once Image Captured*\n\n${messageContent.imageMessage?.caption || ''}`
            });
        } else if (type === 'videoMessage') {
            await sock.sendMessage(from, {
                video: buffer,
                caption: `🎥 *View Once Video Captured*\n\n${messageContent.videoMessage?.caption || ''}`
            });
        }
        
        console.log('View Once message captured and resent');
    } catch (error) {
        console.error('Error handling view once:', error);
    }
}

// Fungsi untuk mendapatkan konten pesan
function getMessageContent(message) {
    const type = getContentType(message);
    
    if (type === 'conversation') {
        return message.conversation;
    } else if (type === 'extendedTextMessage') {
        return message.extendedTextMessage.text;
    } else if (type === 'imageMessage') {
        return '[Image]';
    } else if (type === 'videoMessage') {
        return '[Video]';
    } else if (type === 'audioMessage') {
        return '[Audio]';
    } else if (type === 'stickerMessage') {
        return '[Sticker]';
    } else if (type === 'documentMessage') {
        return '[Document]';
    } else if (type === 'viewOnceMessage' || type === 'viewOnceMessageV2') {
        return '[View Once Message]';
    }
    
    return '[Unknown Message Type]';
}

module.exports = messageHandler;
