// Master bot script for Discord module
// ############################################
// Confidential, DO NOT SHARE THIS CODE
// ############################################
// Imports
// ##########################
require('dotenv').config()
const discordjs = require('discord.js');
const faunadb = require('faunadb');
const q = faunadb.query;
const {
    Wit,
    log
} = require('node-wit');
const config = require('../config.json');
const embeds = require('./submodules/embeds.js');
const sendDM = require('./submodules/sendDM.js');
const manualModeration = require('./submodules/manualModeration.js');
const blacklist = require('./submodules/blacklist.js');
const AIActions = require('./submodules/ai.js');
const commands = require('./submodules/commands.js');
const options = require('./submodules/options.js');

// Create DiscordJS client
const discord = new discordjs.Client();

// Configure Dependencies
const AI = new Wit({
    accessToken: process.env.WIT_TOKEN
});
console.log(`====Discord====`);
console.log(log);
console.log(`========`);
const fauna = new faunadb.Client({
    secret: process.env.FAUNA_TOKEN
});

// Set bot status on interval
discord.once('ready', () => {
    setInterval(() => {
        discord.user.setActivity(config.discordConfig.activity, {
            type: config.discordConfig.activity_type
        })
    }, 10000)
});

// Login to discord with bot token
discord.login(process.env.DISCORD_TOKEN);

// Runs for every message
discord.on('message', message => {
    if (message.author.bot) return
    if (message.channel.type == "dm") {
        sendDM.sendReply(discordjs, discord, message, embeds).catch(error => console.log(error));
    };
    var server;
    var sender;
    async function runQueries() {
        async function senderQuery() {
            const querySender = await fauna.paginate(q.Match(q.Index("discord.users.allInfo"), message.author.id));
            await querySender.each(function (page) {
                sender = page
            });
        }
        async function serverQuery() {
            const queryServer = await fauna.paginate(q.Match(q.Index("discord.servers"), message.guild.id));
            await queryServer.each(function (page) {
                server = page
            });
            if (server.length == 0) {
                await fauna.query(q.Create(q.Collection("discord_servers"), {
                    data: {
                        "id": message.guild.id,
                        "options": {
                            "insultThreshold": "6",
                            "racismThreshold": "6",
                            "threatThreshold": "6",
                            "toxicityThreshold": "6"
                        }
                    }
                })).catch(error => `ERROR: ${error}`);
                setTimeout(serverQuery, 10000)
            } else {
                waitForQuery()
            }
        }
        senderQuery();
        serverQuery();
    }

    async function waitForQuery() {
        if (typeof sender !== 'undefined' && typeof server !== "undefined") {
            console.log(`====Discord====`)
            console.log(`Guild: ${message.guild.id} | Author: ${message.author.id} | MSG: ${message}`);
            console.log(`Sender Record: ${sender}`)
            console.log(`Server Record: ${server}`)
            options.doChannelOptions(config, discordjs, discord, message, sender, server, fauna, q).catch(error => console.log(error))
            blacklist.checkisBlacklisted(config, discordjs, discord, message, sender);
            manualModeration.purge(config, discordjs, discord, message, sender);
            manualModeration.kick(config, discordjs, discord, message, sender);
            manualModeration.ban(config, discordjs, discord, message, sender);
            AIActions.sendMessage(AI, message, embeds.messageDeleted).catch(error => console.log(`ERROR: ${error}`))
            if (message.content == `${config.masterConfig.prefix}ping`) {
                commands.ping(discord, message)
            }
            console.log(`========`)
        } else {
            setTimeout(waitForQuery, 100);
        }
    }
    runQueries().catch(error => console.log(error));
})