"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
// eslint-disable-next-line no-unused-vars
var discord_js_1 = require("discord.js");
var app_1 = require("./app");
/**
 * Class for every accepted target.
 */
var Target = /** @class */ (function () {
    // #endregion
    /**
     * @param name A codename that will help recognize the target (only for debugging purposes).
     * @param id The ID of the target. Make sure the target is connected to the bot through at least one guild.
     * @param timeout The number of minutes the target has to be offline before the bot notifies you.
     */
    function Target(name, id, timeout) {
        this.name = name;
        this.id = id;
        this.timeout = timeout;
    }
    /**
     * Starts watching for the target to go offline.
     * @param refresh_ms The number of ms to run the cycle with.
     */
    Target.prototype.startWatching = function (refresh_ms) {
        var _this = this;
        this.stop();
        var watch = function () { return __awaiter(_this, void 0, void 0, function () {
            var isOnline;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.check()];
                    case 1:
                        isOnline = _a.sent();
                        if (isOnline === false) {
                            this.offlineSince = now();
                            this.startAlert(refresh_ms);
                            console.log((this.longName() || this.name + " (" + this.id + ")") + 'has been found offline, timer started.');
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        this.interval = setInterval(watch, refresh_ms);
        watch();
    };
    /**
     * Starts watching when the bot is found offline: after some time, it'll send the notification message and it'll edit it when the target comes back online.
     * @param refresh_ms The number of ms to run the cycle with.
     */
    Target.prototype.startAlert = function (refresh_ms) {
        var _this = this;
        this.stop();
        var alert = function () { return __awaiter(_this, void 0, void 0, function () {
            var isOnline, message, str, msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.check()];
                    case 1:
                        isOnline = _a.sent();
                        if (!(isOnline === true)) return [3 /*break*/, 2];
                        if (this.offlineSince && (+(now()) - +(this.offlineSince)) > this.timeout && this.lastMessage) {
                            this.lastMessage.edit(":white_check_mark: `" + (this.cachedUser ? longName(this.cachedUser) : this.name) + "` is now back online!");
                            this.lastMessage = undefined;
                        }
                        this.offlineSince = undefined;
                        this.startWatching(refresh_ms);
                        console.log((this.longName() || this.name + " (" + this.id + ")") + 'has come back online, alert canceled.');
                        return [3 /*break*/, 7];
                    case 2:
                        if (!(isOnline === false)) return [3 /*break*/, 7];
                        if (!this.offlineSince)
                            this.offlineSince = now();
                        if (!((+(now()) - +(this.offlineSince)) > this.timeout * 60000 && !this.lastMessage)) return [3 /*break*/, 4];
                        return [4 /*yield*/, app_1.send_to.send(":red_circle: `" + (this.cachedUser ? longName(this.cachedUser) : this.name) + "` has been offline for `" + this.getDowntime() + "` minutes.")];
                    case 3:
                        message = _a.sent();
                        if (message instanceof Array)
                            message = message[0];
                        this.lastMessage = message;
                        return [3 /*break*/, 6];
                    case 4:
                        if (!this.lastMessage) return [3 /*break*/, 6];
                        str = ":red_circle: `" + (this.cachedUser ? longName(this.cachedUser) : this.name) + "` has been offline for `" + this.getDowntime() + "` minutes.";
                        if (!(str != this.lastMessage.content)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.lastMessage.edit(str)];
                    case 5:
                        msg = _a.sent();
                        if (msg instanceof Array)
                            msg = msg[0];
                        this.lastMessage = msg;
                        _a.label = 6;
                    case 6:
                        console.log((this.longName() || this.name + " (" + this.id + ")") + 'has ecceeded maximum time, notifcation sent.');
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        this.interval = setInterval(alert, refresh_ms);
        alert();
    };
    /**
     * Clears the current interval.
     */
    Target.prototype.stop = function () {
        if (this.interval)
            clearInterval(this.interval);
    };
    /**
     * Returns whether the target is online; if the target is unreachable it stop monitoring it.
     */
    Target.prototype.check = function () {
        return __awaiter(this, void 0, void 0, function () {
            var user, status_1, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_1.client.fetchUser(this.id)];
                    case 1:
                        user = _a.sent();
                        if (user) {
                            this.cachedUser = user;
                            status_1 = user.presence.status;
                            if (status_1 == 'offline')
                                return [2 /*return*/, false];
                            else
                                return [2 /*return*/, true];
                        }
                        else {
                            this.stop();
                            error = "Target '" + this.name + " (id: " + this.id + ") has become unreachable: I've stopped watching it.";
                            app_1.send_to.send(error);
                            app_1.client.emit('error', error);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the rounded number of minutes the target has been offline.
     */
    Target.prototype.getDowntime = function () {
        return Math.round((+(now()) - +(this.offlineSince || now())) / 60000);
    };
    /**
     * Returns the displayable long name of the last cached user for the target.
     */
    Target.prototype.longName = function () {
        return this.cachedUser ? longName(this.cachedUser) : undefined;
    };
    return Target;
}());
exports.Target = Target;
// #endregion
// #region Utility functions
/**
 * Type guard for a text channel.
 * @param c The element you want to check.
 */
function isTextChannel(c) {
    return (c instanceof discord_js_1.Channel && c.type == 'text');
}
exports.isTextChannel = isTextChannel;
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
function longName(user) {
    return user.tag + " (" + user.id + ")";
}
// #endregion
