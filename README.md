# uptime-monitor [![NPM version](https://badge.fury.io/js/uptime-monitor.svg)](https://npmjs.org/package/uptime-monitor) [![npm](https://img.shields.io/npm/dt/uptime-monitor.svg)](https://npmjs.org/package/uptime-monitor) [![LGTM code quality](https://img.shields.io/lgtm/grade/javascript/github/EndBug/uptime-monitor?label=Code%20quality)](https://lgtm.com/projects/g/EndBug/uptime-monitor/context:javascript)

A Discord bot that notifies you when one of the watched bots/users goes offline for a continued period of time.

## Installation

```sh
$ npm install --save uptime-monitor
```

## Settings

To use the bot, you'll need to create an object with these settings:

 - `commands`: an object structured as `commandName:boolean` where you can choose wich commands to activate (by default they all get loaded). Available commands are `on`, `off` and `list`.
 - `list`: an array of arrays where you can add your targets; you can find more info about the format under this list.
 - `refresh`: number of milliseconds for the bot to refresh; by default is every five seconds.
 - `owner_id`: your ID.
 - `other_owners`: the ID/an array with the IDs of other owners (people that can use the commands).
 - `send_to`: the user/guild channel (in the `'guildID/channelID'` format) to send the messages to. By default, this is the owner.
 - `status.on` & `status.off`: two objects with a `text` and a `type` that will be used for the bot presence.
 - `token`: your token.

In `list` every element has to follow this format: `[codeName, discordID, timeout]`, with `timeout` as a number. `codeName` is a name that will be used to identify the bot for debugging purposes; `timeout` is the number of minutes the bot has to wait to notify you: you can set this to zero, but it'll notify you even if your bot goes offline for a very little time.

If your IDE has TypeScript support then it'll help you by showing you which settings you can use and their documentation.

You can look at the example in the [Usage](#usage) section.


## Improvements
If you want to contribute to this package please take a look at the [contributing guide](CONTRIBUTING.md). If you find a bug feel free to open an issue on [GitHub](https://github.com/EndBug/uptime-monitor/issues) or submit a PR.

## Usage

```js
const UptimeMonitor = require('uptime-monitor');

const bot = new UptimeMonitor.Bot({
  commands: {
    on: true,
    off: true,
    list: true
  },
  list: [
    ['Its name', 'Its ID', 3]
  ],
  refresh: 5000,
  owner_id: 'Your ID',
  other_owners: ['Their IDs'],
  send_to: 'Their ID or guildID/channelID',
  status: {
    on: {
      name: 'text displayed while online',
      type: 'WATCHING'
    },
    off: {
      name: 'text displayed by offline',
      type: 'WATCHING'
    }
  },
  token: 'Your bot\'s token'
});
```

You can also try this example online with [RunKit](https://npm.runkit.com/uptime-monitor).

## Changelog
To see the version changelog, you can look [here](https://github.com/EndBug/uptime-monitor/blob/master/CHANGELOG.md).

## License

MIT © [Federico Grandi](https://github.com/EndBug)

[View full license](https://github.com/EndBug/uptime-monitor/blob/master/LICENSE)
