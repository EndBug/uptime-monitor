/// <reference types="node" />
import { ActivityType, TextChannel, Message, User } from 'discord.js';
/**
 * Interface for the settings you use to start the bot.
 */
export interface Settings {
    /**
     * The list of commands to load (or not). By default they get all loaded.
     */
    commands?: {
        on?: boolean;
        off?: boolean;
        list?: boolean;
    };
    /**
     * The list of elements to track, using the following format: `[codeName, discordID, timeout]`
     */
    list: TargetLike[];
    /**
     * Number of milliseconds for the bot to refresh; by default is every five seconds.
     */
    refresh?: number;
    /**
     * Your id. If no other owner is detected you'll be the only one able to use commands.
     */
    owner_id: string;
    /**
     * Add additional owners here: they'll have as much control over the bot as you.
     */
    other_owners?: string | string[];
    /**
     * The user/guild channel (in the `'guildID/channelID'` format) to send the messages to. By default, this is the owner.
     */
    send_to?: string;
    /**
     * List of statuses to show when the bot is on and off. By default, no status is shown.
     */
    status?: {
        on?: Status;
        off?: Status;
    };
    /**
     * Your bot's token.
     */
    token: string;
}
/**
 * Interface for the setting to use after the input was checked.
 */
export interface CheckedSettings {
    /**
     * The list of commands to load (or not). By default they get all loaded.
     */
    commands: {
        on: boolean;
        off: boolean;
        list: boolean;
        help: boolean;
    };
    /**
     * The list of elements to track, using the following format: `[codeName, discordID, timeout]`
     */
    list: TargetLike[];
    /**
     * Number of milliseconds for the bot to refresh; by default is every five seconds.
     */
    refresh: number;
    /**
     * An array with every owner's ID (the first is the original one).
     */
    owners: string[];
    /**
     * The user/guild channel (in the `'guildID/channelID'` format) to send the messages to. By default, this is the owner.
     */
    send_to: string;
    /**
     * List of statuses to show when the bot is on and off. By default, no status is shown.
     */
    status: {
        on?: Status;
        off?: Status;
    };
    /**
     * Your bot's token.
     */
    token: string;
}
/**
 * Interface for a custom status from the settings.
 */
export interface Status {
    /**
     * Custom text to show after the type part.
     */
    name: string;
    /**
     * By default: `"PLAYING"`.
     */
    type?: ActivityType;
    /**
     * By default: `undefined`
     */
    url?: string;
}
/**
 * Interface that makes you quickly add targets in the settings.
 */
export interface TargetLike extends Array<any> {
    /**
     * A codename that will help recognize the target (only for debugging purposes).
     */
    0: string;
    /**
     * The ID of the target. Make sure the target is connected to the bot through at least one guild.
     */
    1: string;
    /**
     * The number of minutes the target has to be offline before the bot notifies you.
     */
    2: number;
    length: 3;
}
/**
 * Class for every accepted target.
 */
export declare class Target {
    /**
    * A codename that identifies the target (only for debugging purposes).
    */
    name: string;
    /**
     * The Discord ID of the target.
     */
    id: string;
    /**
     * The number of minutes to wait before sending the notification.
     */
    timeout: number;
    /**
     * The currrently active interval (both 'watch' and 'alert' intervals get stored here).
     */
    interval?: NodeJS.Timeout;
    /**
     * The date of when the target has been found offline.
     */
    offlineSince?: Date;
    /**
     * The last notification message sent by the bot for this target.
     */
    lastMessage?: Message;
    /**
     * The last user object found for the target.
     */
    cachedUser?: User;
    /**
     * @param name A codename that will help recognize the target (only for debugging purposes).
     * @param id The ID of the target. Make sure the target is connected to the bot through at least one guild.
     * @param timeout The number of minutes the target has to be offline before the bot notifies you.
     */
    constructor(name: string, id: string, timeout: number);
    /**
     * Starts watching for the target to go offline.
     * @param refresh_ms The number of ms to run the cycle with.
     */
    startWatching(refresh_ms: number): void;
    /**
     * Starts watching when the bot is found offline: after some time, it'll send the notification message and it'll edit it when the target comes back online.
     * @param refresh_ms The number of ms to run the cycle with.
     */
    startAlert(refresh_ms: number): void;
    /**
     * Clears the current interval.
     */
    stop(): void;
    /**
     * Returns whether the target is online; if the target is unreachable it stop monitoring it.
     */
    check(): Promise<boolean | undefined>;
    /**
     * Returns the rounded number of minutes the target has been offline.
     */
    getDowntime(): number;
    /**
     * Returns the displayable long name of the last cached user for the target.
     */
    longName(): string | undefined;
}
/**
 * Type guard for a text channel.
 * @param c The element you want to check.
 */
export declare function isTextChannel(c: any): c is TextChannel;
/**
 * To use when a target is rejected during target creation.
 */
export interface TargetRejection {
    target: TargetLike;
    reason: string;
}
