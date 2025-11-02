// Helper functions untuk bot

const fs = require('fs');
const path = require('path');

// Format nomor WhatsApp
function formatNumber(number) {
    let formatted = number.replace(/[^0-9]/g, '');
    
    // Jika dimulai dengan 0, ganti dengan 62
    if (formatted.startsWith('0')) {
        formatted = '62' + formatted.substring(1);
    }
    
    // Jika tidak dimulai dengan 62, tambahkan 62
    if (!formatted.startsWith('62')) {
        formatted = '62' + formatted;
    }
    
    return formatted + '@s.whatsapp.net';
}

// Format currency
function formatCurrency(amount) {
    return 'Rp ' + parseInt(amount).toLocaleString('id-ID');
}

// Format date
function formatDate(date = new Date()) {
    return date.toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Generate random ID
function generateId(prefix = 'ID') {
    return prefix + Date.now() + Math.random().toString(36).substring(2, 9).toUpperCase();
}

// Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Check if user is owner
function isOwner(number, ownerNumbers) {
    const cleanNumber = number.replace('@s.whatsapp.net', '');
    return ownerNumbers.includes(cleanNumber);
}

// Check if group
function isGroup(jid) {
    return jid.endsWith('@g.us');
}

// Get file size
function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.size;
    } catch (error) {
        return 0;
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Validate URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (error) {
        return false;
    }
}

// Extract URL from text
function extractUrl(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    return matches ? matches[0] : null;
}

// Validate phone number
function isValidPhoneNumber(number) {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    return phoneRegex.test(number);
}

// Clean phone number
function cleanPhoneNumber(number) {
    return number.replace(/[^0-9]/g, '');
}

// Create directory if not exists
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// Read JSON file
function readJSON(filePath, defaultValue = {}) {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
        return defaultValue;
    } catch (error) {
        console.error('Error reading JSON:', error);
        return defaultValue;
    }
}

// Write JSON file
function writeJSON(filePath, data) {
    try {
        ensureDir(path.dirname(filePath));
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing JSON:', error);
        return false;
    }
}

// Get runtime
function runtime(seconds) {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);
    
    const dDisplay = d > 0 ? d + ' hari ' : '';
    const hDisplay = h > 0 ? h + ' jam ' : '';
    const mDisplay = m > 0 ? m + ' menit ' : '';
    const sDisplay = s > 0 ? s + ' detik' : '';
    
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

// Parse command
function parseCommand(text, prefix) {
    if (!text.startsWith(prefix)) return null;
    
    const args = text.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    return { command, args };
}

// Chunk array
function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

// Random element from array
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Escape regex
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Truncate text
function truncate(text, length = 100) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

module.exports = {
    formatNumber,
    formatCurrency,
    formatDate,
    generateId,
    sleep,
    isOwner,
    isGroup,
    getFileSize,
    formatFileSize,
    isValidUrl,
    extractUrl,
    isValidPhoneNumber,
    cleanPhoneNumber,
    ensureDir,
    readJSON,
    writeJSON,
    runtime,
    parseCommand,
    chunkArray,
    randomElement,
    escapeRegex,
    truncate
};
