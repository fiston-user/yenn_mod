const client = require("../index");
const Discord = require("discord.js");
const canvacord = require("canvacord");

const { Database } = require("quickmongo");
const config = require("../config.json");
const prefix = config.prefix;
const quickmongo = new Database(config.database_url);

client.on("guildMemberAdd", async (member) => {
  const welcomeChannelCheck = await quickmongo.fetch(
    `welcome-${member.guild.id}`
  );

  let welcomer = new canvacord.Leaver()
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

  if (welcomeChannelCheck) {
    const getwelcomeChannel = await quickmongo.get(
      `welcome-${member.guild.id}`
    );
    const welcomeChannel = member.guild.channels.cache.get(getwelcomeChannel);

    welcomer.build().then((data) => {
      const attachement = new Discord.MessageAttachment(data, "welcome.png");
      welcomeChannel
        .send(`${member.user}`)
        .then(welcomeChannel.send(attachement));
    });
  } else return;
});
