# uptime-monitor [![NPM version](https://badge.fury.io/js/uptime-monitor.svg)](https://npmjs.org/package/uptime-monitor) ![David](https://david-dm.org/EndBug/uptime-monitor.svg) [![npm](https://img.shields.io/npm/dt/uptime-monitor.svg)](https://npmjs.org/package/uptime-monitor)

> A Discord bot that notifies you when one of the watched bots/users goes offline for a continued period of time (meant for bots, not so useful with users)

## Installation

```sh
$ npm install --save uptime-monitor
```

## Settings

To modify the settings, go in settings.json, you'll find these options:

 - `commands.on` & `commands.off`: arrays of command names to use
 - `guild`: your guild's ID
 - `list`: an array of arrays
 - `min`: minutes between checks
 - `owner`: your ID
 - `status.on` & `status.off`: two objects with a `text` and a `type` that will be used for the bot presence
 - `token.str`: your token OR a valid variable that can be evaled
 - `token.toeval`: whether or not `token.str` should be evaled

In `list` every element has to follow this format: `["name", "id", minutes]`, with `minutes` as a number.

You can find a template in settings.json (keep in mind that it won't work for your bot)

## Improvements
If you want to change something in the behavior, you can look at the JSDocs in the docs. If you find a bug feel free to open an issue on [GitHub](https://github.com/EndBug/uptime-monitor) or submit a PR.

## Usage

```js
require('uptime-monitor');
```

## License

MIT © [Federico Grandi](https://github.com/EndBug)
