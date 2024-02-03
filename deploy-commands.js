const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token, globalDeploy } = require("./config.json");

const commands = [];
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

console.log("Komutlar Yükleniyor...");

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());

  // Print a fancy message for each loaded command
  console.log(`✅ Komut Yüklendi: ${command.data.name}`);
}

const rest = new REST({ version: "9" }).setToken(process.env.token || token);

(async () => {
  try {
    if (globalDeploy) {
      // Deploy commands globally
      await rest.put(Routes.applicationCommands(process.env.clientId), {
        body: commands,
      });
      console.log("\n✅ Komutlar yüklendi tekrardan.");
    } else {
      // Deploy commands to a specific guild
      await rest.put(Routes.applicationGuildCommands(process.env.clientId, process.env.guildId), {
  body: commands,
});

      console.log("\n✅ Başaralı Komutlar Sorunsuz Yüklendi ve Bot Aktif.");
    }
  } catch (error) {
    console.error(error);
  }
})();
