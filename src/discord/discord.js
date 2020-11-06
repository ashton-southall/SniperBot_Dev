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
const discordjs = require('discord.js');
const faunadb = require('faunadb');
const q = faunadb.query; //@ts-ignore
const config = require('../config.json');
const embeds = require('./embeds.js');
const { Wit, log } = require('node-wit');
const log4js = require('log4js');
// Create DiscordJS client
const discord = new discordjs.Client();
// Configure Log4JS
log4js.configure({
    appenders: {
        discord: {
            type: 'file',
            filename: 'src/logs/discord.log'
        }
    },
    categories: {
        default: {
            appenders: ["discord"],
            level: "info"
        }
    }
});
var logger = log4js.getLogger('discord');
logger.level = 'info';
// Configure Dependencies
const AI = new Wit({
    accessToken: config.masterConfig.witToken
});
const fauna = new faunadb.Client({
    secret: config.masterConfig.faunaDbToken
});
// When Ready
// Run when discord bot is ready and waiting for login command
// ##########################
// Set bot status on interval
discord.once('ready', () => {
    setInterval(() => {
        discord.user.setActivity(config.discordConfig.activity, {
            type: config.discordConfig.activity_type
        });
    }, 10000);
});
// Login to discord with bot token
discord.login(config.discordConfig.token);
// discord.on message
// Runs for every message
discord.on('message', message => {
    if (message.author.bot)
        return;
    // DM Communication
    if (message.channel.type == "dm") {
        const newMessageEmbed = new discordjs.MessageEmbed().setColor('#ff5757').setTitle(`New Message`).addField(`User ID: ${message.author.id}`, `${message}`, true).setTimestamp().setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');
        message.author.send(embeds.DMReply);
        discord.channels.cache.get("707636583121158174").send(newMessageEmbed);
    }
    // Query Database for userInfo
    var sender;
    const querySender = fauna.paginate(q.Match(q.Index("discord.users.allInfo"), message.author.id));
    querySender.each(function (page) {
        sender = page;
    });
    // Log message to console
    console.log(`${message.author.id} | ${message}`);
    // Check is user is blacklisted
    // Asynchronous function, check if user query has finished then check contents of isBlacklisted
    // if true, kick user from server
    // if false do nothing
    async function waitForisBlacklistedResult() {
        if (typeof sender !== "undefined") {
            console.log(sender);
            if (sender.length !== 0) {
                if (sender[0][3] == true) {
                    message.member.kick().then(() => {
                        message.channel.send(embeds.blacklistKick);
                        message.author.send(embeds.blacklistDM);
                    }).catch(error => message.channel.send(`Hmm, there was a problem timing out blacklisted user ${message.author.username}, Only bad very bad people are put on the blacklist so keep an eye on them, okay? error: ${error}`));
                }
                else if (sender[0][3] == false) {
                    message.channel.send(`This message is to confirm to the developer that a feature is working. please ignore me`);
                }
            }
            else {
                fauna.query(q.Create(q.Collection("discord_users"), { data: { "id": message.author.id, "username": message.author.username, "isAdmin": false, "isBlacklisted": false } }));
            }
        }
        else {
            setTimeout(waitForisBlacklistedResult, 250);
        }
    }
    waitForisBlacklistedResult().catch(error => console.log(error));
});
