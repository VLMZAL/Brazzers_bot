const { SlashCommandBuilder } = require("discord.js");

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
    let text;

    if (type === "war") {
      text = "Use the right troops for the right base. For example, if you are attacking a base with a lot of air defenses, use more air troops.";

    } else if (type === "general") {
      text = "Here are some general tips for the game.";

    }
    await interaction.reply({ content: `This are all the **${type}** tips: ${text}` });
  }
};
