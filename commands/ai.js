const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs').promises;
const config = require('../config.json');
const superagent = require("superagent");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('uret')
        .setDescription('Yapayzeka İle Resim Üret.')
        .addStringOption(option =>
            option.setName('kelime')
                .setDescription('Kelime Yazınız')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const keyword = interaction.options.getString('kelime');
            const imageUrl = await getRandomImage(keyword);
            
            if (imageUrl) {
                const embed = new MessageEmbed()

                interaction.reply(imageUrl);
            } else {
                interaction.reply('Resim üretilemedi.');
            }
        } catch (error) {
            console.error('Hata:', error);
            interaction.reply('Bir hata oluştu.');
        }
    },
};



async function getRandomImage(keyword) {
    try {
        const response = await superagent.get(`https://api.unsplash.com/photos/random?query=${keyword}&client_id=gUj4ZqojN2a_UfyekjqhzxcggmsonXYH9K2A15m_JuE`);
        const data = response.body;
        return data.urls.full; // Resmin tam boyutlu URL'sini döndürüyoruz
    } catch (error) {
        console.error('Resim alınamadı:', error);
        return null;
    }
}