const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("role")
        .setDescription("Assign or remove a role")
        .addSubcommand(sub =>
            sub
                .setName("add")
                .setDescription("Add a role to a user")
                .addUserOption(opt =>
                    opt.setName("user").setDescription("User").setRequired(true)
                )
                .addRoleOption(opt =>
                    opt.setName("role").setDescription("Role").setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName("remove")
                .setDescription("Remove a role from a user")
                .addUserOption(opt =>
                    opt.setName("user").setDescription("User").setRequired(true)
                )
                .addRoleOption(opt =>
                    opt.setName("role").setDescription("Role").setRequired(true)
                )
        ),

    async execute(interaction) {
        const member = interaction.options.getMember("user");
        const role = interaction.options.getRole("role");
        const sub = interaction.options.getSubcommand();

        if (sub === "add") {
            await member.roles.add(role);
            return interaction.reply(`<@${member.id}> now has <@&${role.id}>`);
        }

        if (sub === "remove") {
            await member.roles.remove(role);
            return interaction.reply(`<@&${role.id}> removed from <@${member.id}>`);
        }
    }
};
