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
        const last = interaction.options.getString("text")
            .toLowerCase()
            .trim()
            .replace(/\s+/g, " ");
        const text = interaction.options.getString("text");
        const source = interaction.options.getString("from").toUpperCase();
        const target = interaction.options.getString("to").toUpperCase();
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;

        await interaction.deferReply();

        const res = await fetch(url);
        const data = await res.json();

        if (last === "last message" || last === "last") {
        const messages = await interaction.channel.messages.fetch({ limit: 2 });
        const lastMessage = messages.last();
        const memberId = lastMessage.member?.displayName;

        if (!lastMessage) {
            return interaction.editReply("No previous message found.");
        }

        const url2 = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(lastMessage.content)}&langpair=${source}|${target}`;
        const res2 = await fetch(url2);
        const data2 = await res2.json();

        return interaction.editReply(
            `last ${memberId} message got translated **${source} | ${target}**:\n${data2.responseData.translatedText}`
        );

        } else if (!data.responseData || !data.responseData.translatedText) {

            return interaction.editReply("Translation failed.");

        } else {

            return interaction.editReply(
            `<@${interaction.user.id}> translated **${source} | ${target}**:\n${data.responseData.translatedText}`
        );
    }
}
};
