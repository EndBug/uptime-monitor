/*global isID isStatusType*/
/**
 * @author Federico Grandi <fgrandi30@gmail.com>
 */


/**
 * isID - checks whether a string is an ID:
 *
 * @param {string} str The string to check
 * @returns {boolean} Whether the string is a Discord ID
 */
global.isID = (str = "") => {
  return typeof str == "string" && !isNaN(parseInt(str)) && str.length == 18;
};


/**
 * isStatusType - checks whether a string is a valid ActivityType
 *
 * @param {string} str The string to check
 * @returns {boolean} Whether the string is a valid ActivityType
 */
global.isStatusType = (str = "") => {
  if (str == "STREAMING") console.error("'STREAMING' status type is not supported.");
  return typeof str == "string" && ["PLAYING", "WATCHING", "LISTENING"].includes(str.toUpperCase());
};


/**
 * checkSettings - Checks whether the settings passed as argument are valid
 *
 * @param  {Object} obj The settings object
 */
function checkSettings(obj) {
  let def = require("./default.json");
  //check whether the module returns an object
  if (typeof obj != "object") throw new Error(`Invalid configuration: you should pass an object (you passed ${typeof obj})`);

  //check whether they passed a valid command object
  if (obj.commands === null) { //if it's null, don't load any command
    obj.commands = {
      on: [],
      off: []
    };
    console.log("No commands loaded.");
  } else if (typeof obj.commands != "object") { //if it's not an object, replace it with the default
    console.log(`No valid 'commands' found, loaded default commands. (typeof obj.commands -> ${typeof obj.commands})`);
    obj.commands = def.commands;
  } else { //if it's an object, check for the properties
    if (!(obj.commands.on instanceof Array)) { //if it's not an array, replace it with the default
      obj.commands.on = def.commands.on;
      console.warn("Commands object has no valid 'on' array, loaded default 'on' commands.");
    } else if (obj.commands.on.length == 0) console.log("No 'on' commands loaded."); //if they left it empty on purpose, don't load any on command
    else console.log("Successfully loaded custom 'on' commands."); //if you got to this point, they should be ok
    if (!(obj.commands.off instanceof Array)) { //if it's not an array, replace it with the default
      obj.commands.off = def.commands.off;
      console.warn("Commands object has no valid 'off' array, loaded default 'off' commands.");
    } else if (obj.commands.off.length == 0) console.log("No 'off' commands loaded."); //if they left it empty on purpose, don't load any off command
    else console.log("Successfully loaded custom 'off' commands"); //if you got to this point, they should be ok
  }

  //check whether they passed a valid guild ID
  if (!isID(obj.guild)) throw new Error(`Invalid configuration: please provide a valid guild id (you passed ${obj.guild})`);

  //check whether they passed a valid & not-empty list (list targets are checked later during list building)
  if (!(obj.list instanceof Array) || obj.list.length == 0) throw new Error(`Invalid configuration: please provide a valid list (you passed ${obj.list instanceof Array ? "an empty list" : `${typeof obj.list}`})`);

  //check whether they passed a valid refresh time, otherwise replace that with the default
  if (isNaN(obj.ms)) {
    obj.ms = def.ms;
    console.warn(`No valid 'ms' found, using default value. (you passed ${obj.ms})`);
  }

  //check whether they passed a valid owner ID
  if (!isID(obj.owner)) throw new Error(`Invalid configuration: please provide a valid owner id (you passed ${obj.owner})`);

  //check whether they passed a valid status object
  if (typeof obj.status != "object") { //if it's not an object, replace it with the default (empty)
    if (obj.status === undefined) console.log("No statuses loaded.");
    else console.warn(`No valid 'status' found, loaded default status. (typeof obj.status -> ${typeof obj.status})`);
    obj.status = def.status;
  } else { //if it's an object, check for the properties
    if (typeof obj.status.on != "object") { //if it's not an object, replace it with the default (empty)
      if (obj.status.on === undefined) console.log("No 'on' status loaded.");
      else console.warn("No valid 'on' status found, no 'on' status loaded.");
      obj.status.on = def.status.on;
    } else {
      if (typeof obj.status.on.text != "string" || !isStatusType(obj.status.on.type)) { //if the text or the status type are not valid, replace them with the default (empty)
        console.warn(typeof obj.status.on.text == "string" ? `'${obj.status.on.type}' is not a valid status type, no 'on' status loaded.` : "No valid 'status.on.text' found, no 'on' status loaded.");
        obj.status.on = def.status.on;
      } else if (!obj.status.on.text) console.log("No 'on' status loaded.");
      else console.log("Successfully loaded custom 'on' status."); //if you got to this point, they should be ok
    }
    if (typeof obj.status.off != "object") { //if it's not an object, replace it with the default (empty)
      if (obj.status.off === undefined) console.log("No 'off' status loaded.");
      else console.warn("No valid 'off' status found, no 'off' status loaded.");
      obj.status.off = def.status.off;
    } else {
      if (typeof obj.status.off.text != "string" || !isStatusType(obj.status.off.type)) { //if the text or the status type are not valid, replace them with the default (empty)
        console.warn(typeof obj.status.off.text == "string" ? `'${obj.status.off.type}' is not a valid status type, no 'off' status loaded.` : "No valid 'status.off.text' found, no 'off' status loaded.");
        obj.status.off = def.status.off;
      } else if (!obj.status.off.text) console.log("No 'off' status loaded.");
      else console.log("Successfully loaded custom 'off' status."); //if you got to this point, they should be ok
    }
  }

  //check whether they passed a valid token
  if (typeof obj.token != "object" || !obj.token.str) throw new Error(`Invalid configuration: please provide a valid 'token.str' (you passed ${obj.token == undefined ? "an undefined 'token'" : `'${obj.token.str}' as 'token.str'`})`);
  else if (typeof obj.token.toeval != "boolean") obj.token.toeval = def.token.toeval; //if token.toeval is not defined, replace it with the default
}

module.exports = (settings) => {
  var timer; //stores the timer (in this way I can cancel it)

  checkSettings(settings);

  const Discord = require("discord.js");
  const client = new Discord.Client();
  var config = require("./config.js")(settings);

  let token = settings.token;
  token = token.toeval ? eval(token.str) : token.str;

  client.login(token).catch(e => {
    if (e) setTimeout(() => {
      throw new Error(`Cannot login with this token, check your token: ${token}`);
    });
  });


  client.on("error", (e) => console.error(e));
  client.on("warn", (w) => console.warn(w));
  client.on("debug", (d) => console.info(d));

  var guild, list, owner, paused = false;

  client.on("ready", () => {
    guild = client.guilds.get(config.guild);
    if (!guild) throw new Error(`Guild is undefined, check your guild id: ${config.guild}`);

    owner = guild.members.get(config.owner);
    if (!owner) throw new Error(`Owner is undefined, check your owner id: ${config.owner}`);
    owner = owner.user;

    list = config.watched;

    checkTargets(guild);

    // sets the presence of the bot
    setOnline();
    loop();
  });

  /**
   * checkTargets - checks if the targets actually exist in the guild and, if they don't, it removes them
   *
   * @param  {Discord.Guild} guild The guild
   * @returns {TargetList} The resulting list
   */
  function checkTargets(guild) {
    let i = 0;
    while (i < list.array.length) {
      let curr = list.array[i];
      if (guild.members.get(curr.id)) i++;
      else {
        owner.send(`Found inexistent target: the item was removed from the list - \`NAME: ${curr.name}\``);
        list.remove(curr);
      }
    }
    return list;
  }

  /**
   * setOnline - sets the status of the bot according to the given value
   *
   * @param  {boolean} value The value to set (true == online, false == dnd)
   */
  function setOnline(value = true) {
    let s = value ? "on" : "off";
    if (config.status[s].text) client.user.setActivity(config.status[s].text, {
      type: config.status[s].type
    });
    else client.user.setActivity();
    client.user.setStatus(value ? "online" : "dnd");
  }

  /**
   * checkCommands - searches for a command in the args
   *
   * @param   {Array} arr The array to scan
   * @returns {?boolean}
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
        let text = res ? "on" : "off";
        if (paused == res) {
          msg.reply(`Setting the bot to: \`${text}\``);
          paused = !res;
          if (!paused) loop();
          else clearTimeout(timer);
          setOnline(res);
          console.log(`${msg.author.username}#${msg.author.discriminator} set the bot to '${text}'`);
        } else msg.reply(`The bot is already set to: \`${text}\``);
      }
    }
  });

  // executes all the checks
  async function loop() {
    if (paused) return;
    await second();
    third();
    check();
    timer = setTimeout(loop, config.loop);
  }

  // checks if the users in the list are online, if they're not, focus them
  function check() {
    for (let target of list.array) {
      if (!target.focused && !target.reported) {
        let member = guild.members.get(target.id);
        if (member.presence.status == "offline") {
          target.focus();
          target.offline();
        }
      }
    }
  }

  // checks if the focused users are now online, if they're not, report them to the owner
  async function second() {
    for (let target of list.array) {
      if (target.torecheck) {
        let member = guild.members.get(target.id);
        if (member.presence.status == "offline") {
          target.report();
          await owner.send(cmsg(target)).then(m => target.setMessage(m));
        } else {
          target.setMessage();
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
        if (member.presence.status != "offline") {
          target.report(false);
          target.online();
          let text = `:white_check_mark: \`${member.user.username}#${member.user.discriminator} (${target.id})\` is now back online!`;
          target.checkMessage().then(m => {
            if (m) m.edit(text);
            else owner.send(text).then(target.setMessage);
          });
        } else {
          target.checkMessage().then(m => {
            if (m) m.edit(cmsg(target));
            else owner.send(cmsg(target)).then(target.setMessage);
          });
        }
      }
    }
  }

  /**
   * cmsg - creates an offline message for the owner
   *
   * @param  {Target} target The target
   * @returns {string} The resulting message
   */
  function cmsg(target) {
    let user = guild.members.get(target.id).user;
    return `:red_circle: \`${user.username}#${user.discriminator} (${target.id})\` has been offline for \`${target.getDowntime()}\` minute${target.getDowntime() == 1 ? "" : "s"}`;
  }
};