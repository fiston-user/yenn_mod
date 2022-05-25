const Discord = require("discord.js");
const config = require("../../config.json");
const Levels = require("discord-xp");
Levels.setURL(config.database_url);

module.exports = {
  name: "leaderboard",
  aliases: ["lb"],
  category: "levels",
  permissions: ["SEND_MESSAGES"],
  description: "Get the rank of a user",

  run: async (client, message, args) => {
    
    try {
      const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id);
    if (rawLeaderboard.length < 1)
      return message.channel.send("No users found!");

    const leaderboard = await Levels.computeLeaderboard(
      client,
      rawLeaderboard,
      true
    );

    const lb = leaderboard.map(
      (e) =>
        `${e.position} | ${e.username}#${e.discriminator} | Level: ${
          e.level
        } | XP: ${e.xp.toLocaleString()}`
    );

    const LeaderboardEmbed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setAuthor("📈 | Leaderboard")
      .setDescription(`${lb.join("\n\n")}`)
      .setTimestamp()
      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL()
      );

      message.channel.send(LeaderboardEmbed);
    } catch (err) {
      message.channel.send(`Oh no, an error occurred: \`${err.message}\`.`);
    }
  },
};
