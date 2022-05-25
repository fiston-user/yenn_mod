const Discord = require("discord.js");

module.exports = {
  name: "removerole",
  aliases: ["rrole"],
  category: "moderation",
  description: "remove a role to a user",

  run: async (client, message, args) => {
    // Varibales
    let user =
      message.guild.members.cache.get(args[0]) ||
      message.mentions.members.first();

    //Perms
    if (!message.member.hasPermission("MANAGE_ROLES"))
      return message.reply("You don't have permission to use this command!");

    if (!user) return message.channel.send("Please mention a user!");

    let findRole = args[1];
    const role = message.guild.roles.cache.find((r) =>
      r.name.includes(findRole)
    );

    if (!role) return message.channel.send("Please specify a role!");

    user.roles.remove(role.id);
    message.channel.send(`${role} has been removed from ${user}`);
  },
};
