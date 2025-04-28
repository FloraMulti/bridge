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
        const chat = await message.getChat();
        if (chat.isGroup && message.body) {
            telegramBot.sendMessage(TELEGRAM_CHAT_ID, message.body);
            console.log("➡️ Inoltrato messaggio su Telegram");
        }
    } catch (err) {
        console.error("Errore:", err.message);
    }
});

client.initialize();
