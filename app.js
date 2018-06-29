/**
 * @author Federico Grandi <fgrandi30@gmail.com>
 */

const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.js");

var token = require("./settings.json").token;
token = token.toeval ? eval(token.str) : token.str;

client.login(token);

client.on("error", (e) => console.error(e));
client.on("warn", (w) => console.warn(w));
client.on("debug", (d) => console.info(d));

var guild, list, owner, paused = false;

client.on("ready", () => {
  guild = client.guilds.get(config.guild);
  owner = guild.members.get(config.owner).user;
  list = config.watched;

  // sets the presence of the bot
  setOnline();
  loop();
});

/**
 * setOnline - sets the status of the bot according to the given value
 *
 * @param  {Boolean} value The value to set (true == online, false == dnd)
 * @returns {Undefined}
 */
function setOnline(value = true) {
  let s = value ? "on" : "off";
  client.user.setActivity(config.status[s].text, {
    type: config.status[s].type
  });
  client.user.setStatus(value ? "online" : "dnd");
}

/**
 * checkCommands - searches for a command in the args
 *
 * @param   {Array} arr The array to scan
 * @returns {Boolean | Undefined}
 */
function checkCommands(arr = []) {
  if (!(arr instanceof Array)) arr = [arr];
  let on = false,
    off = false;

  //check for commands & aliases
  for (let command of config.commands.on)
    if (arr.includes(command)) on = true;
  for (let command of config.commands.off)
    if (arr.includes(command)) off = true;

  if (!(on || off) || (on && off)) return undefined;
  if (on) return true;
  if (off) return false;
}

//checks for command messages
client.on("message", (msg) => {
  //allow only if the owner writes in DM or mentions the bot
  if (msg.author == owner && (msg.channel instanceof Discord.DMChannel ||
      (msg.channel instanceof Discord.TextChannel && msg.content.startsWith(`<@${client.user.id}>`)))) {
    let arg = msg.content.toLowerCase().split(" "),
      res = checkCommands(arg);
    if (res == undefined) msg.reply(`Cannot understand ${msg.content}`);
    else {
      if (paused == res) msg.reply(`Setting the bot to: ${res ? "on" : "off"}`);
      paused = !res;
      if (!paused) loop();
      setOnline(res);
    }
  }
});

// executes all the checks
function loop() {
  if (paused) return;
  second();
  third();
  check();
  setTimeout(loop, config.loop);
}

// checks if the users in the list are online, if they're not, focus them
function check() {
  for (let target of list.array) {
    if (!target.focused && !target.reported) {
      let member = guild.members.get(target.id);
      if (member.presence.status == "offline") target.focus();
    }
  }
}

// checks if the focused users are now online, if they're not, report them to the owner
function second() {
  for (let target of list.array) {
    if (target.torecheck) {
      let member = guild.members.get(target.id);
      if (member.presence.status == "offline") {
        let user = member.user;
        owner.send(`\`${user.username}#${user.discriminator} (${target.id})\` has been offline for ${target.timeout/60/1000} minute(s)`);
        target.report();
      } else {
        target.focus(false);
      }
      target.recheck(false);
    }
  }
}

// checks if the reported users are now back online, if so, restart checking for them in check()
function third() {
  for (let target of list.array) {
    if (target.reported) {
      let member = guild.members.get(target.id);
      if (member.presence.status == "online") target.report(false);
    }
  }
}