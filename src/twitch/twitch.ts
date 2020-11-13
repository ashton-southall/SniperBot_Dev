// Master bot script fot twitch module
// #################################################
// Confidential, DO NOT SHARE THIS CODE
//
// #### TO DO ####
//
// Add !leave command
// **Critical** Add ability to change inChannel value when joining channels for users who already have a document in the database

// Imports
// ###########################
// TMI (Twitch bot library)
// Config File (Contains Secrets)
// WIT.AI (AI System for reading messages)
// Log4JS (Creates logs for bot actions)
// FaunaDB (Data Storage)
//@ts-ignore
const tmi = require("tmi.js");//@ts-ignore
const config = require('../config.json');//@ts-ignore
const {Wit,log} = require('node-wit');//@ts-ignore
const log4js = require('log4js');//@ts-ignore
const faunadb = require('faunadb');//@ts-ignore
const q = faunadb.query;//@ts-ignore
const blacklist = require('./submodules/blacklist.ts');
const channelmanagement = require('./submodules/channelmanagement.ts');
const AIActions = require('./submodules/ai.ts');

// Query DB for user info
var channelList;//@ts-ignore
const fauna = new faunadb.Client({
  secret: config.masterConfig.faunaDbToken
});
const channels = fauna.paginate(q.Match(q.Index("twitch.channels"), true));
channels.each(function (page) {
  channelList = page
});

// Main script | waitFor database results before running
function runMaster() {
  if (typeof channelList !== "undefined") {

    // TMI options
    let options = {
      options: {
        debug: config.twitchConfig.options.debug
      },
      connection: {
        reconnect: config.twitchConfig.options.reconnect,
        secure: config.twitchConfig.options.secure
      },
      identity: {
        username: config.twitchConfig.connection.username,
        password: config.twitchConfig.connection.password
      },
      channels: channelList
    };
    // Log4JS Options
    log4js.configure({
      appenders: {
        twitch: {
          type: 'file',
          filename: '/src/logs/twitch.log'
        }
      },
       categories: {
        default: {
          appenders: ['twitch'],
          level: 'info'
        }
      }
    })
    var logger = log4js.getLogger('twitch');
    logger.level = 'info';

    // Create New TMI + AI Client
    const TMI = new tmi.Client(options)
    const AI = new Wit({
      accessToken: config.masterConfig.witToken
    });
    console.log(log);

    // Connect to twitch servers and join all channels
    TMI.connect();

    // Runs for every message
    TMI.on('message', (channel, tags, message, self) => {

      // Ignore messages sent by SniperBot
      if (self) return;

      var sender;
      var channelOptions;
      var querySender = fauna.paginate(q.Match(q.Index("twitch.users.allInfo"), tags.username))
      querySender.each(function (page) {
        sender = page
      })
      var queryChannelOptions = fauna.paginate(q.Match(q.Index("twitch.users.channelOptions"), tags.username))
      queryChannelOptions.each(function (page) {
        channelOptions = page
      })

      async function waitForSenderQuery() {
        if (typeof sender !== "undefined") {
          console.log(sender)
          // Log message Contents
          console.log(`${channel} | ${tags.username} | ${message} || Self: ${self}`)

          // Check if user is blacklisted 
          blacklist.checkIfBlacklisted(sender, TMI, channel, tags)

          // If Message startswith !sniperbot
          if (message.toLowerCase().startsWith(`${config.masterConfig.prefix}sniperbot`)) {
            var action = message.split(' ')[1];

            // Join A Channel
            if (action == 'join') {
              console.log(`Joining Channel`)
              channelmanagement.joinChannel(sender, TMI, channel, tags).catch(error => console.log(error))
            } else if (action == 'leave') {

              // Leave A Channel
              channelmanagement.leaveChannel(sender, TMI, channel, tags)
            } else {
              TMI.say(channel, `SniperBot is an Advanced Moderation Bot for Twitch and Discord that utilizes Artificial Intelligence to make Moderation Decisions. Add SniperBot to your Twitch Chanel or Discord Server today and experience next level moderation http://sniperbot.tk`);
            }
          }

          async function waitForChannelQuery() {
            if (typeof channelOptions !== "undefined") {
              if (message.toLowerCase().startsWith(`${config.masterConfig.prefix}options`)) {
                if (`#${tags.username}` == channel) {
                  TMI.say(channel, `Channel options for channel ${tags.username}: insultThreashold: ${channelOptions[0][0]}, racismThreashold: ${channelOptions[0][1]}, threatThreshold: ${channelOptions[0][2]}, toxicityThreashold ${channelOptions[0][3]}`)
                }
              }
              AIActions.sendMessage(logger, config, AI, TMI, channel, tags, message, channelOptions);
            } else {
              setTimeout(waitForChannelQuery, 250);
            }
          }
          waitForChannelQuery().catch(error => console.log(error));
          
            } else {
              setTimeout(waitForSenderQuery, 250)
            }
      }
      waitForSenderQuery().catch(error => console.log(error));
      
    });
    // NOTE: anything past this point will not be able to reference anything inside of the delayed script
  } else {
    setTimeout(runMaster, 100);
  }
}

// Run main (delayed) script
runMaster();