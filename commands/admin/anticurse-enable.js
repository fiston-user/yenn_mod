const Discord = require("discord.js");
const { Database } = require("quickmongo");
const config = require("../../config.json");
const quickmongo = new Database(config.database_url);

module.exports = {
  name: "anticurse-enable",
  aliases: ["curseè-enable", "antiswear"],
  permissions: ["ADMINISTRATOR"],
  category: "admin",
  description: "Enable the anti-curse system",

  run: async (client, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send(
        "You don't have the permission to use this command."
      );
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES"))
      return message.channel.send(
        "I don't have the permission to manage messages."
      );
    if ((await quickmongo.fetch(`swear-${message.guild.id}`)) === null) {
      await quickmongo.set(`swear-${message.guild.id}`, true);
      message.channel.send("The anti-curse system has been enabled.");
    } else if (
      (await quickmongo.fetch(`swear-${message.guild.id}`)) === false
    ) {
      await quickmongo.set(`swear-${message.guild.id}`, true);
      message.channel.send("The anti-curse system has been enabled.");
    } else
      return message.channel.send("The anti-curse system is already enabled.");
  },
};
