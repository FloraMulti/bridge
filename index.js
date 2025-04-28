const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const TelegramBot = require("node-telegram-bot-api");

const TELEGRAM_TOKEN = "7721844074:AAEQkxlTWH38dDCQ5wUYs1EGBNeLWTDlRuc"; 
const TELEGRAM_CHAT_ID = "-1002689698693";

const telegramBot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    console.log("📱 Scansiona questo QR con WhatsApp Web");
});

client.on("ready", () => {
    console.log("✅ WhatsApp client pronto");
});

client.on("message", async (message) => {
    try {
        // Inoltra QUALSIASI messaggio, sia da gruppo che da chat privata
        if (message.body) {
            telegramBot.sendMessage(TELEGRAM_CHAT_ID, `[${message.from}] ${message.body}`);
            console.log("➡️ Inoltrato messaggio su Telegram:", message.body);
        }
    } catch (err) {
        console.error("❌ Errore:", err.message);
    }
});

client.initialize();
