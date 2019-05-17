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
