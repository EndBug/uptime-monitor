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

var guild, owner, list;

client.on("ready", () => {
  guild = client.guilds.get(config.guild);
  owner = guild.members.get(config.owner).user;
  list = config.watched;

  // sets the presence of the bot
  client.user.setActivity(config.status.text, {
    type: config.status.type
  });

  loop();
});


// executes all the checks
function loop() {
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