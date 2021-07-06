// Master bot script fot twitch module
// #################################################
// Confidential, DO NOT SHARE THIS CODE
require('dotenv').config();
const tmi = require("tmi.js");
const config = require('../config.json');
const {
  Wit,
  log
} = require('node-wit');
const faunadb = require('faunadb');
const q = faunadb.query;
const blacklist = require('./submodules/blacklist.js');
const channelmanagement = require('./submodules/channelmanagement.js');
const AIActions = require('./submodules/ai.js');
const optionsActions = require('./submodules/options.js');

var channelList;
const fauna = new faunadb.Client({
  secret: process.env.FAUNA_TOKEN
});
const channels = fauna.paginate(q.Match(q.Index("twitch.channelList"), true));
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
        username: process.env.TWITCH_USERNAME,
        password: process.env.TWITCH_OAUTH
      },
      channels: channelList
    };

    // Create New TMI + AI Client
    const TMI = new tmi.Client(options);
    const AI = new Wit({
      accessToken: process.env.WIT_TOKEN
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
      var querySender = fauna.paginate(q.Match(q.Index("twitch.users.allInfo"), tags.username));
      querySender.each(function (page) {
        sender = page
      });
      var queryChannelOptions = fauna.paginate(q.Match(q.Index("twitch.users.channelOptions"), tags.username));
      queryChannelOptions.each(function (page) {
        channelOptions = page
      });

      async function waitForSenderQuery() {
        if (typeof sender !== "undefined") {
          // Log message Contents
          console.log(`${channel} | ${tags.username} | ${message} || Self: ${self}`);

          async function checkDB(sender, TMI, fauna, q, channel, tags) {
            if (typeof sender !== "undefined") {
                console.log(sender);
                if (sender.length == 0) {
                    fauna.query(q.Create(q.Collection("twitch_users"), {
                        data: {
                            "username": tags.username,
                            "inChannel": false,
                            "channelName": `#${tags.username}`,
                            "isAdmin": false,
                            "isBlacklisted": false,
                        }
                    })).catch(error => `ERROR: ${error}`);
                }
            } else {
                setTimeout(checkDB, 250);
            };
        };
        checkDB(sender, TMI, fauna, q, channel, tags);

          // Check if user is blacklisted 
        blacklist.checkBlacklist(sender, TMI, config, channel, tags);
        blacklist.blacklistManagement(sender, TMI, fauna, q, config, channel, tags, message);
          // If Message startswith !sniperbot
          if (message.toLowerCase().startsWith(`${config.masterConfig.prefix}sniperbot`)) {
            var action = message.split(' ')[1];
            if (action == 'join') {
              console.log(`Joining Channel`);
              channelmanagement.joinChannel(sender, TMI, fauna, q, channel, tags)
                .catch(error => console.log(error));
            } else if (action == 'leave') {
              channelmanagement.leaveChannel(sender, TMI, fauna, q, channel, tags)
                .catch(error => console.log(error));
            } else {
              TMI.say(channel, `SniperBot is an Advanced Moderation Bot for Twitch and Discord that utilizes Artificial Intelligence to make Moderation Decisions. Add SniperBot to your Twitch Chanel or Discord Server today and experience next level moderation http://sniperbot.tk`);
            };
          };

          async function waitForChannelQuery() {
            if (typeof channelOptions !== "undefined") {
              optionsActions.doChannelOptions(sender, message, tags, channel, channelOptions, TMI, fauna, q, config).catch(error => console.log(error));
              AIActions.sendMessage(config, AI, TMI, channel, tags, message, channelOptions);
            } else {
              setTimeout(waitForChannelQuery, 250);
            };
          };
          waitForChannelQuery()
            .catch(error => console.log(error));

        } else {
          setTimeout(waitForSenderQuery, 250);
        }
      }
      waitForSenderQuery()
        .catch(error => console.log(error));
    });
    // NOTE: anything past this point will not be able to reference anything inside of the delayed script
  } else {
    setTimeout(runMaster, 100);
  }
}
// Run main (delayed) script
runMaster();