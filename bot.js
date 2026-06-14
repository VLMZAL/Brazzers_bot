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
const { Client, GatewayIntentBits } = require("discord.js");

// =========================
// DISCORD BOT
// =========================

const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
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
  try {
    // Path of the uploaded file (any type)
    const filePath = req.file.path;

    // Fetch channel
    const channel = await bot.channels.fetch(CHANNEL_ID);

    // Send file as-is
    await channel.send({
      content: `<@&${ROLE_ID}> **War Status Update**`,
      files: [filePath]
    });

    // Delete file after sending
    fs.unlinkSync(filePath);

    res.json({ ok: true });

  } catch (err) {
    console.error("File upload error:", err);
    res.json({ ok: false });
  }
});

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
