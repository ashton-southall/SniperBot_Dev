//  Master bot script for Discord module
// ############################################
// Confidential, DO NOT SHARE THIS CODE
// ############################################
// Imports
// ##########################
// discord.js (Discord bot library)
// FaunaDB (Data Storage)
// config (config.json file containing client secrets)
// WIT.AI (AI system for interpreting messages)
// Log4JS (Generates logs containing bot actions)
//@ts-ignore
const discordjs = require('discord.js')
const faunadb = require('faunadb')
const q = faunadb.query //@ts-ignore
const config = require('../config.json')//@ts-ignore
const embeds = require('./submodules/embeds.ts')
const {
    Wit,
    log
} = require('node-wit')
const log4js = require('log4js')

// Create DiscordJS client
const discord = new discordjs.Client()

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
var logger = log4js.getLogger('discord')
logger.level = 'info'

// Configure Dependencies
const AI = new Wit({
    accessToken: config.masterConfig.witToken
})
const fauna = new faunadb.Client({
    secret: config.masterConfig.faunaDbToken
})

// Set bot status on interval
discord.once('ready', () => {
    setInterval(() => {
        discord.user.setActivity(config.discordConfig.activity, {
            type: config.discordConfig.activity_type
        })
    }, 10000)
});

// Login to discord with bot token
discord.login(config.discordConfig.token);

// Runs for every message
discord.on('message', message => {
    if (message.author.bot) return

    // DM Communication
    if (message.channel.type == "dm") {
        const sendDM = require('./submodules/sendDM.ts').catch(error => console.log(error))
        sendDM.sendReply(discordjs, discord, message, embeds).catch(error => console.log(error))
    }

    // Query Database for userInfo
    const dbQuery = require('./submodules/dbQuery.ts')
    var sender
    dbQuery.querySenderInfo(fauna, q, message).catch(error => console.log(error)).then(sender => sender)

    // Log message to console
    console.log(`${message.author.id} | ${message}`)

    // Check is user is blacklisted
    const blacklistManager = require('./submodules/blacklistManager.ts')
    blacklistManager.checkisBlacklisted(sender, message).catch(error => console.log(error))
})