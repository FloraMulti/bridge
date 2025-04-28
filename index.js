const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const telegramBot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

let qrCodeData = "";

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

client.on("qr", async (qr) => {
    qrCodeData = await qrcode.toDataURL(qr);
    console.log("📱 QR Code generato! Vai su /qr per vederlo.");
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

// Serve QR Code su una pagina web
app.get("/qr", (req, res) => {
    if (qrCodeData) {
        res.send(`<img src="${qrCodeData}" />`);
    } else {
        res.send("QR Code non ancora generato, attendi...");
    }
});

app.listen(port, () => {
    console.log(`Server attivo su http://localhost:${port}`);
});
