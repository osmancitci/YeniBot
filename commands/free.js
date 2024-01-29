const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');
const CatLoggr = require('cat-loggr');

const log = new CatLoggr();
const generated = new Set();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bedava')
        .setDescription('Stok varsa belirli bir hizmet oluşturun')
        .addStringOption(option =>
            option.setName('service')
                .setDescription('Oluşturulacak hizmetin adı')
                .setRequired(true)),

    async execute(interaction) {
        const service = interaction.options.getString('service');
        const member = interaction.member;

        // Check if the channel where the command was used is the generator channel
        if (interaction.channelId !== config.genChannel) {
            const wrongChannelEmbed = new MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Yanlış komut kullanımı!')
                .setDescription(`Bu kanalda \`/bedava\` komutunu kullanamazsınız! <#${config.genChannel}>'da deneyin!`)
                .setFooter(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp();

            return interaction.reply({ embeds: [wrongChannelEmbed], ephemeral: true });
        }

        // Check if the user has cooldown on the command
        if (generated.has(member.id)) {
            const cooldownEmbed = new MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Sakin ol!')
                .setDescription(`Bu komutu tekrar çalıştırmadan önce lütfen **${config.genCooldown}** saniye bekleyin!`)
                .setFooter(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp();

            return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
        }

        // File path to find the given service
        const filePath = `${__dirname}/../free/${service}.txt`;

        // Read the service file
        fs.readFile(filePath, 'utf-8', (error, data) => {
            if (error) {
                const notFoundEmbed = new MessageEmbed()
                    .setColor(config.color.red)
                    .setTitle('Jeneratör hatası!')
                    .setDescription(`\`${service}\` hizmeti mevcut değil!`)
                    .setFooter(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true, size: 64 }))
                    .setTimestamp();

                return interaction.reply({ embeds: [notFoundEmbed], ephemeral: true });
            }

            const lines = data.split(/\r?\n/);

            if (lines.length <= 1) {
                const emptyServiceEmbed = new MessageEmbed()
                    .setColor(config.color.red)
                    .setTitle('Jeneratör hatası!')
                    .setDescription(`\`${service}\` hizmeti boş!`)
                    .setFooter(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true, size: 64 }))
                    .setTimestamp();

                return interaction.reply({ embeds: [emptyServiceEmbed], ephemeral: true });
            }

            const generatedAccount = lines[0];

            // Remove the redeemed account line
            lines.shift();
            const updatedData = lines.join('\n');

            // Write the updated data back to the file
            fs.writeFile(filePath, updatedData, (writeError) => {
                if (writeError) {
                    log.error(writeError);
                    return interaction.reply('Hesabı kullanırken bir hata oluştu.');
                }

                const embedMessage = new MessageEmbed()
                    .setColor(config.color.green)
                    .setTitle('Ücretsiz hesap oluşturuldu')
                    .addField('Servis', `\`\`\`${service[0].toUpperCase()}${service.slice(1).toLowerCase()}\`\`\``, true)
                    .addField('Hesap', `\`\`\`${generatedAccount}\`\`\``, true)
                    .setImage(config.banner)
                    .setTimestamp();

                member.send({ embeds: [embedMessage] })
                    .catch(error => console.error(`Yerleştirme mesajı gönderilirken hata oluştu: ${error}`));
                interaction.reply({
                    content: `**DM ${member} numaranızı kontrol edin!** __Mesajı almazsanız, lütfen özel hesabınızın kilidini açın!__`,
                });

                generated.add(member.id);
                setTimeout(() => {
                    generated.delete(member.id);
                }, config.genCooldown * 1000);
            });
        });
    },
};
