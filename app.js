const Discord = require("discord.js");
const client = new Discord.Client();
const token = process.env.UPTIME_TOKEN;
const config = require("./config.js");

client.login(token);

client.on("error", (e) => console.error(e));
client.on("warn", (w) => console.warn(w));
client.on("debug", (d) => console.info(d));

var guild, owner, list;

client.on("ready", () => {
  guild = client.guilds.get(config.guild);
  owner = guild.members.get(config.owner).user;
  list = config.watched;
  loop();
});

function loop() {
  check();
  second();
  third();
  setTimeout(loop, config.loop);
}

function check() {
  for (let target of list.array) {
    if (!target.focused && !target.reported) {
      let member = guild.members.get(target.id);
      if (member.presence.status == "offline") target.focus();
    }
  }
}

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

function third() {
  for (let target of list.array) {
    if (target.reported) {
      let member = guild.members.get(target.id);
      if (member.presence.status == "online") target.report(false);
    }
  }
}