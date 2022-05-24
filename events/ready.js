const client = require("../index");

client.on("ready", () => {
  function setStatus() {
    let status = [
      `with ${client.guilds.cache.size} servers`,
      `with ${client.users.cache.size} users`,
      `with ${client.commands.size} commands`,
    ];

    let statusRotate = Math.floor(Math.random() * status.length);

    client.user.setActivity(status[statusRotate], { type: "PLAYING" });
  }
  client.user.setStatus("dnd");
  setInterval(setStatus, 5000), console.log(`Logged in as ${client.user.tag}!`);
});
