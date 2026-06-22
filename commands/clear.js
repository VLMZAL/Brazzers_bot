const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clear bot messages")
        .addIntegerOption(opt =>
            opt.setName("amount")
                .setDescription("How many bot messages to delete")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const amount = interaction.options.getInteger("amount");

        const messages = await interaction.channel.messages.fetch({ limit: 100 });

        const botMessages = messages.filter(msg => msg.author.id === interaction.client.user.id);

        const toDelete = botMessages.first(amount);

        if (!toDelete || toDelete.length === 0) {
            return interaction.reply("No bot messages to delete.");
        }

        await interaction.channel.bulkDelete(toDelete, true);

        return interaction.reply(`Deleted **${toDelete.length}** bot messages.`);
    }
};
