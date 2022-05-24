const client = require("../index");
const Discord = require("discord.js");
// Create Pings Collection
const Pings = new Discord.Collection();

client.on("message", async (message) => {
  const mentionedMember = message.mentions.members.first();

  if (!mentionedMember) return;
  if (!mentionedMember.id === message.author.id) return;

  const timeout = 60000; // 1 minute
  Pings.set(`Pinged - ${mentionedMember.id}`, Date.now() + timeout);

  setTimeout(() => {
    Pings.delete(`Pinged - ${mentionedMember.id}`);
  }, timeout);
});

client.on("messageDelete", async (message) => {
  const mentionedMember = message.mentions.members.first();

  if (!mentionedMember) return;
  if (!mentionedMember.id === message.author.id) return;

  const ghostPingLogsChannel = message.guild.channels.cache.find((ch) =>
    ch.name.includes("ghostpings")
  );

  if (Pings.has(`Pinged - ${mentionedMember.id}`)) {
    const ghostPingEmbed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("⚠️ Ghost Ping Detected!")
      .addField("User", message.author)
      .addField("Message", `${message.content}`)
      .setTimestamp()
      .setFooter(client.user.username, client.user.avatarURL());

    ghostPingLogsChannel.send(ghostPingEmbed);
  }
});
