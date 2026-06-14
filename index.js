// =========================
// ENV VARIABLES
// =========================

const { DISCORD_TOKEN, APPID, SERVER_ID } = process.env;

const { Client, GatewayIntentBits, Collection, REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

const commandsJSON = [];

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    commandsJSON.push(command.data.toJSON());

}

async function registerCommands() {
    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

    try {
        console.log("Updating commands...");
        await rest.put(
            Routes.applicationGuildCommands(process.env.APPID, process.env.SERVER_ID),
            { body: commandsJSON }
        );
        console.log("Commands updated!");
    } catch (err) {
        console.error("Error updating commands:", err);
    }
}


client.once("ready", async () => {
    console.log("Bot online!");
    await registerCommands();
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (err) {
        console.error(err);
        await interaction.reply("Error executing command.");
    }
});

client.login(process.env.DISCORD_TOKEN);
