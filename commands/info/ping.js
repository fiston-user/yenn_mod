const Discord = require("discord.js");

module.exports = {
  name: "ping",
  aliases: ["pong", "latency", "p"],
  category: "info",
  description: "Get the bot's ping",

  run: async (client, message, args) => {
    const msg = await message.channel.send("🏓 Pinging...");
    const pingEmbed = new Discord.MessageEmbed()
      .setColor("")
      .setTitle("Pong!")
      .setDescription(`${client.ws.ping}ms`)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`);

    await message.channel.send(pingEmbed);
    msg.delete();
  },
};
