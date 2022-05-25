const Discord = require("discord.js");

module.exports = {
  name: "nuke",
  category: "moderation",
  description: "Nuke a channel",
  run: async (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.channel.send(
        "You don't have permission to use this command!"
      );

   const nukeChannel = message.mentions.channels.first() || message.channel;
   
   if (!nukeChannel.deletable) return message.channel.send("I can't delete that channel!");

   await nukeChannel.clone().catch(err => console.log(err.message));
   await nukeChannel.delete().catch(err => console.log(err.message));
  },
};
