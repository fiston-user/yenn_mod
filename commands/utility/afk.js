const Discord = require("discord.js");
const { Database } = require("quickmongo");
const config = require("../../config.json");
const quickmongo = new Database(config.database_url);

module.exports = {
  name: "afk",
  category: "utility",
  description: "Set your AFK status",

  run: async (client, message, args) => {
    let reason = args.join(" ");
    const AFKPrefix = "[AFK]";

    if (!reason) reason = "No reason specified";

    // set AFK to the database
    try {
      await quickmongo.set(
        `afk-${message.author.id}+${message.guild.id}`,
        reason
      );
      message.channel.send("You have set your AFK status to: " + reason);
    } catch (err) {
      console.log(err);
      message.channel.send("could not set your AFK status");
    }

    // set Nickname to the database
    try {
      await message.member.setNickname(
        AFKPrefix + message.member.user.username
      );
    } catch (err) {
      console.log(err);
      message.channel.send("could not set your nickname");
    }
  },
};
