const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 10000;

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
});

const telegramBot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

client.on('qr', (qr) => {
    console.log("🔄 QR Code aggiornato! Vai su / per scansionarlo.");
    qrcode.generate(qr, { small: true });
    qrCodeData = qr;
});

let qrCodeData = "";

app.get('/', (req, res) => {
    if (!qrCodeData) {
        return res.send('QR Code non disponibile. Riprova tra poco.');
    }
    res.send(`<html><body><h1>Scansiona il QR Code</h1><img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCodeData)}&size=300x300" /></body></html>`);
});

app.listen(PORT, () => {
    console.log(`🌐 Server QR disponibile su porta ${PORT}`);
});

client.on('ready', () => {
    console.log("✅ WhatsApp client pronto");
    telegramBot.sendMessage(TELEGRAM_CHAT_ID, "✅ FloraBot avviato correttamente e collegato a WhatsApp!");
});

// Quando riceve un messaggio WhatsApp
client.on('message', async (message) => {
    console.log("📩 Ricevuto messaggio:", message.body);
    try {
        if (message.body) {
            telegramBot.sendMessage(TELEGRAM_CHAT_ID, `[WhatsApp]\n${message.body}`);
            console.log("➡️ Inoltrato su Telegram:", message.body);
        }
    } catch (err) {
        console.error("❌ Errore nell'inoltro:", err.message);
    }
});

client.initialize();
