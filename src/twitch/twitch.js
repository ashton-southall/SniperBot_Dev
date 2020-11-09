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
const tmi = require("tmi.js");
const config = require('../config.json');
const {
  Wit,
  log
} = require('node-wit');
const log4js = require('log4js');
const faunadb = require('faunadb');
const q = faunadb.query;

// Query DB for user info
// Declare channelList variable for storing list of channels to join
// Create FaunaDB client
// Query FaunaDB database for channel list
// Page FaunaDB results => set channelList variable to those results
var channelList;
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

    // If ChannelList was not loaded on time throw an error and stop the script
    if (typeof channelList == undefined) {
      throw new Error(`Failed to load database info: "channelList" on time`);
    }

    // TMI options (links back to cinfig.json for most options)
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

    // Create New TMI Client
    // Create AI client
    // Log AI info
    const TMI = new tmi.Client(options)
    const AI = new Wit({
      accessToken: config.masterConfig.witToken
    });
    console.log(log);

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

    // Connect to twitch servers and join all channels
    TMI.connect();

    // TMI.on message
    // Runs for every message
    TMI.on('message', (channel, tags, message, self) => {

      // Ignore messages sent by SniperBot
      if (self) return;

      var sender;
      var querySender = fauna.paginate(q.Match(q.Index("twitch.users.allInfo"), tags.username))
      querySender.each(function (page) {
        sender = page
      })
      

      // Log message Contents
      console.log(`${channel} | ${tags.username} | ${message} || Self: ${self}`)

      // Check if user is blacklisted
      // Check if userInfo query "isBlacklisted" equals true or false
      // if false, continue
      // if true, timeout sender for 24 hours

      // Asynchronous function, check if query is finished, if not repeat check until query is finished
      async function waitForisBlacklistedResult() {
        if (typeof sender !== "undefined") {
          console.log(`running blacklist check`)
          console.log(sender)
          if (sender[0][5] == true) {
            console.log(`sender exists`)
            TMI.timeout(channel, tags.username, config.twitchConfig.blacklist_ban_time, config.twitchConfig.blacklist_ban_reason);
          } else if (sender.length == 0) {
            console.log(`Sender does not exist, creating entry`)
            fauna.query(q.Create(q.Collection("twitch_users"), {data: {"username": tags.username,"inChannel": false,"channelName": `#${tags.username}`,"isAdmin": false,"isBlacklisted": false}}))
          }
        } else {
          setTimeout(waitForisBlacklistedResult, 250);
        }
      }
      waitForisBlacklistedResult().catch(err => console.log(err))

      // If Message startswith !sniperbot
      if (message.toLowerCase().startsWith(`${config.masterConfig.prefix}sniperbot`)) {
        var action = message.split(' ')[1];

        if (action == 'join') {

          // Joins A Channel

          // Asynchronous function => Repeat check for inChannel until a value exists
          // Wait 250ms between each check
          // If inChannel == true notify user bot is already in that channel
          // If false create update DB entry to enable channel joining
          // if DB does not contain any information about user create DB entry for user
          async function waitForinChannelResult() {
            if (typeof sender !== "undefined") {
              if (sender[0][2] == true) {
                TMI.say(channel, `${tags.username} SniperBot is already in the channel`)
              } else if (sender[0][2] == false) {
                
                  fauna.query(q.Update(q.Ref(q.Collection('twitch_users'), sender[0][0]), {
                    data: {
                      inChannel: true
                    }
                  }, )).catch(error => console.log(error))
                  TMI.join(tags.username)
                    .then((data) => {
                      TMI.say(channel, `Successfully joined channel ${tags.username}`)
                    }).catch((err) => {
                      TMI.say(channel, `${tags.username} there was an error joining your channel, please try again later or submit a bug report at http://adfoc.us/54699276390696 Error: ${err}`)
                    });


              } else {
                fauna.query(q.Create(q.Collection("twitch_users"), {
                  data: {
                    "username": tags.username,
                    "inChannel": true,
                    "channelName": `#${tags.username}`,
                    "isAdmin": false,
                    "isBlacklisted": false
                  }
                }))
                TMI.join(tags.username)
                  .then((data) => {
                    TMI.say(channel, `Successfully joined channel ${tags.username}`)
                  }).catch((err) => {
                    TMI.say(channel, `${tags.username} there was an error joining your channel, please try again later or submit a bug report at http://adfoc.us/54699276390696 Error: ${err}`)
                  });
              }
            } else {
              setTimeout(waitForinChannelResult, 250);
            }
          }

          waitForinChannelResult().catch(error => console.log(error))

        } else if (action == 'leave') {

          // Leaves a channel

          // Asynchronous function => Repeat check for inChannel until a value exists
          // Wait 250ms between each check
          // If inChannel == true notify user bot is already in that channel
          // If false create update DB entry to enable channel joining
          // if DB does not contain any information about user create DB entry for user
          async function waitForinChannelResult() {
            if (typeof sender !== "undefined") {
              if (sender[0][2] == true) {
                  fauna.query(q.Update(q.Ref(q.Collection('twitch_users'), sender[0][0].id), {
                    data: {
                      inChannel: false
                    }
                  }, ))
                  TMI.part(tags.username)
                    .then((data) => {
                      TMI.say(channel, `Successfully left channel ${tags.username}`)
                    }).catch((err) => {
                      TMI.say(channel, `${tags.username} there was an error leaving your channel, please try again later or submit a bug report at http://adfoc.us/54699276390696 Error: ${err}`)
                    });

              } else if (sender[0][2] == false) {
                TMI.say(channel, `${tags.username} SniperBot is not in that channel`)

              } else {
                TMI.say(channel, `${tags.username} Database query returned null, please ensure sniperbot is in your channel before trying to remove it`)
              }
            } else {
              setTimeout(waitForinChannelResult, 250);
            }
          }

          waitForinChannelResult();

        } else {

          TMI.say(channel, `SniperBot is an Advanced Moderation Bot for Twitch and Discord that utilizes Artificial Intelligence to make Moderation Decisions. Add SniperBot to your Twitch Chanel or Discord Server today and experience next level moderation http://sniperbot.tk`);
        }
      }

      // Send Message Contents to AI
      // Log AI response
      // Get message intent from response (data)
      // If response matches banned term, timeout sender for 1 second
      async function getAIResponse() {
        AI.message(message)
          .then((data) => {
            console.log(JSON.stringify(data))
            if (data.intents[0]) {
              if (data.intents[0].name == 'Banned' && data.intents[0].confidence > 0.9) {
                if (data.traits) {
                  console.log(data.traits);
                  if (data.traits.Insult) {
                    logger.info(`Detected: "Insult" in message, Purging Messages From ${tags.username}`);
                    TMI.timeout(channel, tags.username, 1, config.masterConfig.automatedActionReason);
                  } else if (data.traits.Racism) {
                    logger.info(`Detected: "Racism" in message, Purging Messages From ${tags.username}`);
                    TMI.timeout(channel, tags.username, 1, config.masterConfig.automatedActionReason);
                  } else if (data.traits.Threat) {
                    logger.info(`Detected: "Threat" in message, Purging Messages From ${tags.username}`);
                    TMI.timeout(channel, tags.username, 1, config.masterConfig.automatedActionReason);
                  } else if (data.traits.Toxicity) {
                    logger.info(`Detected" "Toxicity" in message, Purging Messages From ${tags.username}`);
                    TMI.timeout(channel, tags.username, 1, config.masterConfig.automatedActionReason);
                  }
                }
              }
            }
          })
          .catch(console.error)
      }
      getAIResponse()
    });

    // NOTE: anything past this point will not be able to reference anything inside of the delayed script
  } else {
    setTimeout(runMaster, 100);
  }
}

// Run main (delayed) script
runMaster();