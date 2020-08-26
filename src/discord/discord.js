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

    const DMReplyEmbed = new Discord.MessageEmbed()
      .setColor('#ff5757')
      .setTitle(`Thanks for your message, I'll pass it on to my creators`)
      .setDescription(`If you would like my creators to get back to you please join the official discord by clicking the embed title`)
      .setURL('https://discord.io/sniperbot')
      .setTimestamp()
      .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

    const NewMessageEmbed = new Discord.MessageEmbed()
      .setColor('#ff5757')
      .setTitle(`New Message`)
      .addField(`User ID: ${message.author.id}`, `${message}`, true)
      .setTimestamp()
      .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

    message.author.send(DMReplyEmbed);
    client.channels.cache.get("707636583121158174").send(NewMessageEmbed);
    return;
  }

  if (config.discordConfig.users.blacklist.includes(message.member.id)) {
    message.member.kick().then((member) => {

      const blacklistKickEmbed = new Discord.MessageEmbed()
        .setColor('#ff5757')
        .setTitle(`User Kicked`)
        .addField(`${config.masterConfig.blacklist_ban_reason}`)
        .setTimestamp()
        .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

      const BlacklistDMEmbed = new Discord.MessageEmbed()
        .setColor('#ff5757')
        .setTitle(`You've been kicked Kicked`)
        .addFields({
          name: `You've been kicked from a server because you are a blacklisted user on SniperBot `,
          value: `since you are a blacklisted user, any server using SniperBot will kick you if you join, or try to talk`
        }, {
          name: '\u200B',
          value: '\u200B'
        }, {
          name: 'Appeal to have your Blacklist Status revoked',
          value: 'https://bit.ly/SniperBotBanAppeal',
          inline: true
        }, {
          name: 'Tip',
          value: 'You can contact SniperBot developers by messaging SniperBot in DMs, your message will be redirected to SniperBot admins and developers. be sure to leave contact info if you want them to get back to you',
          inline: true
        }, )
        .setTimestamp()
        .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

      message.channel.send(blacklistKickEmbed);
      logger.info(`kicked user: ${message.author} from a server as they were found on the Global Blacklist`);
      message.author.send(BlacklistDMEmbed);
    }).catch((error) => {

      const BlacklistErrorEmbed = new Discord.MessageEmbed()
        .setColor('#ff5757')
        .setTitle(`An error has occurred`)
        .addField(`There was an error while attempting to kick blacklisted user ${message.author}`, `${error}`)
        .setTimestamp()
        .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

      message.channel.send(BlacklistErrorEmbed);
    })
  }

  if (message.content.startsWith(`${prefix}kick`)) {
    if (message.member.hasPermission(['KICK_MEMBERS'])) {
      let member = message.mentions.members.first();
      if (member) {
        member.kick().then((member) => {

          const UserKickedEmbed = new Discord.MessageEmbed()
            .setColor('#ff5757')
            .setTitle(`User Kicked`)
            .addField(`${member} has been kicked from the server`, `kicked by ${message.author}`)
            .setTimestamp()
            .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

          message.channel.send(UserKickedEmbed);
        })
      } else {

        const KickErrorEmbed = new Discord.MessageEmbed()
          .setColor('#ff5757')
          .setTitle(`An error has occurred`)
          .addField(`There was an error while attempting to kick user ${message.author}`, `${error}`)
          .setTimestamp()
          .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

        message.channel.send(KickErrorEmbed);
      }
    }
  }
  if (message.content.startsWith(`${prefix}ban`)) {
    let member = message.mentions.members.first();
    if (member) {
      member.kick().then((member) => {

        const BanUserEmbed = new Discord.MessageEmbed()
          .setColor('#ff5757')
          .setTitle(`User banned`)
          .addField(`${member} has been banned from the server`, `Banned by ${message.author}`)
          .setTimestamp()
          .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

        message.channel.send(BanUserEmbed);
      })
    } else {
      const BanErrorEmbed = new Discord.MessageEmbed()
        .setColor('#ff5757')
        .setTitle(`An error has occurred`)
        .addField(`There was an error while attempting to Ban user ${message.author}`, `${error}`)
        .setTimestamp()
        .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

      message.channel.send(banErrorEmbed);
    }
  }
  if (message.content.startsWith(`${prefix}help`)) {

    const HelpEmbed = new Discord.MessageEmbed()
      .setColor('#ff5757')
      .setThumbnail(`https://i.imgur.com/WFj42aM.png`)
      .setTitle(`SniperBot By Adsnipers`)
      .addFields({
        name: `SniperBot Admin Commands`,
        value: `Note: These commands can only be used by SniperBot Admins\r ${config.masterConfig.prefix}blacklist {add / remove} {userID}`
      }, {
        name: `Server Admin Commands`,
        value: `${config.masterConfig.prefix}ban {mention_member}\r${config.masterConfig.prefix}kick {mention_member}`
      }, {
        name: `User Commands`,
        value: `${config.masterConfig.prefix}help - Shows this`
      }, {
        name: '\u200B',
        value: '\u200B'
      }, {
        name: 'More Info',
        value: 'for more information about SniperBot visit\rhttp://sniperbot.tk\rFor advanced support join the official SniperBot discord to chat with a developer:\rhttps://discord.io/sniperbot\rMore information is also availavle at https://github.com/Adsnipers/SniperBot"',
        inline: true
      }, {
        name: '\u200B',
        value: '\u200B'
      }, {
        name: 'Tip',
        value: 'You can contact SniperBot developers by messaging SniperBot in DMs, your message will be redirected to SniperBot admins and developers. be sure to leave contact info if you want them to get back to you',
        inline: true
      })
      .setTimestamp()
      .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

    message.channel.send(HelpEmbed);
  }

  // AI Moderation
  // Send message to AI
  if (message.channel.nsfw == !true) {
    AI.message(message, {})
      .then((data) => {
        logger.info(`[${message.author}]: ${JSON.stringify(data)}`);
        console.log('Intent: ' + data.intents[0].name + ', Traits: ' + data.traits);
        if (data.intents[0].name == 'Banned' && data.intents[0].confidence > '0.9') {
          const AIOperationEmbed = new Discord.MessageEmbed()
            .setColor('#ff5757')
            .setTitle(`AI Operation`)
            .setDescription(`A message has been deleted as it was detected for being highly innapropriate, report any innacuracies at http://bit.ly/SniperBotReport`)
            .setTimestamp()
            .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

            const AILogEmbed = new Discord.MessageEmbed()
            .setColor('#ff5757')
            .setTitle(`AI Operation`)
            .setDescription(`A message has been deleted as it was detected for being highly innapropriate`)
            .addFields({
              name: `Message Content`,
              value: message
            }, {
              name: `Sender ID`,
              value: message.author.id
            }, {
              name: `More Info`,
              value: `**Channel**\r${message.channel} (${message.channel.id})\r**Server** \r${message.guild} (${message.guild.id})`
            }, {
              name: `AI Response`,
              value: `${data.intents[0].name}: ${data.intents[0].confidence}% Confidence`
            })
            .setTimestamp()
            .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

          logger.info(`Deleting previous message from ${message.author}`);
          message.channel.send(AIOperationEmbed);
          client.channels.cache.get("748068812448071750").send(AILogEmbed);
          message.delete().then(() => {
            console.log(`Successfully deleted message`);
          }).catch((error) => {

            const AIOperationErrorEmbed = new Discord.MessageEmbed()
              .setColor('#ff5757')
              .setTitle(`An error has occurred`)
              .addField(`There was an error while attempting delete a message`, `${error}`)
              .setTimestamp()
              .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

            message.channel.send(AIOperationErrorEmbed);
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

        const BlacklistAddEmbed = new Discord.MessageEmbed()
        .setColor('#ff5757')
        .setTitle(`Added User To Global Blacklist`)
        .addField(`${name}`, `Added By ${message.author}`)
        .setTimestamp()
        .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

        config.discordConfig.users.blacklist.push(name);
        fs.writeFile('config.json', JSON.stringify(config, null, 4), 'utf-8', function (err) {
          if (err) throw err
        });
        message.channel.send(BlacklistAddEmbed);
      } else if (mode == 'remove') {

        const BlacklistRemoveEmbed = new Discord.MessageEmbed()
        .setColor('#ff5757')
        .setTitle(`Removed User From Global Blacklist`)
        .addField(`${name}`, `Removed By ${message.author}`)
        .setTimestamp()
        .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

        config.discordConfig.users.blacklist.splice(config.discordConfig.users.blacklist.indexOf(name), 1);
        fs.writeFile('config.json', JSON.stringify(config, null, 4), 'utf-8', function (err) {
          if (err) throw err
        });
        message.channel.send(BlacklistRemoveEmbed);
      } else {
        const IncorrectCommandEmbed = new Discord.MessageEmbed()
              .setColor('#ff5757')
              .setTitle(`Incorrect Command Usage`)
              .addField(`To use this command`, `${config.masterConfig.prefix}blacklist {add / remove} {userID}`)
              .setTimestamp()
              .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');
        message.channel.send(IncorrectCommandEmbed);
      }
    } else {
      console.log(message.author.id)
      const NoPermissionEmbed = new Discord.MessageEmbed()
              .setColor('#ff5757')
              .setTitle(`Insufficient Permissions`)
              .addField(`You do not have access to use this command`, `You must be a SniperBot administrator to use that command`)
              .setTimestamp()
              .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');
      message.channel.send(NoPermissionEmbed);
    }
  }
})