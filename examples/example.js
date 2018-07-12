var bot = require("uptime-monitor");

bot({
  "commands": {
    "on": ["on", "up"],
    "off": ["off", "down"]
  },
  "guild": "guild_id",
  "list": [
    ["Target name (used only for errors & debugging, won't be displayed)", "target_id", 10]
  ],
  "ms": 5000,
  "owner": "your_id",
  "status": {
    "on": {
      "text": "your bots",
      "type": "WATCHING"
    },
    "off": {
      "text": "alone",
      "type": "PLAYING"
    }
  },
  "token": {
    "str": "your_token",
    "toeval": false
  }
});