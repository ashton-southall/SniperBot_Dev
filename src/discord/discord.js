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
const discordjs = require('discord.js');
const faunadb = require('faunadb');
const q = faunadb.query ;
const SBconfig = require('../config.json');
const embeds = require('./submodules/embeds.js');
const sendDM = require('./submodules/sendDM.js');
const manualModeration = require('./submodules/manualModeration.js');
const blacklist = require('./submodules/blacklist.js');
const AIActions = require('./submodules/ai.js');
const {Wit,log} = require('node-wit')

// Create DiscordJS client
const discord = new discordjs.Client();

// Configure Dependencies
const AI = new Wit({accessToken: SBconfig.masterConfig.witToken})
const fauna = new faunadb.Client({secret: SBconfig.masterConfig.faunaDbToken})

// Set bot status on interval
discord.once('ready', () => {setInterval(() => {discord.user.setActivity(SBconfig.discordConfig.activity, {type: SBconfig.discordConfig.activity_type})}, 10000)});

// Login to discord with bot token
discord.login(SBconfig.discordConfig.token);

// Runs for every message
discord.on('message', message => {
    if (message.author.bot) return
    console.log(`${message.author.id} | ${message}`);
    if (message.channel.type == "dm") {
        sendDM.sendReply(discordjs, discord, message, embeds).catch(error => console.log(error));
    }
    var sender
    async function querySenderInfo() {const querySender = fauna.paginate(q.Match(q.Index("discord.users.allInfo"), message.author.id));querySender.each(function (page) {sender = page});}
    querySenderInfo().catch(error => console.log(error));
    async function waitForQuery() {
        if (typeof sender !== 'undefined') {
            blacklist.checkisBlacklisted(SBconfig, discordjs, discord, message, sender);
            manualModeration.purge(SBconfig, discordjs, discord, message, sender);
            manualModeration.kick(SBconfig, discordjs, discord, message, sender);
            manualModeration.ban(SBconfig, discordjs, discord, message, sender);
            AIActions.sendMessage(AI, message, embeds.messageDeleted)
        } else {
            setTimeout(waitForQuery, 250);
        }
    }
   waitForQuery().catch(error => console.log(error));
})