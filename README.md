# uptime-monitor [![NPM version](https://badge.fury.io/js/uptime-monitor.svg)](https://npmjs.org/package/uptime-monitor) ![David](https://david-dm.org/EndBug/uptime-monitor.svg) [![npm](https://img.shields.io/npm/dt/uptime-monitor.svg)](https://npmjs.org/package/uptime-monitor)

> A Discord bot that notifies you when one of the watched bots/users goes offline for a continued period of time (meant for bots, not so useful with users)

## Installation

```sh
$ npm install --save uptime-monitor
```

## Settings

To use the bot, you'll need to create an object with these settings:

 - `commands.on` & `commands.off`: arrays of command names to use
 - `guild`: your guild's ID
 - `list`: an array of arrays
 - `ms`: number milliseconds between checks
 - `owner`: your ID
 - `status.on` & `status.off`: two objects with a `text` and a `type` that will be used for the bot presence
 - `token.str`: your token OR a valid variable that can be evaled
 - `token.toeval`: whether or not `token.str` should be evaled

In `list` every element has to follow this format: `["name", "id", minutes]`, with `minutes` as a number.

You can look at the example in the "Usage" section.


## Improvements
If you want to change something in the behavior, you can look at the JSDocs in the docs. If you find a bug feel free to open an issue on [GitHub](https://github.com/EndBug/uptime-monitor) or submit a PR.

## Usage

```js
const bot = require('uptime-monitor');
bot({
  "commands": { //optional, if null no command will be loaded
    "on": ["on", "up"], //optional, if empty no 'on' commands will be loaded, if not an Array default commands will be loaded
    "off": ["off", "down"] //same thing as commands.on
  },
  "guild": "guild_id", //required
  "list": [ //required, should have at least one element, formatted like this one
    ["Target name (used only for errors & debugging, won't be displayed)", "target_id", 10]
  ],
  "ms": 5000, //optional, default is every 5 seconds
  "owner": "your_id", //required
  "status": { //optional, if not an object (or undefined) no status will be loaded
    "on": { //optional, if not an object no status 'on' will be loaded
      "text": "your bots", //optional, if not a string no 'on' status will be loaded
      "type": "WATCHING" //optional, if not a valid Discord.ActivityType no 'on' status will be loaded
    },
    "off": { //same thing as status.on
      "text": "alone",
      "type": "PLAYING"
    }
  },
  "token": { //required
    "str": "your_token", //required, your token or a string that, if evaled, returns a token
    "toeval": false //optional, if not a boolean the token.str won't be evaled
  }
});
```

## Changelog
To see the version changelog, you can look [here](https://github.com/EndBug/uptime-monitor/blob/master/CHANGELOG.md)

## License

MIT © [Federico Grandi](https://github.com/EndBug)

[View full license](https://github.com/EndBug/uptime-monitor/blob/master/LICENSE)
