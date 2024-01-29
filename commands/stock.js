const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs').promises;
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stok')
		.setDescription('Hizmet stokunu görüntüleyin. Maded by @sanalmuz'),

	async execute(interaction) {
		const freeStock = await getStock(`${__dirname}/../bedava/`);
		const premiumStock = await getStock(`${__dirname}/../ozel/`);

		const embed = new MessageEmbed()
			.setColor(config.color.default)
			.setTitle(`${interaction.guild.name} Hizmet Stoku`)
			.setDescription(`👋 Merhaba ve **${interaction.guild.name}**'e hoş geldiniz! 🌟Size en iyi hizmeti sunmak için buradayız. 🚀`)
			.setFooter(config.footer)
			.setImage(config.banner);

		if (freeStock.length > 0) {
			const freeStockInfo = await getServiceInfo(`${__dirname}/../free/`, freeStock);
			embed.addField('Bedava Servisler;', freeStockInfo, true);
		}

		if (premiumStock.length > 0) {
			const premiumStockInfo = await getServiceInfo(`${__dirname}/../premium/`, premiumStock);
			embed.addField('Özel Servisler;', premiumStockInfo, true);
		}

		embed.addField('Faydalı Bağlantılar', `[**Web Sitesi**](${config.website}) [**Discord**](https://discord.gg/gqDnqmCGrx)`);

		interaction.reply({ embeds: [embed] });
	},
};

async function getStock(directory) {
	try {
		const files = await fs.readdir(directory);

		const stock = files.filter(file => file.endsWith('.txt'));
		return stock;
	} catch (err) {
		console.error('Dizin taranamıyor: ' + err);
		return [];
	}
}

async function getServiceInfo(directory, stock) {
	const info = [];
	for (const service of stock) {
		const serviceContent = await fs.readFile(`${directory}/${service}`, 'utf-8');
		const lines = serviceContent.split(/\r?\n/);
		info.push(`**${service.replace('.txt', '')}:** \`${lines.length}\``);
	}
	return info.join('\n');
}
