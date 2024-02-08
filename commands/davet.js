const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs').promises;
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('davet')
		.setDescription('Davet Linki Oluştur'),

	async execute(interaction) {

		const embed = new MessageEmbed()
			.setColor(config.color.default)
			.setTitle(`${interaction.guild.name} Hizmet Stoku`)
			.setDescription(`👋 Merhaba [Beni sunucuna ekleyerek hem bizi büyütür, hemde sunucunu bedavadan koruyabilirsin! Ek özellikler için destek sunucumuzda bulunan paketleri alabilirsin!](https://discordapp.com/oauth2/authorize) ([Destek Sunucumuz](https://discord.gg/))`)
			.setFooter(config.footer)
			.setImage(config.banner);


		  embed.addFields({ name: 'Faydalı Bağlantılar', value: `[**Web Sitesi**](${config.website}) [**Discord**](${config.discord})` });

		interaction.reply({ embeds: [embed] });
	},
};
