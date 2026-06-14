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
    const inputPath = req.file.path;
    const outputPath = inputPath + ".png";

    // Convert to PNG
    await sharp(inputPath)
      .png()
      .toFile(outputPath);

    // Remove original file
    fs.unlinkSync(inputPath);

    const channel = await bot.channels.fetch(CHANNEL_ID);

    await channel.send({
      content: `<@&${ROLE_ID}> **War Status Update**`,
      files: [outputPath]
    });

    fs.unlinkSync(outputPath);
    res.json({ ok: true });

  } catch (err) {
    console.error("File upload error:", err);
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