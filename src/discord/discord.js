const discordjs = require('discord.js');
const faunadb = require('faunadb');
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
// Configure WIT AI
const AI = new Wit({ accessToken: config.masterConfig.witToken });
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
});
