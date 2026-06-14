const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("game_tips")
    .setDescription("In-game tips")
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
    let imagePath;

    if (type === "war") {
      imagePath = path.join(__dirname, "tips/war_tips.png");

      await interaction.reply({
        content: "Here are some war tips:",
        files: [imagePath]
      });
    } else if (type === "general") {
      const filePath = path.join(__dirname, "tips/general_text.txt");
      tips = fs.readFileSync(filePath, "utf8");

      await interaction.reply({ content: `Here are some general tips: ${tips}` });
    }
    
  }
};