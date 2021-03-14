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
const {Wit,log} = require('node-wit');
const config = require('../config.json');
const handler = require('./handler.js');

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
    if (message.author.bot) return;
    if (message.channel.type == "dm") {
        const sendDM = require('./submodules/sendDM.js');
        sendDM.sendReply(discordjs, discord, message).catch(error => console.log(error));
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
                createServer();
                setTimeout(serverQuery, 10000);
            } else {
                waitForQuery();
            }
        }
        senderQuery();
        serverQuery();
    }

    async function waitForQuery() {
        if (typeof sender !== 'undefined' && typeof server !== "undefined") {
            console.log(`====Discord====`);
            console.log(`Guild: ${message.guild.id} | Author: ${message.author.id} | MSG: ${message}`);
            console.log(`Sender Record: ${sender}`);
            console.log(`Server Record: ${server}`);
            const AIActions = require('./submodules/ai.js');
            AIActions.sendMessage(AI, message).catch(error => console.log(`ERROR: ${error}`));
            handler.run(config, discordjs, discord, message, sender, server, fauna, q);
        } else {
            setTimeout(waitForQuery, 100);
        }
    }
    runQueries().catch(error => console.log(error));

    function createServer() {
        fauna.query(q.Create(q.Collection("discord_servers"), {
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
    }
})