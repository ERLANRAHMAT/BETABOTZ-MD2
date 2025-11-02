#!/bin/bash

# WhatsApp Bot Startup Script

echo "╔════════════════════════════════════╗"
echo "║   WhatsApp Bot PPOB & Downloader   ║"
echo "╚════════════════════════════════════╝"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if auth_info exists
if [ ! -d "auth_info" ]; then
    echo "⚠️  No session found. You will need to scan QR code."
    echo ""
fi

# Create necessary directories
mkdir -p temp database

# Start bot
echo "🚀 Starting bot..."
echo ""
node bot.js
