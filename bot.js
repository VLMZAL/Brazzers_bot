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
// COMMAND LOADER
// =========================

const path = require("path");
bot.commands = new Map();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  bot.commands.set(command.name, command);
  console.log("Loaded command:", command.name);
}


bot.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const args = message.content.split(" ");
  const commandName = args.shift().toLowerCase();

  const command = bot.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (err) {
    console.error("Command error:", err);
  }
});


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
