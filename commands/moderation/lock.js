const Discord = require("discord.js");
const { Database } = require("quickmongo");
const config = require("../../config.json");
const prefix = config.prefix;
const quickmongo = new Database(config.database_url);

module.exports = {
  name: "lock",
  category: "moderation",
  description: "Lock a channel",

  run: async (client, message, args) => {
    const memberRoleCheck = await quickmongo.fetch(
      `memberrole-${message.guild.id}`
    );
    const getmemberRole = await quickmongo.get(
      `memberrole-${message.guild.id}`
    );
    let memberRole;

    if (memberRoleCheck) {
      memberRole = message.guild.roles.cache.get(getmemberRole);
    } else return message.channel.send("Please set a member role first!");

    if (!args[0])
      return message.channel.send("Please specify a channel to lock!");
    if (!message.mentions.channels.first())
      return message.channel.send("Please mention a valid channel to lock!");

    await message.mentions.channels.forEach(async (channel) => {
      if (channel.name.startsWith("🔒"))
        return message.channel.send("That channel is already locked!");

      await channel.setName(`🔒 ${channel.name}`);

      try {
        channel.createOverwrite(memberRole, {
          VIEW_CHANNEL: true,
          READ_MESSAGE_HISTORY: true,
          SEND_MESSAGES: false,
        });

        const lockedEmbed = new Discord.MessageEmbed()
          .setColor("#0099ff")
          .setTitle("Channel Locked")
          .setDescription(`${channel} has been locked!`)
          .setTimestamp();

        message.channel.send(lockedEmbed);
      } catch (err) {
        console.log(err);
        const errorEmbed = new Discord.MessageEmbed()
          .setColor("#ff0000")
          .setTitle("Error")
          .setDescription(`An error occured while trying to lock ${channel}.`);

        message.channel.send(errorEmbed);
      }
    });
  },
};
