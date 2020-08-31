const tmi = require('tmi.js');
const fs = require('fs');
const faunadb = require('faunadb');
const query = faunadb.query;
const config = require("../config.json");
const {
  Wit,
  log
} = require('node-wit');
const client = new tmi.Client(config.twitchConfig);
var DBclient = new faunadb.Client({
  secret: config.masterConfig.faunadb_token
})
const AI = new Wit({
  accessToken: config.masterConfig.wit_token
});
const log4js = require('log4js');

log4js.configure({
  appenders: {
    twitch: {
      type: 'file',
      filename: 'src/logs/twitch.log'
    }
  },
  categories: {
    default: {
      appenders: ["twitch"],
      level: "info"
    }
  }
});
var logger = log4js.getLogger('twitch');
logger.level = 'info';



console.log('Admins Loaded: ' + config.twitchConfig.users.admins);
console.log('Channels Loaded: ' + config.twitchConfig.channels);
console.log('blacklist loaded: ' + config.twitchConfig.users.blacklist);

client.connect();

// Send a message when Adsnipers joins the chat
client.on("join", (channel, username, self) => {
  if (username === 'adsnipers') {
    client.say(channel, `We're all watching`);
    client.host('SniperBotOnTwitch', channel);
  }
})

client.on('message', (channel, tags, message, self) => {

  // Ignore messages sent by the bot
  if (self) return;

  // AI Moderation
  // Send message to AI
  AI.message(message, {})
    .then((data) => {
      logger.info(`[${channel}] ${tags.username}: ` + JSON.stringify(data));
      if (data.intents.name) {
        if (data.intents[0].name == 'Banned' && data.intents[0].confidence > 0.9) {
          logger.info(`Purging Messages From ${tags.username}`);
          client.timeout(channel, tags.username, 1, `AI Timeout, report inaccuracies at https://github.com/Adsnipers/TheSniperBot/issues`);
          client.say(channel, '@' + tags.username + `[AI Timeout] ${tags.username} has been automatically timed out by SniperBot as it was detected for being Highly innapropriate, Report innacuracies at https://github.com/Adsnipers/TheSniperBot/issues`);
          AITimeouts.inc();
        } else {
          console.log(data);
        }
      }
    })
    .catch(console.error);

  // Check if the sender is the broadcaster of the channel
  if ('#' + tags.username == channel) {
    var isBroadcaster = true;
  } else {
    var isBroadcaster = false;
  }

  // Blacklist Timeout
  if (config.twitchConfig.users.blacklist.includes(tags.username)) {
    client.timeout(channel, tags.username, config.blacklist_ban_time, config.blacklist_ban_reason)
      .then((data) => {
        logger.info(`Timing out Blacklisted user ${tags.username} for ${config.blacklist_ban_time}`)
        client.say(channel, '@' + tags.username + ' you are blacklisted via SniperBot and are not permitted to talk in any channel using SniperBot, appeal at https://bit.ly/SniperBotBanAppeal [24 hour timeout]');
        blacklistTimeouts.inc();
      }).catch((err) => {
        client.say(channel, 'there was a problem while initiating a timeout on blacklisted user ' + tags.username + ' Error: ' + err);
      });
  }

  // Help commands
  if (message.toLowerCase() === `${config.masterConfig.prefix}commands`) {
    client.say(channel, `All Sniperbot Commands\rhttp://sniperbot.tk`);
  }

  //Mod Commands
  if (message.toLowerCase().startsWith(`${config.masterConfig.prefix}ban`)) {
    var banname = message.split(' ')[1];
    if (banname) {
      if (isBroadcaster == true) {
        client.ban(channel, banname, 'banned by ' + tags.username);
        client.say(channel, banname + ' successfully banned by ' + tags.username);
      } else if (tags.mod == true) {
        client.ban(channel, banname, 'banned by ' + tags.username);
        client.say(channel, banname + ' successfully banned by ' + tags.username);
      } else if (users.admins.includes(tags.username)) {
        client.say(channel, 'admin override enabled, user banned');
        client.ban(channel, banname, 'Banned by sniperbot admin');
      } else {
        client.say(channel, '@' + tags.username + ' that command is for moderators only');
      }
    }
  }
  if (message.startsWith(`${config.masterConfig.prefix}unban`)) {
    var unbanname = message.split(' ')[1];
    if (unbanname) {
      if (isBroadcaster == true) {
        client.unban(channel, unbanname);
        client.say(channel, unbanname + ' has been unbanned by ' + tags.username);
      } else if (tags.mod == true) {
        client.unban(channel, unbanname);
        client.say(channel, unbanname + ' has been unbanned by ' + tags.username);
      } else if (users.admins.includes(tags.username)) {
        client.say(channel, 'admin override enabled, user unbanned');
        client.unban(channel, unbanname, 'unbanned by SniperBot Admin');
      } else {
        client.say(channel, '@' + tags.username + ' That command is for moderators only')
      }
    }
  }

  // !blacklist (ability for admins to add or remove blacklisted users and phrases)
  if (message.startsWith(`${config.masterConfig.prefix}blacklist`)) {
    var mode = message.split(' ')[1];
    var input1 = message.split(' ')[2];
    if (config.twitchConfig.users.admins.includes(tags.username)) {
      if (mode == 'add') {
        config.twitchConfig.users.blacklist.push(input1);
        fs.writeFile('src/config.json', JSON.stringify(config, null, 4), 'utf-8', function (err) {
          if (err) throw err
        });
        client.say(channel, 'Added ' + input1 + ' to Global Blacklist');
      } else if (mode == 'remove') {
        config.twitchConfig.users.blacklist.splice(config.twitchConfig.users.blacklist.indexOf(input1), 1);
        fs.writeFile('src/config.json', JSON.stringify(config, null, 4), 'utf-8', function (err) {
          if (err) throw err
        });
        client.say(channel, 'Removed ' + input1 + ' from Global Blacklist');
      } else {
        client.say(channel, '@' + tags.username + ` incorrect command usage, please use ${config.masterConfig.prefix}blacklist {add / remove} {username}`);
      }
    } else {
      client.say(channel, '@' + tags.username + ' thats a really powerful command and I cannot let you use it');
    }
  }

  // !sniperbot
  if (message.startsWith(`${config.masterConfig.prefix}sniperbot`)) {
    var mode = message.split(' ')[1];
    var input1 = message.split(' ')[2];
    var input2 = message.split(' ')[3];
    var senderchannel = tags.username;
    if (mode == 'join') {
      if (config.twitchConfig.channels.includes("#" + senderchannel)) {
        client.say(channel, '@' + tags.username + " SniperBot is already in that channel")
      } else {
        DBclient.query(
          query.Create(
            query.Collection('Twitch_Channels'), {
              data: {
                username: tags.username
              }
            }
          )
        )
        client.say(channel, "Successfully joined channel: " + senderchannel);
        client.join('#' + senderchannel);
      }
    } else if (mode == 'leave') {
      if (config.twitchConfig.channels.includes("#" + senderchannel)) {
        config.twitchConfig.channels.splice(config.twitchConfig.channels.indexOf("#" + senderchannel), 1);
        fs.writeFile('src/config.json', JSON.stringify(config, null, 4), 'utf-8', function (err) {
          if (err) throw err
        });
        client.say(channel, "Leaving Channel " + senderchannel + ' if you did not mean to run this command use !sniperbot join in the SniperBot twitch channel');
        client.leave("#" + senderchannel);
      } else {
        client.say(channel, '@' + tags.username + " SniperBot is not in that channel")
      }
    } else if (mode == 'restart') {
      if (config.twitchConfig.users.admins.includes(tags.username)) {
        client.say(channel, `Restating Module, please wait.`)
        process.exit(0);
      } else {
        client.say(channel, `@${tags.username} that command is way too powerful for me to simply let you use it`)
      }
    } else if (mode == 'say') {
      if (config.twitchConfig.users.admins.includes(tags.username)) {
        client.say(input1, input2);
      }
    }
    if (mode == 'host') {
      if (config.twitchConfig.users.admins.includes(tags.username)) {
        client.host('SniperBotOnTwitch', input1)
          .then((data) => {
            client.say(channel, `SniperBot is now hosting ${input1}`);
          }).catch((err) => {
            client.say(channel, `There was an error while attempting to host channel ${input1}\rError: ${err}`);
          });
      }
    } else {
      client.say(channel, `SniperBot is an Advanced Moderation Bot for Twitch and Discord that utilizes Artificial Intelligence to make Moderation Decisions. Add SniperBot to your Twitch Chanel or Discord Server today and experience next level moderation  \rhttp://sniperbot.tk`);
    }

  }
});