const client = require("../index");
const Discord = require("discord.js");
const canvacord = require("canvacord");

const { Database } = require("quickmongo");
const config = require("../config.json");
const prefix = config.prefix;
const quickmongo = new Database(config.database_url);

client.on("guildMemberRemove", async (member) => {
  const leaveChannelCheck = await quickmongo.fetch(`leave-${member.guild.id}`);

  let leaver = new canvacord.Leaver()
    .setUsername(member.user.username)
    .setDiscriminator(member.user.discriminator)
    .setMemberCount(member.guild.memberCount)
    .setGuildName(member.guild.name)
    .setAvatar(member.user.displayAvatarURL({ format: "png", dynamic: false }))
    .setBackground("https://wallpapercave.com/wp/zVlefp0.jpg")
    .setColor("title", "#191919")
    .setColor("title-border", "#ffffff")
    .setColor("avatar", "#191919")
    .setColor("username", "#ffffff")
    .setColor("username-box", "#3F3351")
    .setColor("discriminator", "#ffffff")
    .setColor("discriminator-box", "#3F3351")
    .setColor("message", "#ffffff")
    .setColor("message-box", "#3F3351")
    .setColor("member-count", "#ffffff")
    .setColor("background", "#191919")
    .setColor("border", "#191919");

  if (leaveChannelCheck) {
    const getleaveChannel = await quickmongo.get(`leave-${member.guild.id}`);
    const leaveChannel = member.guild.channels.cache.get(getleaveChannel);

    leaver.build().then((data) => {
      const attachement = new Discord.MessageAttachment(data, "leave.png");
      leaveChannel.send(`${member.user}`).then(leaveChannel.send(attachement));
    });
  } else return;
});
