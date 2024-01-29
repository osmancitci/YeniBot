const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs/promises');
const config = require('../config.json');
const CatLoggr = require('cat-loggr');

const log = new CatLoggr();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('olustur')
		.setDescription('Yeni bir hizmet oluşturun.')
		.addStringOption(option =>
			option.setName('service')
				.setDescription('Oluşturulacak hizmetin adı')
				.setRequired(true)
		)
		.addStringOption(option =>
			option.setName('type')
				.setDescription('Hizmet türü (ücretsiz veya premium)')
				.setRequired(true)
				.addChoices(
					{ name: 'Free', value: 'free' },
					{ name: 'Premium', value: 'premium' },
				)),

	async execute(interaction) {
		const service = interaction.options.getString('service');
		const type = interaction.options.getString('type');

		if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
			const errorEmbed = new MessageEmbed()
				.setColor(config.color.red)
				.setTitle('İzniniz Yok!')
				.setDescription('🛑 Sadece Yönetici Yapabilir HEHE')
				.setFooter(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true, size: 64 }))
				.setTimestamp();
			return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
		}

		if (!service) {
			const missingParamsEmbed = new MessageEmbed()
				.setColor(config.color.red)
				.setTitle('Parametreler eksik!')
				.setDescription('Bir hizmet adı belirtmeniz gerekiyor!')
				.setFooter(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true, size: 64 }))
				.setTimestamp();
			return interaction.reply({ embeds: [missingParamsEmbed], ephemeral: true });
		}

		let filePath;
		if (type === 'free') {
			filePath = `${__dirname}/../free/${service}.txt`;
		} else if (type === 'premium') {
			filePath = `${__dirname}/../premium/${service}.txt`;
		} else {
			const invalidTypeEmbed = new MessageEmbed()
				.setColor(config.color.red)
				.setTitle('Geçersiz hizmet türü!')
				.setDescription('Hizmet türü "ücretsiz" veya "premium" olmalıdır.')
				.setFooter(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true, size: 64 }))
				.setTimestamp();
			return interaction.reply({ embeds: [invalidTypeEmbed], ephemeral: true });
		}

		try {
			await fs.writeFile(filePath, '');
			const successEmbed = new MessageEmbed()
				.setColor(config.color.green)
				.setTitle('Hizmet oluşturuldu!')
				.setDescription(`Yeni hizmet **${type}** \`${service}\` hizmeti oluşturuldu!`)
				.setFooter(interaction.user.tag, interaction.user.displayAvatarURL())
				.setTimestamp();

			interaction.reply({ embeds: [successEmbed], ephemeral: true });
		} catch (error) {
			log.error(error);
			return interaction.reply('Hizmet oluşturulurken bir hata oluştu.');
		}
	},
};