const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "remind",
  category: "utility",
  permissions: ["MANAGE_EMOJIS"],
  usage: "<time> <reminder>",
  description: "",

  run: async (client, message, args) => {
    let reminder = args.slice(1).join(" ");
    let time = args[0];

    const noDurationEmbed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle("No duration specified")
      .setDescription(`Please specify a duration for the reminder.`)
      .setFooter(client.user.username, client.user.avatarURL())
      .setTimestamp();

    if (!time) return message.channel.send(noDurationEmbed);

    const noReminderEmbed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle("No remainder specified")
      .setDescription("Please provide a reminder")
      .setFooter(client.user.username, client.user.avatarURL())
      .setTimestamp();

    if (!reminder) return message.channel.send(noReminderEmbed);

    const reminderSetEmbed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setAuthor("Reminder set!", message.author.avatarURL())
      .setDescription(`Succesfully set ${message.author.tag}'s reminder!`)
      .addField("Reminding in", `${time}`, true)
      .addField("Reminder", `${reminder}`, true)
      .setFooter(client.user.username, client.user.avatarURL())
      .setTimestamp();

    message.channel.send(reminderSetEmbed);

    setTimeout(async function () {
      message.channel.send(`<@${message.author.id}>, here is your reminder`);

      const reminderAlertEmbed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor("Reminder set!", message.author.avatarURL())
        .addField("Reminder", `${reminder}`, true)
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp();

      message.channel.send(reminderAlertEmbed);
    }, ms(time));
  },
};
