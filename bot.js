// =========================
// ENV VARIABLES
// =========================

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const ROLE_ID = process.env.ROLE_ID;
const PORT = process.env.PORT || 3000;

// =========================
// IMPORTS
// =========================

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");
const { Client, GatewayIntentBits } = require("discord.js");

// =========================
// DISCORD BOT
// =========================

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

bot.once("ready", () => {
  console.log("🤖 Bot is online as:", bot.user.tag);
});

bot.login(DISCORD_TOKEN);

// =========================
// EXPRESS SERVER
// =========================

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), async (req, res) => {
  console.log("📥 Richiesta /upload ricevuta");

  try {
    if (!req.file) {
      console.error("❌ Nessun file ricevuto");
      return res.json({ ok: false });
    }

    const inputPath = req.file.path;
    const outputPath = inputPath + ".png";

    console.log("🖼 Converto il file in PNG...");

    await sharp(inputPath).png().toFile(outputPath);
    fs.unlinkSync(inputPath);

    console.log("📡 Cerco il canale:", CHANNEL_ID);

    let channel;
    try {
      channel = await bot.channels.fetch(CHANNEL_ID);
      console.log("✔ Canale trovato:", channel.id);
    } catch (err) {
      console.error("❌ ERRORE fetch canale:", err);
      return res.json({ ok: false });
    }

    console.log("📤 Invio messaggio al canale...");

    try {
      await channel.send({
        content: `<@&${ROLE_ID}> **War Status Update**`,
        files: [outputPath]
      });
      console.log("✅ Messaggio inviato");
    } catch (err) {
      console.error("❌ ERRORE invio messaggio:", err);
      return res.json({ ok: false });
    }

    fs.unlinkSync(outputPath);
    res.json({ ok: true });

  } catch (err) {
    console.error("❌ ERRORE GENERALE:", err);
    res.json({ ok: false });
  }
});

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});


// =========================
// DISCORD COMMANDS (ALL HERE)
// =========================

bot.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "/game tips") {
    return message.reply("always check the map before moving! 🗺️");
  }
    options.addStringOption(option => {
      option.setName("war-tips")
        .setDescription("war-specific tips")
        .setRequired(true);
      return option;
    });

    options.addStringOption(option => {
      option.setName("general-tips")
        .setDescription("General game tips")
        .setRequired(true);
      return option;
    });
      
        


 

});