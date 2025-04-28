const { Client, LocalAuth } = require("whatsapp-web.js");
const express = require('express');
const TelegramBot = require("node-telegram-bot-api");

// Configurazione bot Telegram
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN; 
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const telegramBot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

// Configurazione server web Express
const app = express();
const PORT = process.env.PORT || 3000;
let currentQr = null;

// Configurazione client WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

// Quando WhatsApp genera un QR, lo salviamo
client.on("qr", (qr) => {
    currentQr = qr;
    console.log("✅ QR Code aggiornato! Vai su / per scansionarlo.");
});

// Quando il client WhatsApp è pronto
client.on("ready", () => {
    console.log("✅ WhatsApp client pronto");
    telegramBot.sendMessage(TELEGRAM_CHAT_ID, "✅ FloraBot avviato correttamente e collegato a WhatsApp!");
});

// Quando arriva un messaggio su WhatsApp
client.on("message", async (message) => {
    try {
        const chat = await message.getChat();
        if (message.body) { 
            telegramBot.sendMessage(TELEGRAM_CHAT_ID, `[Messaggio da WhatsApp]\n${message.body}`);
            console.log("➡️ Inoltrato messaggio su Telegram:", message.body);
        }
    } catch (err) {
        console.error("❌ Errore:", err.message);
    }
});

// Inizializza il client WhatsApp
client.initialize();

// Rende il QR disponibile su una pagina web
app.get("/", (req, res) => {
    if (!currentQr) {
        return res.send("<h1>QR non ancora disponibile... attendi!</h1>");
    }
    res.send(`
        <html>
            <body style="text-align:center;margin-top:50px;">
                <h1>Scansiona questo QR Code per collegare WhatsApp</h1>
                <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(currentQr)}&size=300x300" />
            </body>
        </html>
    `);
});

// Avvia il server web
app.listen(PORT, () => {
    console.log(`🌐 Server QR disponibile su porta ${PORT}`);
});
