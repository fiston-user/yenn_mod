const Discord = require("discord.js");

module.exports = {
  name: "addrole",
  aliases: ["giverole"],
  category: "moderation",
  description: "Add a role to a user",

  run: async (client, message, args) => {
    // Varibales
    let user =
      message.guild.members.cache.get(args[0]) ||
      message.mentions.members.first();

    //Perms
    if (!message.member.hasPermission("MANAGE_ROLES"))
      return message.reply("You don't have permission to use this command!");

    if (!user) return message.channel.send("Please mention a user!");

    let findRole = args.slice(1).join(" ");
    const role = message.guild.roles.cache.find((r) =>
      r.name.includes(findRole)
    );

    if (!role) return message.channel.send("Please specify a role!");

    user.roles.add(role.id);
    message.channel.send(`${user} has been given the role ${role}`);
  },
};
