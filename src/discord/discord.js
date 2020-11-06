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
//  Master bot script for Discord module
// ############################################
// Confidential, DO NOT SHARE THIS CODE
//
// Imports
// ##########################
// discord.js (Discord bot library)
// FaunaDB (Data Storage)
// config (config.json file containing client secrets)
// WIT.AI (AI system for interpreting messages)
// Log4JS (Generates logs containing bot actions)
//@ts-ignore
var discordjs = require('discord.js');
var faunadb = require('faunadb');
var q = faunadb.query; //@ts-ignore
var config = require('../config.json');
var embeds = require('./embeds.js');
var _a = require('node-wit'), Wit = _a.Wit, log = _a.log;
var log4js = require('log4js');
// Create DiscordJS client
var discord = new discordjs.Client();
// Configure Log4JS
log4js.configure({
    appenders: {
        discord: {
            type: 'file',
            filename: 'src/logs/discord.log'
        }
    },
    categories: {
        "default": {
            appenders: ["discord"],
            level: "info"
        }
    }
});
var logger = log4js.getLogger('discord');
logger.level = 'info';
// Configure Dependencies
var AI = new Wit({
    accessToken: config.masterConfig.witToken
});
var fauna = new faunadb.Client({
    secret: config.masterConfig.faunaDbToken
});
// When Ready
// Run when discord bot is ready and waiting for login command
// ##########################
// Set bot status on interval
discord.once('ready', function () {
    setInterval(function () {
        discord.user.setActivity(config.discordConfig.activity, {
            type: config.discordConfig.activity_type
        });
    }, 10000);
});
// Login to discord with bot token
discord.login(config.discordConfig.token);
// discord.on message
// Runs for every message
discord.on('message', function (message) {
    if (message.author.bot)
        return;
    // DM Communication
    if (message.channel.type == "dm") {
        var newMessageEmbed = new discordjs.MessageEmbed().setColor('#ff5757').setTitle("New Message").addField("User ID: " + message.author.id, "" + message, true).setTimestamp().setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');
        message.author.send(embeds.DMReply);
        discord.channels.cache.get("707636583121158174").send(newMessageEmbed);
    }
    // Query Database for userInfo
    var sender;
    var querySender = fauna.paginate(q.Match(q.Index("discord.users.allInfo"), message.author.id));
    querySender.each(function (page) {
        sender = page;
    });
    // Log message to console
    console.log(message.author.id + " | " + message);
    // Check is user is blacklisted
    // Asynchronous function, check if user query has finished then check contents of isBlacklisted
    // if true, kick user from server
    // if false do nothing
    function waitForisBlacklistedResult() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (typeof sender !== "undefined") {
                    console.log(sender);
                    if (sender.length !== 0) {
                        if (sender[0][3] == true) {
                            message.member.kick().then(function (member) {
                                message.channel.send(embeds.blacklistKick);
                                message.author.send(embeds.blacklistDM);
                            })["catch"](function (error) { return message.channel.send("Hmm, there was a problem timing out blacklisted user " + message.author.username + ", Only bad very bad people are put on the blacklist so keep an eye on them, okay? error: " + error); });
                        }
                        else if (sender[0][3] == false) {
                            message.channel.send("This message is to confirm to the developer that a feature is working. please ignore me");
                        }
                        else {
                        }
                    }
                    else {
                        fauna.query(q.Create(q.Collection("discord_users"), { data: { "id": message.author.id, "username": message.author.username, "isAdmin": false, "isBlacklisted": false } }));
                    }
                }
                else {
                    setTimeout(waitForisBlacklistedResult, 250);
                }
                return [2 /*return*/];
            });
        });
    }
    waitForisBlacklistedResult()["catch"](function (error) { return console.log(error); });
});
