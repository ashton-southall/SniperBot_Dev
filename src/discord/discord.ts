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
declare function require(name:string);
const discordjs = require('discord.js');
const faunadb = require('faunadb');
const config = require('../config.json');
const {wit, log} = require('node-wit');
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
const AI = new wit({accessToken: config.masterConfig.witToken});

// When Ready
// Run when discord bot is ready and waiting for login command
// ##########################
// Set bot status on interval
discord.once('ready', () => {
    setInterval(() => {
        discord.user.setActivity('activity', {
            type: config.discordConfig.activity_type
        });
    }, 10000);
});

// Login to discord with bot token
discord.login(config.discordConfig.token);

// discord.on message 
// Runs for every message 
discord.on('message', message => {
    
})