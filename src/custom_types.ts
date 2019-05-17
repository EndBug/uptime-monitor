// eslint-disable-next-line no-unused-vars
import { ActivityType, Channel, TextChannel, Message, User } from 'discord.js';
import { client, send_to } from './app';

// #region Settings

/**
 * Interface for the settings you use to start the bot.
 */
export interface Settings {
  /**
   * The list of commands to load (or not). By default they get all loaded.
   */
  commands?: {
    on?: boolean
    off?: boolean
    list?: boolean
  }

  /**
   * The list of elements to track, using the following format: `[codeName, discordID, timeout]`
   */
  list: TargetLike[]

  /**
   * Number of milliseconds for the bot to refresh; by default is every five seconds.
   */
  refresh?: number

  /**
   * Your id. If no other owner is detected you'll be the only one able to use commands.
   */
  owner_id: string

  /**
   * Add additional owners here: they'll have as much control over the bot as you.
   */
  other_owners?: string | string[]

  /**
   * The user/guild channel (in the `'guildID/channelID'` format) to send the messages to. By default, this is the owner.
   */
  send_to?: string

  /**
   * List of statuses to show when the bot is on and off. By default, no status is shown.
   */
  status?: {
    on?: Status
    off?: Status
  }

  /**
   * Your bot's token.
   */
  token: string
}

/**
 * Interface for the setting to use after the input was checked.
 */
export interface CheckedSettings {
  /**
   * The list of commands to load (or not). By default they get all loaded.
   */
  commands: {
    on: boolean
    off: boolean
    list: boolean
    help: boolean
  }

  /**
   * The list of elements to track, using the following format: `[codeName, discordID, timeout]`
   */
  list: TargetLike[]

  /**
   * Number of milliseconds for the bot to refresh; by default is every five seconds.
   */
  refresh: number

  /**
   * An array with every owner's ID (the first is the original one).
   */
  owners: string[]

  /**
   * The user/guild channel (in the `'guildID/channelID'` format) to send the messages to. By default, this is the owner.
   */
  send_to: string

  /**
   * List of statuses to show when the bot is on and off. By default, no status is shown.
   */
  status: {
    on?: Status
    off?: Status
  }

  /**
   * Your bot's token.
   */
  token: string
}

// #endregion

/**
 * Interface for a custom status from the settings.
 */
export interface Status {
  /**
   * Custom text to show after the type part.
   */
  name: string
  /**
   * By default: `"PLAYING"`.
   */
  type?: ActivityType
  /**
   * By default: `undefined`
   */
  url?: string
}

// #region targets

/**
 * Interface that makes you quickly add targets in the settings.
 */
export interface TargetLike extends Array<any> {
  /**
   * A codename that will help recognize the target (only for debugging purposes).
   */
  0: string

  /**
   * The ID of the target. Make sure the target is connected to the bot through at least one guild.
   */
  1: string

  /**
   * The number of minutes the target has to be offline before the bot notifies you.
   */
  2: number

  length: 3
}

/**
 * Class for every accepted target.
 */
export class Target {
  // #region Properties

  /**
  * A codename that identifies the target (only for debugging purposes).
  */
  name: string

  /**
   * The Discord ID of the target.
   */
  id: string

  /**
   * The number of minutes to wait before sending the notification.
   */
  timeout: number

  /**
   * The currrently active interval (both 'watch' and 'alert' intervals get stored here).
   */
  interval?: NodeJS.Timeout

  /**
   * The date of when the target has been found offline.
   */
  offlineSince?: Date

  /**
   * The last notification message sent by the bot for this target.
   */
  lastMessage?: Message

  /**
   * The last user object found for the target.
   */
  cachedUser?: User

  // #endregion

  /**
   * @param name A codename that will help recognize the target (only for debugging purposes).
   * @param id The ID of the target. Make sure the target is connected to the bot through at least one guild.
   * @param timeout The number of minutes the target has to be offline before the bot notifies you.
   */
  constructor(name: string, id: string, timeout: number) {
    this.name = name;
    this.id = id;
    this.timeout = timeout;
  }

  /**
   * Starts watching for the target to go offline.
   * @param refresh_ms The number of ms to run the cycle with.
   */
  startWatching(refresh_ms: number) {
    this.stop();
    const watch = async () => {
      const isOnline = await this.check();
      if (isOnline === false) {
        this.offlineSince = now();
        this.startAlert(refresh_ms);
        console.log((this.longName() || `${this.name} (${this.id})`) + 'has been found offline, timer started.');
      }
    };
    this.interval = setInterval(watch, refresh_ms);
    watch();
  }

  /**
   * Starts watching when the bot is found offline: after some time, it'll send the notification message and it'll edit it when the target comes back online.
   * @param refresh_ms The number of ms to run the cycle with.
   */
  startAlert(refresh_ms: number) {
    this.stop();
    const alert = async () => {
      const isOnline = await this.check();
      if (isOnline === true) {
        if (this.offlineSince && (+(now()) - +(this.offlineSince)) > this.timeout && this.lastMessage) {
          this.lastMessage.edit(`:white_check_mark: \`${this.cachedUser ? longName(this.cachedUser) : this.name}\` is now back online!`);
          this.lastMessage = undefined;
        }
        this.offlineSince = undefined;
        this.startWatching(refresh_ms);
        console.log((this.longName() || `${this.name} (${this.id})`) + 'has come back online, alert canceled.');
      } else if (isOnline === false) {
        if (!this.offlineSince) this.offlineSince = now();
        if ((+(now()) - +(this.offlineSince)) > this.timeout*60000 && !this.lastMessage) {
          let message = await send_to.send(`:red_circle: \`${this.cachedUser ? longName(this.cachedUser) : this.name}\` has been offline for \`${this.getDowntime()}\` minutes.`);
          if (message instanceof Array) message = message[0];
          this.lastMessage = message;
        } else if (this.lastMessage) {
          const str = `:red_circle: \`${this.cachedUser ? longName(this.cachedUser) : this.name}\` has been offline for \`${this.getDowntime()}\` minutes.`;
          if (str != this.lastMessage.content) {
            let msg = await this.lastMessage.edit(str);
            if (msg instanceof Array) msg = msg[0];
            this.lastMessage = msg;
          }
        }
        console.log((this.longName() || `${this.name} (${this.id})`) + 'has ecceeded maximum time, notifcation sent.');
      }
    };
    this.interval = setInterval(alert, refresh_ms);
    alert();
  }
  
  /**
   * Clears the current interval.
   */
  stop() {
    if (this.interval) clearInterval(this.interval);
  }

  /**
   * Returns whether the target is online; if the target is unreachable it stop monitoring it.
   */
  async check() {
    const user = await client.fetchUser(this.id);
    if (user) {
      this.cachedUser = user;
      const {status} = user.presence;
      if (status == 'offline') return false;
      else return true;
    } else {
      this.stop();
      const error = `Target '${this.name} (id: ${this.id}) has become unreachable: I've stopped watching it.`;
      send_to.send(error);
      client.emit('error', error);
    }
  }

  /**
   * Returns the rounded number of minutes the target has been offline.
   */
  getDowntime() {
    return Math.round((+(now()) - +(this.offlineSince || now())) / 60000);
  }

  /**
   * Returns the displayable long name of the last cached user for the target.
   */
  longName() {
    return this.cachedUser ? longName(this.cachedUser) : undefined;
  }
}

// #endregion


// #region Utility functions
/**
 * Type guard for a text channel.
 * @param c The element you want to check.
 */
export function isTextChannel(c: any): c is TextChannel {
  return (c instanceof Channel && c.type == 'text');
}

/**
 * To use when a target is rejected during target creation.
 */
export interface TargetRejection {
  target: TargetLike
  reason: string
}

/**
 * Returns the current Date.
 */
function now() {
  return new Date();
}

/**
 * Returns a user in a 'loggable' format.
 * @param user The user or its ID.
 */
function longName(user: User) {
  return `${user.tag} (${user.id})`;
}

// #endregion