// Imports
const tmi = require("tmi.js"); // TMI (Twitch bot library)
const config = require('../config.json'); // Config File (Contains Secrets)
const Wit = require('node-wit'); // WIT.AI (AI System for reading messages)
const log4js = require('log4js'); // Log4JS (Creates logs for bot actions)
const faunadb = require('faunadb'); // FaunaDB (Data Storage)
const q = faunadb.query;

var channelList; // Declare channelList variable

// Query DB for user info
const fauna = new faunadb.Client({ secret: config.masterConfig.faunaDbToken }); // Create FaunaDB client
const channels = fauna.paginate(q.Match(q.Index("twitchChannels"), "true")); // Query FaunaDB database for channel list
channels.each(function (page) { channelList = page }); // Page FaunaDB results => set channelList variable to those results

console.log(`Waiting 3 seconds to cater for DB response time, please wait`)

setTimeout(function () { // Main script | Delayed to cater for Database Response time

  if (!channelList) {
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
      TMI.say(channel, `SniperBot is an Advanced Moderation Bot for Twitch and Discord that utilizes Artificial Intelligence to make Moderation Decisions. Add SniperBot to your Twitch Chanel or Discord Server today and experience next level moderation http://sniperbot.tk`);
    }

    AI.message(message) // Send Message Contents to AI
    .then((data) => {
      console.log(JSON.stringify(data)) // Log AI response
      if (data.intents) {
        if (data.intents[0].name == 'Banned' && data.intents[0].confidence > 0.9) { // If message intent = Banned
          if (data.traits) {
            console.log(data.traits);
            if (data.traits.Insult) {
              logger.info(`Detected: "Insult" in message, Purging Messages From ${tags.username}`);
              client.timeout(channel, tags.username, 1, config.masterConfig.automatedActionReason);
            } else if (data.traits.Racism) {
              logger.info(`Detected: "Racism" in message, Purging Messages From ${tags.username}`);
              client.timeout(channel, tags.username, 1, config.masterConfig.automatedActionReason);
            } else if (data.traits.Threat) {
              logger.info(`Detected: "Threat" in message, Purging Messages From ${tags.username}`);
              client.timeout(channel, tags.username, 1, config.masterConfig.automatedActionReason);
            } else if (data.traits.Toxicity) {
              logger.info(`Detected" "Toxicity" in message, Purging Messages From ${tags.username}`);
              client.timeout(channel, tags.username, 1, config.masterConfig.automatedActionReason);
            }
          }
        }
      }
    })
    .catch(console.error)
  });

  // NOTE: anything past this point will not be able to reference anything inside of the delayed script
}, 3000) // End of setTimeout function

