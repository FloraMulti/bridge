
const express = require('express');
const app = express();
app.get("/", (req, res) => res.send("Bot attivo"));
app.listen(3000, () => console.log("✅ Keep-alive attivo sulla porta 3000"));
