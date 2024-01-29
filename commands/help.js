const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const config = require('../config.json');
const stock = require('./stock');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('yardim')
		.setDescription('Komut listesini görüntüleyin. / Maded by @sanalmuz'),

	async execute(interaction) {
		const { commands } = interaction.client;

		const commandListEmbed = new MessageEmbed()
			.setColor(config.color.default)
			.setTitle('Yardım Paneli')
			.setDescription(`👋 Merhaba ve **${interaction.guild.name}**'e hoş geldiniz! 🌟Size en iyi hizmeti sunmak için buradayız. 🚀`)
			.setImage(config.banner)
			.setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true, size: 64 })) // Set the bot's avatar as the thumbnail
			.addFields({
				name: `Komutlar`,
				value: "`/yardim` **Yardım komutunu görüntüler**\n`/olustur` **Yeni bir hizmet oluşturun**\n`/bedava` **Ödül oluşturun**\n`/ekle` **Ödül ekleyin hisse senedine git**\n`/stok` **Mevcut hisse senedini görüntüle**\n`/ozel` **Özel ödülü oluştur**"
			})
			.setFooter(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true, size: 64 }))
			.setTimestamp()
			.addField('Faydalı Bağlantılar', `[**Web Sitesi**](${config.website}) [**Discord**](https://discord.gg/gqDnqmCGrx)`);

		await interaction.reply({ embeds: [commandListEmbed] });
	},
};
