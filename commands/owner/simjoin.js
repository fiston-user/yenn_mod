const Discord = require("discord.js");

module.exports = {
  name: "simjoin",
  aliases: ["join"],
  category: "owner",
  description: "Simulates a user joining the server",

  run: async (client, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send(
        "You do not have permission to use this command."
      );

      client.on("guildMemberAdd", member => {
        message.channel.send("simulated join event");
      })
      client.emit("guildMemberAdd", message.member);
  },
};
