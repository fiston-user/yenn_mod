const Discord = require("discord.js");
const { Database } = require("quickmongo");
const config = require("../../config.json");
const prefix = config.prefix;
const quickmongo = new Database(config.database_url);

module.exports = {
  name: "setup",
  aliases: ["set", "configure", "settings"],
  category: "admin",
  description: "Setup the bot for your server",

  run: async (client, message, args) => {
    let choice = args[0];

    const noChoiceEmbed = new Discord.MessageEmbed()
      .setColor("#ff0000")
      .setTitle("No choice specified")
      .setDescription("Please specify a choice to setup.")
      .addField("Usage", `${prefix}setup <choice-name> [value]`)
      .addField("\u200b", "__General__")
      .addField("🖐️ Welcome Channel", "Choice Name: **welcomeChannel**")
      .addField("😔 Member Left Channel", "Choice Name: **memberLeftChannel**")
      .addField("🪄 Autorole", "Choice Name: **autoRole**")
      .addField("\u200b", "__Moderation__")
      .addField("🕹️ Logs Channel", "Choice Name: **logsChannel**")
      .addField("👤 Member Role", "Choice Name: **memberRole**")
      .addField("⚠️ Mute Role", "Choice Name: **muteRole**")
      .addField("\u200b", "__Features__")
      .addField("🛠️ Anti-Curse", "Choice Name: **anticurse-enable/disable**");

    if (!choice) return message.channel.send(noChoiceEmbed);

    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send(
        "You do not have permission to use this command."
      );

    /* quickmongo for welcomeChannel */
    const getwelcomeChannel = await quickmongo.get(
      `welcome-${message.guild.id}`
    );
    const welcomeChannelCheck = await quickmongo.fetch(
      `welcome-${message.guild.id}`
    );
    let welcomeChannelStatus;

    if (welcomeChannelCheck) {
      welcomeChannelStatus = `<#${getwelcomeChannel}>`;
    } else welcomeChannelStatus = "`Not set`";

    
    /* quickmongo for leaveChannel */
    const getleaveChannel = await quickmongo.get(
      `leave-${message.guild.id}`
    );
    const leaveChannelCheck = await quickmongo.fetch(
      `leave-${message.guild.id}`
    );
    let leaveChannelStatus;

    if (leaveChannelCheck) {
      leaveChannelStatus = `<#${getleaveChannel}>`;
    } else leaveChannelStatus = "`Not set`";

    /* quickmongo for anticurse */
    const anticurseCheck = await quickmongo.fetch(`swear-${message.guild.id}`);
    let anticurseStatus;

    // check for anticurse status
    if (anticurseCheck === true) {
      anticurseStatus = "🟢 (ENABLED)";
    } else anticurseStatus = "🔴 (DISABLED)";

    if (choice === "welcome") {
      const welcomeChannel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[0]);
      if (!welcomeChannel) return message.channel.send("Invalid channel.");

      await quickmongo.set(`welcome-${message.guild.id}`, welcomeChannel.id);

      message.channel.send(`Welcome channel set to ${welcomeChannel}`);
    }

    if (choice === "leave") {
      const leaveChannel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[0]);
      if (!leaveChannel) return message.channel.send("Invalid channel.");

      await quickmongo.set(`leave-${message.guild.id}`, leaveChannel.id);

      message.channel.send(`Leave channel set to ${leaveChannel}`);
    }

    if (choice === "configure") {
      const configureEmbed = new Discord.MessageEmbed()
        .setColor("#ff0000")
        .setTitle(`⚙️ ${message.guild.name}'s configuration`)
        .addField("Usage", `${prefix}setup configure <choice> [value]`)
        .addField("\u200b", "__General__")
        .addField("🖐️ Welcome Channel", `${welcomeChannelStatus}`)
        .addField("😔 Member Left Channel",  `${leaveChannelStatus}`)
        .addField("🪄 Autorole", "`COMING SOON`")
        .addField("\u200b", "__Moderation__")
        .addField("🕹️ Logs Channel", "`COMING SOON`")
        .addField("👤 Member Role", "`COMING SOON`")
        .addField("⚠️ Mute Role", "`COMING SOON`")
        .addField("\u200b", "__Features__")
        .addField("🛠️ Anti-Curse", `\`${anticurseStatus}\``);

      return message.channel.send(configureEmbed);
    }
  },
};
