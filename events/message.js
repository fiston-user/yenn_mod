const client = require("../index");
const config = require("../config.json");
const prefix = config.prefix;
const { Database } = require("quickmongo");
const quickmongo = new Database(config.database_url);
const { badwords } = require("../badwords.json");

// message event
client.on("message", async (message) => {
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
  if (command) command.run(client, message, args);
});
