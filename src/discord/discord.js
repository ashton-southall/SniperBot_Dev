const Discord = require('discord.js');
const config = require('../config.json');

const prefix = config.masterConfig.prefix;
const token = config.discordConfig.token;
const bot_name = config.discordConfig.bot_name;
const activity_type = config.discordConfig.activity_type;
const activity = config.discordConfig.activity;

const client = new Discord.Client();
const getReports = true;
var nextactivity = '1';
const log4js = require('log4js');
const fs = require('fs')

log4js.configure({
  appenders: {
    discord: {
      type: 'file',
      filename: 'logs/discord.log'
    }
  },
  categories: {
    default: {
      appenders: ["discord"],
      level: "info"
    }
  }
});
var logger = log4js.getLogger('discord');
logger.level = 'info';


const {
  Wit,
  log
} = require('node-wit');
const AI = new Wit({
  accessToken: config.masterConfig.wit_token
});


client.once('ready', () => {
  console.log('Sniperbot Discord Ready');
  console.log('Discord Admins: ' + config.discordConfig.users.admins);
  console.log('Discord Blacklist: ' + config.discordConfig.users.blacklist);
  setInterval(() => {
    client.user.setActivity(activity, {
      type: activity_type
    });
  }, 10000)
})
client.login(token);

client.on('message', message => {

  if (message.author.bot) return;

  // Direct Message Communication
  // Redirect Revieved DMs
  if (message.channel.type == "dm") {
    message.author.send("Thank you for your message, I will pass it on to my creators, please join the official SniperBot disocrd to allow us to get back to you\rhttps://discord.gg/zBt3GRT");
    client.channels.cache.get("707636583121158174").send(`${message.author}: ${message}`);
    return;
  }

  if (config.discordConfig.users.blacklist.includes(message.member.id)) {
    message.member.kick().then((member) => {
      logger.info(`kicked ${message.author} from a server as they were found on the Global Blacklist`);
      message.author.send("You have been automatically kicked by SniperBot because you are on the SniperBot global blacklist,\rDM Adsnipers#6231 if you think this is an error");
    }).catch((error) => {
      message.channel.send("Error while kicking blacklisted user, error: " + error);
    })
  }

  if (message.content.startsWith(`${prefix}kick`)) {
    if (message.member.hasPermission(['KICK_MEMBERS'])) {
      let member = message.mentions.members.first();
      if (member) {
        member.kick().then((member) => {
          message.channel.send(member.displayName + "has been kicked");
        })
      } else {
        message.channel.send(`That person could not be found, Please mention a member to kick`);
      }
    }
  }
  if (message.content.startsWith(`${prefix}ban`)) {
    let member = message.mentions.members.first();
    if (member) {
      member.kick().then((member) => {
        message.channel.send(member.displayName + "has been banned");
      })
    } else {
      message.channel.send(`That person could not be found, please mention a member to be banned`);
    }
  }
  if (message.content.startsWith(`${prefix}help`)) {
    message.channel.send("**SniperBot By Adsnipers**\r**Administrator Commands**\r- !ban {mention_member}\r**Moderator Commands**\r- !kick {mention_member}\r**----**\rfor more information about SniperBot visit\rhttp://sniperbot.rf.gd\rFor advanced support join the official SniperBot discord to chat with a developer:\rhttps://discord.gg/zBt3GRT\rMore information is also availavle at https://github.com/Adsnipers/TheSniperBot");
  }

  // AI Moderation
  // Send message to AI
  if (message.channel.nsfw == !true) {
    AI.message(message, {})
      .then((data) => {
        logger.info(`[${message.author}]: ${JSON.stringify(data)}`);
        console.log('Intent: ' + data.intents[0].name + ', Traits: ' + data.traits);
        if (data.intents[0].name == 'Banned' && data.intents[0].confidence > '0.9') {
          logger.info(`Deleting previous message from ${message.author}`);
          message.channel.send(`[AI Operation] A message has been removed from this channel as it was detected by SniperBot for being highly innapropriate, report any innacuracies on at https://github.com/Adsnipers/TheSniperBot/issues\rDeleted Message: || ${message} ||\rUser: ${message.author}`);
          message.author.send("[AI Operation] One of your messages in a server has been deleted by SniperBot as it was detected for being highly innapropriate, Report innacuracies at https://github.com/Adsnipers/TheSniperBot/issues`");
          message.delete().then(() => {
            console.log(`Successfully deleted message`);
          }).catch((error) => {
            message.channel.send("There was an error, please report it at https://github.com/Adsnipers/TheSniperBot/issues\rerror message: " + error);
          })
        } else {
          console.log(data);
        }
      })
      .catch(console.error);
  } else {

  }

  // !blacklist (ability for admins to add or remove blacklisted users and phrases)
  if (message.content.startsWith(`${config.masterConfig.prefix}blacklist`)) {
    var mode = message.content.split(' ')[1];
    var name = message.content.split(' ')[2];
    if (config.discordConfig.users.admins.includes(message.author.id)) {
      if (mode == 'add') {
        config.discordConfig.users.blacklist.push(name);
        fs.writeFile('config.json', JSON.stringify(config, null, 4), 'utf-8', function (err) {
          if (err) throw err
        });
        message.channel.send(`Added ${name} to Global Blacklist`);
      } else if (mode == 'remove') {
        config.discordConfig.users.blacklist.splice(config.discordConfig.users.blacklist.indexOf(name), 1);
        fs.writeFile('config.json', JSON.stringify(config, null, 4), 'utf-8', function (err) {
          if (err) throw err
        });
        message.channel.send(`Removed ${name} from Global Blacklist`);
      } else {
        message.channel.send(`incorrect command usage, please use ${config.prefix}blacklist {add / remove} {username}`);
      }
    } else {
      console.log(message.author.id)
      message.channel.send(`thats a really powerful command and I cannot let you use it`);
    }
  }
})