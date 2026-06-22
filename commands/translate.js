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
            opt.setName("to")
                .setDescription("Target language (en, it, es, fr...)")
                .setRequired(true)
        ),

    async execute(interaction) {
        const text = interaction.options.getString("text");
        const target = interaction.options.getString("to");

        await interaction.deferReply();

        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${target}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!data.responseData || !data.responseData.translatedText) {
            return interaction.editReply("Translation failed.");
        }

        return interaction.editReply(`**Translated:**\n${data.responseData.translatedText}`);
    }
};
