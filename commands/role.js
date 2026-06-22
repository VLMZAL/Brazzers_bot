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
            const roles = member.roles.cache.filter(r => r.id !== interaction.guild.id);

            if (role.size === 0) {
                return interaction.reply(`<@${member.id}> does not have any roles`);
            }

            const menu = new StringSelectMenuBuilder()
                .setCustomId("role-remove")
                .setPlaceholder("Select a role to remove")
                .addOptions(
                    role.map(r => ({
                        label: r.name,
                        value: r.id
                    }))
                );

            const row = new ActionRowBuilder().addComponents(menu);
            await interaction.reply({ content: "Select a role to remove:", components: [row] });
            const filter = i => i.customId === "role-remove" && i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
            
            collector.on("collect", async i => {
                const roleID = i.values[0];
                const role = interaction.guild.roles.cache.get(roleID);
                await member.roles.remove(role);
                await i.update({ 
                    content: `Removed <@&${role.id}> from <@${member.id}>`, components: [] 
                });
            });
        }
    }
};
