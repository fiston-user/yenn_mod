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

    /* checking for status and returning the status of the choice */
    const anticurseCheck = await quickmongo.fetch(`swear-${message.guild.id}`);
    let anticurseStatus;

    // check for anticurse status
    if (anticurseCheck === true) {
      anticurseStatus = "🟢 (ENABLED)";
    } else anticurseStatus = "🔴 (DISABLED)";

    if (choice === "configure") {
      const configureEmbed = new Discord.MessageEmbed()
        .setColor("#ff0000")
        .setTitle(`${message.guild.name}'s configuration`)
        .addField("Usage", `${prefix}setup configure <choice> [value]`)
        .addField("\u200b", "__General__")
        .addField("🖐️ Welcome Channel", "`COMING SOON`")
        .addField("😔 Member Left Channel", "`COMING SOON`")
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
