const client = require("../index");
const config = require("../config.json");
const prefix = config.prefix;
const { Database } = require("quickmongo");
const quickmongo = new Database(config.database_url);
const { badwords } = require("../badwords.json");
const Levels = require("discord-xp");
Levels.setURL(config.database_url);

// message event
client.on("message", async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;

  if ((await quickmongo.fetch(`swear-${message.guild.id}`)) === true) {
    for (let i = 0; i < badwords.length; i++) {
      if (
        message.content.toLowerCase().includes(badwords[i].toLocaleLowerCase())
      ) {
        message.delete();
        message.channel
          .send(`${message.author} Please don't use bad words!`)
          .then((msg) => {
            msg.delete({ timeout: 5000 });
          });
      }
    }
  }

  // leveling
  const randomAmountOfXp = Math.floor(Math.random() * 10) + 1;
  const hasLeveledUp = await Levels.appendXp(
    message.author.id,
    message.guild.id,
    randomAmountOfXp
  );
  if (hasLeveledUp) {
    const user = await Levels.fetch(message.author.id, message.guild.id);
    message.channel.send(
      `${message.author}, congratulations! You have leveled up! to **${user.level}**!!`
    );
  }

  // check for afk status
  if (await quickmongo.fetch(`afk-${message.author.id}+${message.guild.id}`)) {
    const info = await quickmongo.get(
      `afk-${message.author.id}+${message.guild.id}`
    );
    const user = message.member;
    await quickmongo.delete(`afk-${message.author.id}+${message.guild.id}`);

    try {
      await user.setNickname(null);
    } catch (err) {
      message.channel.send("could not set your nickname");
    }
    message.reply(`you are no longer AFK. Reason: ${info}`);
  }

  // check for mentions
  const mentionedMember = message.mentions.members.first();
  if (mentionedMember) {
    if (
      await quickmongo.fetch(
        `afk-${message.mentions.members.first().id}+${message.guild.id}`
      )
    ) {
      message.reply(
        `${mentionedMember.user.tag} is AFK. Reason: ${await quickmongo.get(
          `afk-${message.mentions.members.first().id}+${message.guild.id}`
        )}`
      );
    } else return;
  }

  if (!message.content.startsWith(prefix)) return;
  if (!message.guild) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length == 0) return;
  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));

  const PermissionsFlags = [
    "CREATE_INSTANT_INVITE",
    "KICK_MEMBERS",
    "BAN_MEMBERS",
    "ADMINISTRATOR",
    "MANAGE_CHANNELS",
    "MANAGE_GUILD",
    "ADD_REACTIONS",
    "VIEW_AUDIT_LOG",
    "PRIORITY_SPEAKER",
    "VIEW_CHANNEL",
    "READ_MESSAGES",
    "SEND_MESSAGES",
    "SEND_TTS_MESSAGES",
    "MANAGE_MESSAGES",
    "EMBED_LINKS",
    "ATTACH_FILES",
    "READ_MESSAGE_HISTORY",
    "MENTION_EVERYONE",
    "USE_EXTERNAL_EMOJIS",
    "EXTERNAL_EMOJIS",
    "CONNECT",
    "SPEAK",
    "MUTE_MEMBERS",
    "DEAFEN_MEMBERS",
    "MOVE_MEMBERS",
    "USE_VAD",
    "CHANGE_NICKNAME",
    "MANAGE_NICKNAMES",
    "MANAGE_ROLES",
    "MANAGE_WEBHOOKS",
    "MANAGE_EMOJIS",
  ];

  if (command.permissions.length) {
    let invalidPermissionsFlags = [];
    for (const permission of command.permissions) {
      if (!PermissionsFlags.includes(permission)) {
        return console.log(`${permission} is not a valid permission flag`);
      }

      if (!message.member.hasPermission(permission)) {
        invalidPermissionsFlags.push(permission);
      }
    }

    if (invalidPermissionsFlags.length) {
      const noPermissionEmbed = new client.Discord.MessageEmbed()
        .setColor("#ff0000")
        .setTitle("You do not have permission to use this command!")
        .setDescription(
          `You need the following permissions to use this command: ${invalidPermissionsFlags.join(
            ", "
          )}`
        )
        .setFooter(`${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();

      return message.channel.send(noPermissionEmbed);
    }
  }

  if (command) command.run(client, message, args);
});
