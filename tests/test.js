/* eslint-disable no-unreachable */
const UptimeMonitor = require('../dist/app')

// Please edit the config below, then delete the following line:
throw new Error('Please configure your test file at tests/test.js!')

const bot = new UptimeMonitor.Bot({
  owner_id: '',
  token: '',
  commands: {
    on: true,
    off: true,
    list: true
  },
  list: [

  ],
  refresh: 5000,
  other_owners: '',
  send_to: '',
  status: {
    on: {
      name: 'online bots.',
      type: 'LISTENING'
    },
    off: {
      name: 'your bots...',
      type: 'WATCHING'
    }
  }
})
