// Imports
const tmi = require("tmi.js"); // TMI (Twitch bot library)
const config = require('../config.json'); // Config File (Contains Secrets)
const { Wit,  log } = require('node-wit'); // WIT.AI (AI System for reading messages)
const log4js = require('log4js'); // Log4JS (Creates logs for bot actions)
const faunadb = require('faunadb') // FaunaDB (Data Storage)
const q = faunadb.query;

var channelList; // Declare channelList variable

// Query DB for user info
const fauna = new faunadb.Client({ secret: config.masterConfig.faunadb_token }); // Create FaunaDB client
const channels = fauna.paginate(q.Match(q.Index("twitchChannels"), "true")) // Query FaunaDB database for channel list => create constant called users containing results
channels.each(function (page) { channelList = page }) // Page FaunaDB results => set channelList variable to those results

setTimeout(function () { // Startup | Create all clients and load all settings

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
  const AI = new Wit({accessToken: config.masterConfig.wit_token}); // Create AI client

  // Log to confirm data loaded
  console.log(`Admins loaded: `) // Display all admin usernames
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

}, 2000); // End of setTimeout function



