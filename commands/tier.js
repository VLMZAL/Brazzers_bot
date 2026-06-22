const {
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tier")
        .setDescription("Add or remove a tier from a user")
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
            opt.setName("tier")
                .setDescription("Select the tier (only for add)")
                .setRequired(false) 
        ),

    async execute(interaction) {
        const action = interaction.options.getString("action");
        const member = interaction.options.getMember("user");
        const tier = interaction.options.getRole("tier");

    
        if (action === "add") {
            if (!tier) {
                return interaction.reply("You must select a tier to add.");
            }

            await member.roles.add(tier);
            return interaction.reply(`<@${member.id}> now has <@&${tier.id}>`);
        }


        if (action === "remove") {
 
            const roles = member.roles.cache.filter(r => r.id !== interaction.guild.id);

            if (roles.size === 0) {
                return interaction.reply(`<@${member.id}> does not have any tiers`);
            }

            const menu = new StringSelectMenuBuilder()
                .setCustomId("tier-remove")
                .setPlaceholder("Select a tier to remove")
                .addOptions(
                    roles.map(r => ({
                        label: r.name,
                        value: r.id
                    }))
                );

            const row = new ActionRowBuilder().addComponents(menu);

            await interaction.reply({
                content: "Select a tier to remove:",
                components: [row]
            });

            const filter = i =>
                i.customId === "tier-remove" &&
                i.user.id === interaction.user.id;

            const collector = interaction.channel.createMessageComponentCollector({
                filter,
                time: 15000
            });

            collector.on("collect", async i => {
                const tierID = i.values[0];
                const selectedTier = interaction.guild.roles.cache.get(tierID);

                await member.roles.remove(selectedTier);

                await i.update({
                    content: `Removed <@&${selectedTier.id}> from <@${member.id}>`,
                    components: []
                });
            });
        }
    }
};
