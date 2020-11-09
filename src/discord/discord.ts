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
const discordjs = require('discord.js');
const faunadb = require('faunadb');
const q = faunadb.query ;
const SBconfig = require('../config.json');
const embeds = require('./submodules/embeds.ts');
const sendDM = require('./submodules/sendDM.ts');
const manualModeration = require('./submodules/manualModeration.ts');
const blacklist = require('./submodules/blacklist.ts');
const AIParse = require('./submodules/ai.ts');
const {
    Wit,
    log
} = require('node-wit')
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
logger.level = 'info'

// Configure Dependencies
const AI = new Wit({
    accessToken: SBconfig.masterConfig.witToken
})
const fauna = new faunadb.Client({
    secret: SBconfig.masterConfig.faunaDbToken
})

// Set bot status on interval
discord.once('ready', () => {
    setInterval(() => {
        discord.user.setActivity(SBconfig.discordConfig.activity, {
            type: SBconfig.discordConfig.activity_type
        })
    }, 10000)
});

// Login to discord with bot token
discord.login(SBconfig.discordConfig.token);

// Runs for every message
discord.on('message', message => {

    if (message.author.bot) return

    // Log message to console
    console.log(`${message.author.id} | ${message}`);

    // DM Communication
    if (message.channel.type == "dm") {
        sendDM.sendReply(discordjs, discord, message, embeds).catch(error => console.log(error));
    }

    // Query Database for userInfo
    var sender
    async function querySenderInfo() {
        const querySender = fauna.paginate(q.Match(q.Index("discord.users.allInfo"), message.author.id));
        querySender.each(function (page) {
            sender = page
        });
    }
    querySenderInfo().catch(error => console.log(error));

    async function waitForQuery() {
        if (typeof sender !== 'undefined') {
            blacklist.checkisBlacklisted(SBconfig, discordjs, discord, message, sender);

            // !purge
            manualModeration.purge(SBconfig, discordjs, discord, message, sender);

            // !kick
            manualModeration.kick(SBconfig, discordjs, discord, message, sender);

            // !ban
            manualModeration.ban(SBconfig, discordjs, discord, message, sender);
        } else {
            setTimeout(waitForQuery, 250);
        }
    }
   waitForQuery().catch(error => console.log(error));
})