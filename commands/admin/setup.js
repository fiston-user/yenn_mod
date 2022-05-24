const Discord = require("discord.js");
const { Database } = require("quickmongo");
const config = require("../../config.json");
const prefix = config.prefix;
const quickmongo = new Database(config.database_url);

module.exports = {
  name: "setup",
  permissions: ["ADMINISTRATOR"],
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
    const getleaveChannel = await quickmongo.get(`leave-${message.guild.id}`);
    const leaveChannelCheck = await quickmongo.fetch(
      `leave-${message.guild.id}`
    );
    let leaveChannelStatus;

    if (leaveChannelCheck) {
      leaveChannelStatus = `<#${getleaveChannel}>`;
    } else leaveChannelStatus = "`Not set`";

    /* Quickmongo for member Roles */
    const getmemberRole = await quickmongo.get(
      `memberrole-${message.guild.id}`
    );
    const memberRoleCheck = await quickmongo.fetch(
      `memberrole-${message.guild.id}`
    );
    let memberRoleStatus;

    if (memberRoleCheck) {
      memberRoleStatus = `<@&${getmemberRole}>`;
    } else memberRoleStatus = "`Not set`";

    /* Quickmongo for autorole */
    const autoRoleCheck = await quickmongo.fetch(
      `autorole-${message.guild.id}`
    );
    let autoRoleStatus;

    if (autoRoleCheck) {
      autoRoleStatus = "🟢 (ENABLED)";
    } else autoRoleStatus = "🔴 (DISABLED)";

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

    if (choice === "memberRole") {
      const memberRole =
        message.mentions.roles.first() ||
        message.guild.roles.cache.get(args[0]);

      if (!memberRole) return message.channel.send("Invalid role.");

      await quickmongo.set(`memberrole-${message.guild.id}`, memberRole.id);
      message.channel.send(`Member role set to ${memberRole}`);
    }

    if (choice === "autorole") {
      const query = args[1];

      if (!query)
        return message.channel.send("Please choose from enable or disable.");

      if (!memberRoleCheck)
        return message.channel.send("Please set a **member role** first.");

      if (query === "enable") {
        if ((await quickmongo.fetch(`autorole-${message.guild.id}`)) === null) {
          await quickmongo.set(`autorole-${message.guild.id}`, true);
          return message.channel.send("Autorole enabled.");
        } else if (
          (await quickmongo.fetch(`autorole-${message.guild.id}`)) === false
        ) {
          await quickmongo.set(`autorole-${message.guild.id}`, true);
          return message.channel.send("Autorole enabled.");
        } else return message.channel.send("Autorole already enabled.");
      }
      if (query === "disable") {
        if ((await quickmongo.fetch(`autorole-${message.guild.id}`)) === true) {
          await quickmongo.delete(`autorole-${message.guild.id}`);
          return message.channel.send("Autorole disabled.");
        } else return message.channel.send("Autorole already disabled.");
      }
    }

    if (choice === "configure") {
      const configureEmbed = new Discord.MessageEmbed()
        .setColor("#ff0000")
        .setTitle(`⚙️ ${message.guild.name}'s configuration`)
        .addField("Usage", `${prefix}setup configure <choice> [value]`)
        .addField("\u200b", "__General__")
        .addField("🖐️ Welcome Channel", `${welcomeChannelStatus}`)
        .addField("😔 Member Left Channel", `${leaveChannelStatus}`)
        .addField("🪄 Autorole", `\`${autoRoleStatus}\``)
        .addField("\u200b", "__Moderation__")
        .addField("🕹️ Logs Channel", "`COMING SOON`")
        .addField("👤 Member Role", `${memberRoleStatus}`)
        .addField("⚠️ Mute Role", "`COMING SOON`")
        .addField("\u200b", "__Features__")
        .addField("🛠️ Anti-Curse", `\`${anticurseStatus}\``);

      return message.channel.send(configureEmbed);
    }
  },
};
