const { SlashCommandBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("translate")
        .setDescription("Translate text to another language")
        .addStringOption(opt =>
            opt.setName("text")
                .setDescription("Text to translate")
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName("from")
                .setDescription("starting lanuage (en, it, es, fr...)")
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName("to")
                .setDescription("Target language (en, it, es, fr...)")
                .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.user();
        const text = interaction.options.getString("text");
        const source = interaction.options.getString("from").toUpperCase();
        const target = interaction.options.getString("to").toUpperCase();

        await interaction.deferReply();

        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!data.responseData || !data.responseData.translatedText) {
            return interaction.editReply("Translation failed.");
        }

        return interaction.editReply(`${user} Translated **${source} | ${target}**:\n${data.responseData.translatedText}`);
    }
};
