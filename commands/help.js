const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const config = require('../config.json');
const stock = require('./stock');
const fs = require('fs').promises;
const path = require('path');

async function listCommandDetails() {
    try {
        const files = await fs.readdir(__dirname);

        // Komut dosyalarını filtreleyerek sadece .js dosyalarını alıyoruz
        const commandFiles = files.filter(file => file.endsWith('.js'));
        const commands = [];

        // Her bir komut dosyasını inceleyerek setName ve setDescription özelliklerini alıyoruz
        for (const file of commandFiles) {
            const command = require(`${__dirname}/${file}`);
            if (command.data && command.data.name && command.data.description) {
                commands.push(`> \`/${command.data.name}\` **${command.data.description}**`);
            }
        }
        return commands;
    } catch (err) {
        console.error('Dizin taranamıyor: ' + err);
        return [];
    }
}



module.exports = {
    data: new SlashCommandBuilder()
        .setName('yardım')
        .setDescription('Komut Listesini Görüntüleyin.'),

    async execute(interaction) {
        const commandDetails = await listCommandDetails();

        const commandListEmbed = new MessageEmbed()
        
            .setColor(config.color.default)
            .setTitle('Yardım Paneli')
            .setDescription(`👋 Merhaba ve **${interaction.guild.name}**'e hoş geldiniz! 🌟Size en iyi hizmeti sunmak için buradayız. 🚀`)
            .setImage(config.banner)
            .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true, size: 64 }))
            .addFields({ name: 'Komutlar', value: commandDetails.join('\n')}) // Joining the array elements into a single string with newlines
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 64 }) })
            .setTimestamp()
            .addFields({ name: 'Faydalı Bağlantılar', value: `[**Web Sitesi**](${config.website}) [**Discord**](${config.discord})` });

        await interaction.reply({ embeds: [commandListEmbed] });
    },
};
