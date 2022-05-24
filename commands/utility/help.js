const Discord = require("discord.js");
const fs = require("fs");
const prefix = require("../../config.json").prefix;

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "Shows all the commands",
  run: async (client, message, args) => {
    if (!args[0]) {
      let categories = [];

      fs.readdirSync("./commands").forEach((dir) => {
        const commands = fs
          .readdirSync(`./commands/${dir}/`)
          .filter((file) => file.endsWith(".js"));

        const cmds = commands.map((command) => {
          let file = require(`../../commands/${dir}/${command}`);

          if (!file.name) return "No name";

          let name = file.name.replace(".js", "");

          return `\`${name}\``;
        });

        let data = new Object();

        data = {
          name: dir.toUpperCase(),
          value: cmds.length === 0 ? "In development" : cmds.join(", "),
        }

        categories.push(data);
      });

      const helpEmbed = new Discord.MessageEmbed()
        .setTitle("Help Menu")
        .addFields(categories)
        .setDescription(`Use \`${prefix}help <command>\` to get more info on a command.`)
        .setFooter(client.user.username, client.user.avatarURL())
        .setColor("RANDOM")
        .setTimestamp()

        return message.channel.send(helpEmbed);
    } else {
      const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(c => c.aliases && c.aliases.includes(args[0].toLowerCase()));

      if(!command){
        const noCommandEmbed = new Discord.MessageEmbed()
          .setTitle(`Command not found! `)
          .setDescription(`Use \`${prefix}help <command>\` to get more info on a command.`)
          .setColor("RANDOM")
          .setFooter(client.user.username, client.user.avatarURL())
          .setTimestamp()

          return message.channel.send(noCommandEmbed);
      }

      const helpMenuEmbed = new Discord.MessageEmbed()
      .setTitle("Command Info")
      .addField(`Prefix`, `\`${prefix}\``)
      .addField("Name", command.name ? `\`${command.name}\`` : "No name")
      .addField("Aliases", command.aliases ? command.aliases.join(", ") : "No aliases")
      .addField("Usage", command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : "No usage")
      .addField("Description", command.description ? command.description : "No description")
      .setFooter(client.user.username, client.user.displayAvatarURL())
      .setColor("RANDOM")

      return message.channel.send(helpMenuEmbed);
    }
  },
};
