const Discord = require("discord.js");

module.exports = {
  name: "clean",
  category: "moderation",
  description: "Clear messages in the server!!",

  run: async (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.channel.send(
        "You don't have permission to use this command!"
      );

   message.channel.send("Are you sure you want to delete those messages? (y/n)");
   const filter = m => m.author.id === message.author.id;
   const collector = message.channel.createMessageCollector(filter, { time: 60000 });
   collector.on('collect', async  m => {
     if (m.content === 'y') {
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
     } else {
       collector.stop();
     }
   }   
    );
  },
};
