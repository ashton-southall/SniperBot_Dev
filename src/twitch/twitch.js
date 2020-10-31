// Imports
const tmi = require("tmi.js"); // TMI (Twitch bot library)
const config = require('../config.json'); // Config File (Contains Secrets)
const { Wit, log } = require('node-wit'); // WIT.AI (AI System for reading messages)
const log4js = require('log4js'); // Log4JS (Creates logs for bot actions)
const faunadb = require('faunadb'); // FaunaDB (Data Storage)
const q = faunadb.query;

var channelList; // Declare channelList variable

// Query DB for user info
const fauna = new faunadb.Client({ secret: config.masterConfig.faunaDbToken }); // Create FaunaDB client
const channels = fauna.paginate(q.Match(q.Index("twitchChannels"), true)); // Query FaunaDB database for channel list
channels.each(function (page) { channelList = page }); // Page FaunaDB results => set channelList variable to those results

waitForDB();

function waitForDB() {
  if (typeof channelList !== "undefined") { // Main script | waitFor database results before running


    if (!channelList) { // If ChannelList was not loaded on time throw an error and stop the script
      throw new Error(`Failed to load database info: "channelList" on time`);
    }
  
    // TMI.js Options (links back to cinfig.json for most options)
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
      channels: channelList // FaunaDB query results
    };
  
    const TMI = new tmi.Client(options) // Create New TMI Client
    const AI = new Wit({accessToken: config.masterConfig.witToken}); // Create AI client
    console.log(log);
  
    // Log to confirm data loaded
    console.log(`Global Configuration Loaded:`) // Display all admin usernames
    console.log(`Channels loaded: ${channelList}`) // Display all channel names
    console.log(`Blacklist loaded: `) // Display all blacklisted usernames
  
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
  
    TMI.connect(); // Connect to twitch servers and join all channels
  
    TMI.on('message', (channel, tags, message, self) => {
  
      if (self) return; // Ignore messages sent by SniperBot
  
      console.log(`${channel} | ${tags.username} | ${message} || Self: ${self}`) // Log message Contents
  
      if (message.toLowerCase().startsWith(`${config.masterConfig.prefix}sniperbot`)) {
        var action = message.split(' ')[1];
  
        if (action == 'join') {

          // Joins A Channel
          // Query Database for username, if it doesnt exist add user to database
          // then connect TMI client to user's channel #### TO DO ####
          // ############################################################################################
          // **IMPORTANT**
          // Add ability to change inChannel value for users who already have a document in the database
          // ############################################################################################

          var inChannel;

          const username = fauna.paginate(q.Match(q.Index("users"), tags.username)); // Query FaunaDB database for username => returns true or false
          username.each(function (page) { inChannel = page }); // Page FaunaDB results => set inChannel variable to those results

          async function waitForinChannelResult() { // Asynchronous function => Repeat check for inChannel until a value exists
            if (typeof inChannel !== "undefined") {
              if (inChannel[0] == true) { // If true notify user bot is already in that channel
                TMI.say(channel, `${tags.username} SniperBot is already in the channel`)
              } else { // If false create database entry for user containing default values
                fauna.query(q.Create(q.Collection("twitch_users"),{data: {"username": tags.username, "inChannel": true, "channelName": `#${tags.username}`, "isAdmin": false, "isBlacklisted": false}}))
              }
            } else {
              setTimeout(waitForinChannelResult, 250); // Wait 250ms before re-running check
            }
          }

          waitForinChannelResult();

        } else if (action == 'leave') {
          
          // Leaves a channel
          // Query database with username to find appropriate document
          // Edit document inChannel value (Change to false)

        } else {

          TMI.say(channel, `SniperBot is an Advanced Moderation Bot for Twitch and Discord that utilizes Artificial Intelligence to make Moderation Decisions. Add SniperBot to your Twitch Chanel or Discord Server today and experience next level moderation http://sniperbot.tk`);
        }
      } 
  
      AI.message(message) // Send Message Contents to AI
      .then((data) => {
        console.log(JSON.stringify(data)) // Log AI response
        if (data.intents[0]) {
          if (data.intents[0].name == 'Banned' && data.intents[0].confidence > 0.9) { // If message intent = Banned
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
    });
  
    // NOTE: anything past this point will not be able to reference anything inside of the delayed script
  } else {
    setTimeout(waitForDB, 100);
  }
}