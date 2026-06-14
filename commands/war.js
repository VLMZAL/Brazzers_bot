const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("tips")
    .setDescription("All tips")
    .addStringOption(option =>
      option.setName("type")
        .setDescription("Select the type of tip you want")
        .setRequired(true)
        .addChoices(
          { name: "War", value: "war" },
          { name: "General", value: "general" }
        )
      ),
  
    async execute(interaction) {
    const type = interaction.options.getString("type");
    let tips;

    if (type === "war") {
      const filePath = path.join(__dirname, "tips/war_text.txt");
      tips = fs.readFileSync(filePath, "utf8");

    } else if (type === "general") {
      const filePath = path.join(__dirname, "tips/general_text.txt");
      tips = fs.readFileSync(filePath, "utf8");

    }
    await interaction.reply({ content: `Here are some **${type}** tips: ${tips}` });
  }
};