import { Settings, CheckedSettings, Target, isTextChannel, TargetRejection, TargetLike } from './custom_types'
import { Client, User, TextChannel } from 'discord.js'

// #region Exported variables

/**
 * The client you're using.
 */
export var client = new Client()

/**
 * The checked settings the bot is using.
 */
export var settings: CheckedSettings

/**
 * The channel or user object the bot is sending notifications to.
 */
export var send_to: User | TextChannel

/**
 * The list of accepted targets.
 */
export var list: Target[]

/**
 * Whether the bot is active.
 */
export var on = true

// #endregion

client.on('error', console.error)
client.on('warn', console.warn)
client.on('debug', console.log)

/**
 * Main class to use: see the docs for further reference.
 */
export class Bot {
  constructor(inputSettings: Settings, callback?: (bot: Bot) => void) {
    settings = checkSettings(inputSettings)
    client.emit('debug', 'Using the following settings:\n' + JSON.stringify(settings, null, 2))
    client.login(settings.token)
      .then(() => {
        if (callback) callback(this)
      }).catch(console.error)
  }

  /**
   * Adds a new target on-the-go, returns the added target or the rejection error.
   * @param set The target in the same format as in the config: `[codeName, discordID, timeout]`.
   */
  async add(set: TargetLike) {
    const [name, id, timeout] = set
    const user = await client.fetchUser(id)
    if (user) {
      const target = new Target(name, id, timeout)
      const index = list.push(target) - 1
      list[index].startWatching(settings.refresh)
      return target
    } else return 'Couldn\'t find user with that id.'
  }

  /**
   * Removes a target on-the-go, returns the removed target (if one was found).
   * @param id The Discord id of the target.
   */
  remove(id: string) {
    for (let i = 0; i < list.length; i++) {
      const target = list[i]
      if (target.id == id) {
        target.stop()
        return list.splice(i, 1)
      }
    }
  }
}

client.on('ready', async () => {
  try {
    send_to = await loadSendTo()
    list = await loadTargets()
    startMonitoring()
    require('./commands')
    setStatus(true)
  } catch (error) {
    await client.destroy()
    console.error('Fatal error detected, bot shut down. Error:\n' + error)
    process.exit(1)
  }
})

// #region Utility functions

/**
 * Reads the user input, checks whether necessary parts were included and fills optional ones.
 * @param settings 
 */
function checkSettings(settings: Settings): CheckedSettings {
  // @ts-ignore
  const result: CheckedSettings = {}

  if (settings.commands) {
    const { on, off, list } = settings.commands
    result.commands = {
      on: typeof on == 'boolean' ? on : true,
      off: typeof off == 'boolean' ? off : true,
      list: typeof list == 'boolean' ? list : true,
      help: true
    }
  } else {
    result.commands = {
      on: true,
      off: true,
      list: true,
      help: true
    }
  }

  result.list = settings.list || []

  result.refresh = settings.refresh || 5000

  if (!settings.owner_id) throw new Error('There has to be a main owner ID.')

  result.owners = [settings.owner_id]
  if (typeof settings.other_owners == 'string') result.owners.push(settings.other_owners)
  else if (settings.other_owners instanceof Array) result.owners.push(...settings.other_owners)

  result.send_to = settings.send_to || settings.owner_id

  result.status = settings.status || {}

  if (!settings.token) throw new Error('There has to be a bot token!')
  else result.token = settings.token

  return result
}

/**
 * Parses the `send_to` from the settings and return its `User` or `TextChannel` result.
 */
async function loadSendTo() {
  const id = settings.send_to
  const splitted = id.split('/')

  if (splitted.length == 1) {
    const userID = splitted[0]
    try {
      const user = await client.fetchUser(userID)
      return user
    } catch (error) {
      throw new Error(`The bot can't find any user with this id: '${userID}'. Please check your settings: if you left the 'send_to' field empty then check the owner id; if you wrote a channel id, rewrite that as 'guildID/channelID'.`)
    }
  } else {
    const [guildID, channelID] = splitted
    const guild = client.guilds.get(guildID)
    if (guild) {
      const channel = guild.channels.get(channelID)
      if (channel) {
        if (isTextChannel(channel)) return channel
        else throw new Error(`The bot has found your channel, but doesn't seem to be a text channel: type ${channel.type}. Please check your channel ID.`)
      } else throw new Error(`The bot can't find any channel with this id in your guild (${guildID}): '${channelID}'. Please check your settings: it should be written as 'guildID/channelID'.'`)
    } else throw new Error(`The bot can't find any guild with this id: '${guildID}'. Please check your settings: it should be written as 'guildID/channelID'.`)
  }
}

/**
 * Returns the list with all the accepted targets; sends a message with the rejected ones.
 */
async function loadTargets() {
  const rejected: TargetRejection[] = []
  const result: Target[] = []

  for (const current of settings.list) {
    const [name, id, timeout] = current
    const user = await client.fetchUser(id)
    if (user) result.push(new Target(name, id, timeout))
    else rejected.push({
      target: current,
      reason: 'Couldn\'t find user with that id.'
    })
  }

  if (rejected.length) {
    let msg = 'The following targets have been rejected:'
    for (const rejection of rejected)
      msg += `\n\`${rejection.target[0]} (${rejection.target[1]})\` -> ${rejection.reason}`
    msg += (result.length ? `\n\`${result.length}\` targets have been loaded.` : 'No other targets have been loaded.')
    send_to.send(msg)
    client.emit('error', msg)
  } else if (!result.length) {
    client.emit('warn', 'WARN! No targets have been set in the code settings.')
  }

  return result
}

/**
 * Starts to watch every accepted tag.
 */
export function startMonitoring() {
  for (const target of list) target.startWatching(settings.refresh)
}

/**
 * Stops to watch every target.
 */
export function stopMonitoring() {
  for (const target of list) target.stop()
}

/**
 * Sets the initial status for the bot, if one is set.
 * @param mode Whether to set the bot online (`true`) or offline (`false`)
 */
export function setStatus(mode: boolean) {
  on = mode
  const status = settings.status[mode ? 'on' : 'off']
  if (status) return client.user.setPresence({
    status: mode ? 'online' : 'dnd',
    game: status
  }); else return client.user.setPresence({
    status: mode ? 'online' : 'dnd',
    game: {
      name: ''
    }
  })
}

// #endregion
