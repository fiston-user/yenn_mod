const fs = require("fs");
const ascii = require("ascii-table");
let table = new ascii("Commands");
table.setHeading("Command", "Load status");

module.exports = (client) => {
  // Start of command handler
  fs.readdirSync("./commands/").forEach((dir) => {
    const commands = fs
      .readdirSync(`./commands/${dir}/`)
      .filter((file) => file.endsWith(".js"));

    for (let files of commands) {
      let get = require(`../commands/${dir}/${files}`);

      if (get.name) {
        client.commands.set(get.name, get);
        table.addRow(files, "✅ LOADED");
      } else {
        table.addRow(files, "❌ FAILED TO LOAD");
        continue;
      }
      if (get.aliases && Array.isArray(get.aliases)) {
        get.aliases.forEach((alias) => {
          client.aliases.set(alias, get.name);
        });
      }
    }
  });
  console.log(table.toString());

  // End of command handler

  // Start of event handler
  fs.readdirSync("./events/").forEach((file) => {
    const events = fs.readdirSync(`./events/`).filter((f) => f.endsWith(".js"));

    for (let files of events) {
      let get = require(`../events/${files}`);

      if (get.name) {
        client.events.set(get.name, get);
      } else {
        continue;
      }
    }
  });
  // End of event handler
};
