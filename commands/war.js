const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("war-tips")
    .setDescription("Send war tips")
    .addStringOption(option =>
      option.setName("text")
        .setDescription("The tip")
        .setRequired(true)
    ),
  async execute(interaction) {
    const text = interaction.options.getString("text");
    await interaction.reply("⚔️ War tip: " + text);
  }
};
