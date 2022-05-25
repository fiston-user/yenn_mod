const Discord = require("discord.js");
const config = require("../../config.json");
const Levels = require("discord-xp");
Levels.setURL(config.database_url);

module.exports = {
  name: "rank",
  category: "levels",
  permissions: ["SEND_MESSAGES"],
  description: "Get the rank of a user",

  run: async (client, message, args) => {
    const target = message.mentions.members.first() || message.author;

    const user = await Levels.fetch(target.id, message.guild.id, true);

    const neededXP = Levels.xpFor(parseInt(user.level) + 1);

    if (!user) return message.channel.send("That user has no xp!");

    const canvacord = require("canvacord");

    const rank = new canvacord.Rank()
      .setAvatar(
        message.author.displayAvatarURL({ dynamic: true, format: "png" })
      )
      .setCurrentXP(user.xp)
      .setRequiredXP(neededXP)
      .setStatus(message.author.presence.status, true, true)
      .setRank(user.position)
      .setLevel(user.level)
      .setProgressBar("#FFFFFF", "COLOR")
      .setUsername(message.author.username)
      .setDiscriminator(message.author.discriminator);

    rank.build().then((data) => {
      const attachement = new Discord.MessageAttachment(data, "rank.png");
      message.channel.send(attachement);
    });
  },
};
