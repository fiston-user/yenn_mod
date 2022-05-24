const client = require("../index.js");
const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;

client.on("guildCreate", (guild) => {
  let channelToSendTo;

  guild.channels.cache.forEach((channel) => {
    if (
      channel.type === "text" &&
      !channelToSendTo &&
      channel.permissionsFor(guild.me).has("SEND_MESSAGES")
    ) {
      channelToSendTo = channel;
    }
  });
  if (!channelToSendTo);

  const newGuildEmbed = new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
    .setTitle(`Thank you for inviting ${client.user.username} to your server!`)
    .setDescription(`You can use \`${prefix}help\ to see all the commands!`)
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
    .setFooter(
      `${client.user.username} | ${client.user.id}`,
      client.user.displayAvatarURL({ dynamic: true })
    )
    .setTimestamp();

  channelToSendTo.send(newGuildEmbed);
});
