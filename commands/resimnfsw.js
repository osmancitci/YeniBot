const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs').promises;
const config = require('../config.json');
const superagent = require("superagent");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('resim')
        .setDescription('Nfsw Resim Üretin.')
        .addStringOption(option =>
            option.setName('kategori')
                .setDescription('Çeşitler')
                .setRequired(true)
                .addChoices(
                    { name: '4k', value: '4k' },
                    { name: 'meme', value: 'meme' },
                    { name: 'got', value: 'got' },
                    { name: 'pgif', value: 'pgif' },
                    { name: 'ancuk', value: 'ancuk' }
                )
        ),
    async execute(interaction) {
      
      
    if (interaction.channelId !== config.nfswChannel) {
      const wrongChannelEmbed = new MessageEmbed()
        .setColor(config.color.red)
        .setTitle("Yanlış komut kullanımı!")
        .setDescription(
          `Bu kanalda \`/ozel\` komutunu kullanamazsınız! <#${config.nfswChannel}>'da deneyin!`
        )
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 64 }) })
        .setTimestamp();

      return interaction.reply({
        embeds: [wrongChannelEmbed],
        ephemeral: true,
      });
    }
      
        try {
            let imageUrl;
            const subcommand = interaction.options.getString('kategori');

            if (subcommand === '4k') {
                const response = await superagent.get("https://nekobot.xyz/api/image?type=4k");
                imageUrl = response.body.message;
            } else if (subcommand === 'meme') {
                const response = await superagent.get("https://nekobot.xyz/api/image?type=boobs");
                imageUrl = response.body.message;
            } else if (subcommand === 'got') {
                const response = await superagent.get("https://nekobot.xyz/api/image?type=ass");
                imageUrl = response.body.message;
            } else if (subcommand === 'pgif') {
                const response = await superagent.get("https://nekobot.xyz/api/image?type=pgif");
                imageUrl = response.body.message;
            } else if (subcommand === 'ancuk') {
                const response = await superagent.get("https://nekobot.xyz/api/image?type=pussy");
                imageUrl = response.body.message;
            }
            
            interaction.reply(imageUrl);
        } catch (error) {
            console.error('Resim alınamadı:', error);
            interaction.reply('Resim alınamadı.');
        }
    },
};