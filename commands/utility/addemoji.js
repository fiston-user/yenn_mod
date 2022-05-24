const Discord = require("discord.js");

module.exports = {
  name: "addemoji",
  category: "utility",
  permissions: ["MANAGE_EMOJIS"],
  usage: "addemoji <emoji-name> <emoji-url>",
  description: "Add an emoji to the server",

  run: async (client, message, args) => {
    if (!args.length)
      return message.channel.send("Please specify an emoji name or url");

    for (const emojis of args) {
      const getEmoji = Discord.Util.parseEmoji(emojis);

      if (getEmoji.id) {
        const emojiExt = getEmoji.animated ? ".gif" : ".png";
        const emojiURL = `https://cdn.discordapp.com/emojis/${
          getEmoji.id + emojiExt
        }`;
        message.guild.emojis
          .create(emojiURL, getEmoji.name)
          .then((emoji) => {
            message.channel.send(`Emoji added: ${emoji} (\`${emoji.name}\`) to the server`);
          })
          .catch((err) => {
            console.log(err);
            message.channel.send("An error occured while adding the emoji");
          });
      }
    }
  },
};
