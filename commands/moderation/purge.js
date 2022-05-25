const Discord = require("discord.js");

module.exports = {
  name: "purge",
  aliases: ["clear", "delete"],
  category: "moderation",
  description: "Clear messages in the server!!",

  run: async (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.channel.send(
        "You don't have permission to use this command!"
      );

    const deleteCount = parseInt(args[0], 10);

    if (!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.channel.send(
        "Please provide a number between 2 and 100 for the number of messages to delete"
      );
    const fetched = await message.channel.messages.fetch({
      limit: deleteCount,
    });

    message.channel
      .bulkDelete(fetched)
      .catch((error) =>
        message.channel.send(`Couldn't delete messages because of: ${error}`)
      );
    message.channel
      .send(`${deleteCount} messages have been deleted`)
      .then((msg) => msg.delete({ timeout: 5000 }));
  },
};
