const Discord = require("discord.js");

module.exports = {
  name: "simleave",
  aliases: ["leave"],
  category: "owner",
  description: "Simulates a user leaving the server",

  run: async (client, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send(
        "You do not have permission to use this command."
      );

    client.on("guildMemberRemove", (member) => {
      message.channel.send("simulated join leave event");
    });
    client.emit("guildMemberRemove", message.member);
  },
};
