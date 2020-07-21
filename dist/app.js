"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var custom_types_1 = require("./custom_types");
var discord_js_1 = require("discord.js");
// #region Exported variables
/**
 * The client you're using.
 */
exports.client = new discord_js_1.Client();
/**
 * Whether the bot is active.
 */
exports.on = true;
// #endregion
exports.client.on('error', console.error);
exports.client.on('warn', console.warn);
exports.client.on('debug', console.log);
/**
 * Main class to use: see the docs for further reference.
 */
var Bot = /** @class */ (function () {
    function Bot(inputSettings, callback) {
        var _this = this;
        exports.settings = checkSettings(inputSettings);
        exports.client.emit('debug', 'Using the following settings:\n' + JSON.stringify(exports.settings, null, 2));
        exports.client.login(exports.settings.token)
            .then(function () {
            if (callback)
                callback(_this);
        }).catch(console.error);
    }
    /**
     * Adds a new target on-the-go, returns the added target or the rejection error.
     * @param set The target in the same format as in the config: `[codeName, discordID, timeout]`.
     */
    Bot.prototype.add = function (set) {
        return __awaiter(this, void 0, void 0, function () {
            var name, id, timeout, user, target, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = set[0], id = set[1], timeout = set[2];
                        return [4 /*yield*/, exports.client.fetchUser(id)];
                    case 1:
                        user = _a.sent();
                        if (user) {
                            target = new custom_types_1.Target(name, id, timeout);
                            index = exports.list.push(target) - 1;
                            exports.list[index].startWatching(exports.settings.refresh);
                            return [2 /*return*/, target];
                        }
                        else
                            return [2 /*return*/, 'Couldn\'t find user with that id.'];
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes a target on-the-go, returns the removed target (if one was found).
     * @param id The Discord id of the target.
     */
    Bot.prototype.remove = function (id) {
        for (var i = 0; i < exports.list.length; i++) {
            var target = exports.list[i];
            if (target.id == id) {
                target.stop();
                return exports.list.splice(i, 1);
            }
        }
    };
    return Bot;
}());
exports.Bot = Bot;
exports.client.on('ready', function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 5]);
                return [4 /*yield*/, loadSendTo()];
            case 1:
                exports.send_to = _a.sent();
                return [4 /*yield*/, loadTargets()];
            case 2:
                exports.list = _a.sent();
                startMonitoring();
                require('./commands');
                setStatus(true);
                return [3 /*break*/, 5];
            case 3:
                error_1 = _a.sent();
                return [4 /*yield*/, exports.client.destroy()];
            case 4:
                _a.sent();
                console.error('Fatal error detected, bot shut down. Error:\n' + error_1);
                process.exit(1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// #region Utility functions
/**
 * Reads the user input, checks whether necessary parts were included and fills optional ones.
 * @param settings
 */
function checkSettings(settings) {
    var _a;
    // @ts-ignore
    var result = {};
    if (settings.commands) {
        var _b = settings.commands, on_1 = _b.on, off = _b.off, list_1 = _b.list;
        result.commands = {
            on: typeof on_1 == 'boolean' ? on_1 : true,
            off: typeof off == 'boolean' ? off : true,
            list: typeof list_1 == 'boolean' ? list_1 : true,
            help: true
        };
    }
    else {
        result.commands = {
            on: true,
            off: true,
            list: true,
            help: true
        };
    }
    result.list = settings.list || [];
    result.refresh = settings.refresh || 5000;
    if (!settings.owner_id)
        throw new Error('There has to be a main owner ID.');
    result.owners = [settings.owner_id];
    if (typeof settings.other_owners == 'string')
        result.owners.push(settings.other_owners);
    else if (settings.other_owners instanceof Array)
        (_a = result.owners).push.apply(_a, settings.other_owners);
    result.send_to = settings.send_to || settings.owner_id;
    result.status = settings.status || {};
    if (!settings.token)
        throw new Error('There has to be a bot token!');
    else
        result.token = settings.token;
    return result;
}
/**
 * Parses the `send_to` from the settings and return its `User` or `TextChannel` result.
 */
function loadSendTo() {
    return __awaiter(this, void 0, void 0, function () {
        var id, splitted, userID, user, error_2, guildID, channelID, guild, channel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = exports.settings.send_to;
                    splitted = id.split('/');
                    if (!(splitted.length == 1)) return [3 /*break*/, 5];
                    userID = splitted[0];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, exports.client.fetchUser(userID)];
                case 2:
                    user = _a.sent();
                    return [2 /*return*/, user];
                case 3:
                    error_2 = _a.sent();
                    throw new Error("The bot can't find any user with this id: '" + userID + "'. Please check your settings: if you left the 'send_to' field empty then check the owner id; if you wrote a channel id, rewrite that as 'guildID/channelID'.");
                case 4: return [3 /*break*/, 6];
                case 5:
                    guildID = splitted[0], channelID = splitted[1];
                    guild = exports.client.guilds.get(guildID);
                    if (guild) {
                        channel = guild.channels.get(channelID);
                        if (channel) {
                            if (custom_types_1.isTextChannel(channel))
                                return [2 /*return*/, channel];
                            else
                                throw new Error("The bot has found your channel, but doesn't seem to be a text channel: type " + channel.type + ". Please check your channel ID.");
                        }
                        else
                            throw new Error("The bot can't find any channel with this id in your guild (" + guildID + "): '" + channelID + "'. Please check your settings: it should be written as 'guildID/channelID'.'");
                    }
                    else
                        throw new Error("The bot can't find any guild with this id: '" + guildID + "'. Please check your settings: it should be written as 'guildID/channelID'.");
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * Returns the list with all the accepted targets; sends a message with the rejected ones.
 */
function loadTargets() {
    return __awaiter(this, void 0, void 0, function () {
        var rejected, result, _i, _a, current, name_1, id, timeout, user, msg, _b, rejected_1, rejection;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    rejected = [];
                    result = [];
                    _i = 0, _a = exports.settings.list;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    current = _a[_i];
                    name_1 = current[0], id = current[1], timeout = current[2];
                    return [4 /*yield*/, exports.client.fetchUser(id)];
                case 2:
                    user = _c.sent();
                    if (user)
                        result.push(new custom_types_1.Target(name_1, id, timeout));
                    else
                        rejected.push({
                            target: current,
                            reason: 'Couldn\'t find user with that id.'
                        });
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (rejected.length) {
                        msg = 'The following targets have been rejected:';
                        for (_b = 0, rejected_1 = rejected; _b < rejected_1.length; _b++) {
                            rejection = rejected_1[_b];
                            msg += "\n`" + rejection.target[0] + " (" + rejection.target[1] + ")` -> " + rejection.reason;
                        }
                        msg += (result.length ? "\n`" + result.length + "` targets have been loaded." : 'No other targets have been loaded.');
                        exports.send_to.send(msg);
                        exports.client.emit('error', msg);
                    }
                    else if (!result.length) {
                        exports.client.emit('warn', 'WARN! No targets have been set in the code settings.');
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
/**
 * Starts to watch every accepted tag.
 */
function startMonitoring() {
    for (var _i = 0, list_2 = exports.list; _i < list_2.length; _i++) {
        var target = list_2[_i];
        target.startWatching(exports.settings.refresh);
    }
}
exports.startMonitoring = startMonitoring;
/**
 * Stops to watch every target.
 */
function stopMonitoring() {
    for (var _i = 0, list_3 = exports.list; _i < list_3.length; _i++) {
        var target = list_3[_i];
        target.stop();
    }
}
exports.stopMonitoring = stopMonitoring;
/**
 * Sets the initial status for the bot, if one is set.
 * @param mode Whether to set the bot online (`true`) or offline (`false`)
 */
function setStatus(mode) {
    exports.on = mode;
    var status = exports.settings.status[mode ? 'on' : 'off'];
    if (status)
        return exports.client.user.setPresence({
            status: mode ? 'online' : 'dnd',
            game: status
        });
    else
        return exports.client.user.setPresence({
            status: mode ? 'online' : 'dnd',
            game: {
                name: ''
            }
        });
}
exports.setStatus = setStatus;
// #endregion
