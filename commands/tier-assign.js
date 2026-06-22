const { SlashCommandBuilder } = require("discord.js");
const { ROLE_ID_R1, ROLE_ID_R2, ROLE_ID_R3, ROLE_ID_R4, ROLE_ID_R5, VERIFIED_ROLE_ID } = process.env;

const TIERS = [
    ROLE_ID_R1,
    ROLE_ID_R2,
    ROLE_ID_R3,
    ROLE_ID_R4,
    ROLE_ID_R5,
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tier-assign")
        .setDescription("Assign a tier to a user")
        .addUserOption(opt =>
            opt.setName("user")
                .setDescription("Select the user")
                .setRequired(true)
        )
        .addRoleOption(opt =>
            opt.setName("tier")
                .setDescription("Select the tier to assign")
                .setRequired(true)
        ),

    async execute(interaction) {
        const member = interaction.options.getMember("user");
        const newTier = interaction.options.getRole("tier");

        if (!TIERS.includes(newTier.id)) {
            return interaction.reply("That role is not a valid tier.");
        }

        for (const tierId of TIERS) {
            if (member.roles.cache.has(tierId)) {
                await member.roles.remove(tierId);
            } else {
                await member.roles.add(VERIFIED_ROLE_ID);
            }
        }

        await member.roles.add(newTier);

        return interaction.reply(
            `Assigned <@&${newTier.id}> to <@${member.id}>`
        );
    }
};
