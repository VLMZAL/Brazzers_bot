const { SlashCommandBuilder, User } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("role")
        .setDescription("Assign a role to a user")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Add a role to a user")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Remove a role from a user")
        )
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Select the user")
                .setRequired(true)
                    
        )
        .addRoleOption(option =>
            option
                .setName("role")
                .setDescription("Select the role to assign")
                .setRequired(true)
        ),

        

    async execute(interaction) {
        const member = interaction.options.getMember("user");
        const role = interaction.options.getRole("role");
        const subcommand = interaction.options.getSubcommand();
        let reply = "";

        if (subcommand === "add") {
            await member.roles.add(role);
            
            reply += `<@${member.id}> has been assigned the role <@&${role.id}>! `;
        } else if (subcommand === "remove") {
            await member.roles.remove(role);
            
            reply += `the role <@${role.id}> has been removed from the user <@&${member.id}>! `;

        } else {
            
            reply += `Invalid argument please use either "add" or "remove"`;
        }

        await interaction.reply(reply);
    }
};