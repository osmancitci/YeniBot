const Discord = require("discord.js");
const { Client, Intents, Permissions, Collection } = require("discord.js");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("./config.json");
const config = require('./config.json');
const fs = require("fs");
const generated = new Set();
const server = require('./server.js');
const commands = require('./deploy-commands.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  console.log(`Bota Giriş Yaptım: ${client.user.tag}!`);
  client.user.setStatus('online');
  client.user.setActivity(config.status, {type: config.setActivity, url: config.twitch}); 
  
  
  
  
  
  
  
});








// Sunucuya katılma olayını işleyen fonksiyon
client.on('guildCreate', async guild => {
    let roleName = "Kalkan"; // Atanacak rolün adı
    let roleColor = "#FF0000"; // Kırmızı rengi
    let role = await guild.roles.create({
        name: roleName,
        color: roleColor
    }).catch(console.error);

    if (role) {
        console.log(`"${roleName}" ismindeki rol oluşturuldu ve rengi kırmızıya ayarlandı.`);
        guild.me.roles.add(role); // Bot'a rolü ekleme
    } else {
        console.log(`Sunucuda "${roleName}" isminde bir rol oluşturulamadı.`);
    }
});


client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
  }
});

client.login(process.env.token || token);
