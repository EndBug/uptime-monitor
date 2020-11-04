import { Settings, CheckedSettings, Target, TargetLike } from './custom_types';
import { Client, User, TextChannel } from 'discord.js';
/**
 * The client you're using.
 */
export declare var client: Client;
/**
 * The checked settings the bot is using.
 */
export declare var settings: CheckedSettings;
/**
 * The channel or user object the bot is sending notifications to.
 */
export declare var send_to: User | TextChannel;
/**
 * The list of accepted targets.
 */
export declare var list: Target[];
/**
 * Whether the bot is active.
 */
export declare var on: boolean;
/**
 * Main class to use: see the docs for further reference.
 */
export declare class Bot {
    constructor(inputSettings: Settings, callback?: (bot: Bot) => void);
    /**
     * Adds a new target on-the-go, returns the added target or the rejection error.
     * @param set The target in the same format as in the config: `[codeName, discordID, timeout]`.
     */
    add(set: TargetLike): Promise<Target | "Couldn't find user with that id.">;
    /**
     * Removes a target on-the-go, returns the removed target (if one was found).
     * @param id The Discord id of the target.
     */
    remove(id: string): Target[] | undefined;
}
/**
 * Starts to watch every accepted tag.
 */
export declare function startMonitoring(): void;
/**
 * Stops to watch every target.
 */
export declare function stopMonitoring(): void;
/**
 * Sets the initial status for the bot, if one is set.
 * @param mode Whether to set the bot online (`true`) or offline (`false`)
 */
export declare function setStatus(mode: boolean): Promise<import("discord.js").Presence> | undefined;
