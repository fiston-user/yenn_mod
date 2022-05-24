const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");
const token = config.token;
const database_url = config.database_url;
const mongoose = require("mongoose");

mongoose
  .connect(database_url)
  .then(console.log("Connected to MongoDB"))
  .catch(console.error);

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = fs.readdirSync("./commands/");
module.exports = client;

["handler"].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

client.login(token);
