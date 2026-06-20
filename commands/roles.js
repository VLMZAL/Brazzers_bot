const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("role")
        .setDescription("Add or remove a role from a user")
        .addStringOption(opt =>
            opt.setName("action")
                .setDescription("add or remove")
                .setRequired(true)
                .addChoices(
                    { name: "add", value: "add" },
                    { name: "remove", value: "remove" }
                )
        )
        .addUserOption(opt =>
            opt.setName("user")
                .setDescription("Select the user")
                .setRequired(true)
        )
        .addRoleOption(opt =>
            opt.setName("role")
                .setDescription("Select the role")
                .setRequired(true)
        ),

    async execute(interaction) {
        const action = interaction.options.getString("action");
        const member = interaction.options.getMember("user");
        const role = interaction.options.getRole("role");

        if (action === "add") {
            await member.roles.add(role);
            return interaction.reply(`<@${member.id}> now has <@&${role.id}>`);
        }

        if (action === "remove") {
            await member.roles.remove(role);
            return interaction.reply(`Removed <@&${role.id}> from <@${member.id}>`);
        }
    }
};
