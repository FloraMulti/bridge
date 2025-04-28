const { Client, LocalAuth } = require("whatsapp-web.js");
const TelegramBot = require("node-telegram-bot-api");

const TELEGRAM_TOKEN = "INSERISCI_IL_TUO_TOKEN";
const TELEGRAM_CHAT_ID = "INSERISCI_IL_TUO_CHAT_ID";

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

const telegramBot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

client.on("qr", (qr) => {
    const qrLink = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}`;
    console.log("📱 Scansiona il QR aprendo questo link:");
    console.log(qrLink);
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
