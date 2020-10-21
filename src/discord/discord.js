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

// Configure Log4JS
// Logs messages to an external file for review
// External files located at src/logs
log4js.configure({
  appenders: {
    discord: {
      type: 'file',
      filename: 'src/logs/discord.log'
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

// Configure WIT
// ChatBot AI used to return message information
const {
  Wit,
  log
} = require('node-wit');
const AI = new Wit({
  accessToken: config.masterConfig.wit_token
});

// When ready
// Console.log Config info: Admins and Blacklist
client.once('ready', () => {
  console.log('Sniperbot Discord Ready');
  console.log('Discord Admins: ' + config.discordConfig.users.admins);
  console.log('Discord Blacklist: ' + config.discordConfig.users.blacklist);
  // Set Bot's activity
  // AKA the "Playing" text under the Bot's name
  setInterval(() => {
    client.user.setActivity(activity, {
      type: activity_type
    });
  }, 10000)
})
// Login with Token
client.login(token);

client.on('message', message => {

  if (message.author.bot) return;

  // Direct Message Communication
  // Redirect Revieved DMs to SniperBot server's adminchat
  if (message.channel.type == "dm") {

    // Embed that will be sent to a user after SniperBot recieves a DM
    const DMReplyEmbed = new Discord.MessageEmbed()
      .setColor('#ff5757')
      .setTitle(`Thanks for your message, I'll pass it on to my creators`)
      .setDescription(`If you would like my creators to get back to you please join the official discord by clicking the embed title`)
      .setURL('https://discord.io/sniperbot')
      .setTimestamp()
      .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

      // Embed that will be sent to the SniperBot server containing the DM
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

  // Check Blacklist for ID of sender, if the ID matches one on the Blacklist kick the user from the server
  if (config.discordConfig.users.blacklist.includes(message.member.id)) {
    message.member.kick().then((member) => {

      // Embed to be sent after kicking a blacklisted user
      const blacklistKickEmbed = new Discord.MessageEmbed()
        .setColor('#ff5757')
        .setTitle(`User Kicked`)
        .addField(`${config.masterConfig.blacklist_ban_reason}`)
        .setTimestamp()
        .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

      // Embed to be sent to a blacklisted user user after they've been kicked
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

      // Embed to be sent if an error has occurred
      const BlacklistErrorEmbed = new Discord.MessageEmbed()
        .setColor('#ff5757')
        .setTitle(`An error has occurred`)
        .addField(`There was an error while attempting to kick blacklisted user ${message.author}`, `${error}`)
        .setTimestamp()
        .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

      message.channel.send(BlacklistErrorEmbed);
    })
  }
  // Kick command
  // Can only be used by members with kick permissions
  if (message.content.startsWith(`${prefix}kick`)) {
    if (message.member.hasPermission(['KICK_MEMBERS'])) {
      let member = message.mentions.members.first();
      if (member) {
        member.kick().then((member) => {

          // Embed to be sent when kicking a user
          const UserKickedEmbed = new Discord.MessageEmbed()
            .setColor('#ff5757')
            .setTitle(`User Kicked`)
            .addField(`${member} has been kicked from the server`, `kicked by ${message.author}`)
            .setTimestamp()
            .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

          message.channel.send(UserKickedEmbed);
        })
      } else {

        // Embed to be sent if an error occurrs
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

  // Purge command
  // !purge [number of messages to purge]
  // Deletes a set amount of messages
  if (message.content.startsWith(`${prefix}purge`)) {
    if (message.member.hasPermission(['ADMINISTRATOR'])) {
      purgeAmount = message.content.split(' ')[1]

      // Bulk delete messages
      message.channel.bulkDelete(purgeAmount)
        .then(messages => message.channel.send(`Purged ${messages.size} messages`))
        .catch(message.channel.send('An error occurred while trying to purge messages, please remember you can only purge messages under 14 days old'))

    }
  }

  // Ban command
  // !ban [user]
  // Ban a user from the server, can only be used by members with ban permissions
  if (message.content.startsWith(`${prefix}ban`)) {
    if (message.member.hasPermission(['BAN_MEMBERS'])) {
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
  }

  // Help Command
  // !help
  // Displays a list of commands and more information
  if (message.content.startsWith(`${prefix}help`)) {

    // Embed to send as reply
    const HelpEmbed = new Discord.MessageEmbed()
      .setColor('#ff5757')
      .setThumbnail(`https://i.imgur.com/WFj42aM.png`)
      .setTitle(`SniperBot By Adsnipers`)
      .addFields({
        name: `SniperBot Admin Commands`,
        value: `Note: These commands can only be used by SniperBot Admins\r ${config.masterConfig.prefix}blacklist {add / remove} {userID}`
      }, {
        name: `Server Admin Commands`,
        value: `${config.masterConfig.prefix}ban {mention_member}\r${config.masterConfig.prefix}kick {mention_member}\r${config.masterConfig.prefix}purge {number}`
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
  // AI Moderation Settings
  ActionConfidence = '0.9';
  AutomatedActionReason = `Message automatically purged by SniperBot. report inaccuracies at https://bit.ly/SniperBotReport`;
  // Send message to AI
  if (message.channel.nsfw == !true) {
    AI.message(message, {})
      .then((data) => {
        console.log(data);
        if (data.intents[0].name = 'Banned' && data.intents[0].confidence > ActionConfidence) {


        // Embed to send when an AI Operation has occurred
        const AIOperationEmbed = new Discord.MessageEmbed()
          .setColor('#ff5757')
          .setTitle(`AI Operation`)
          .setDescription(`A message has been deleted as it was detected for being highly innapropriate, report any innacuracies at http://bit.ly/SniperBotReport`)
          .setTimestamp()
          .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

        // Embed to send to the logs channel in the SniperBot discord server
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

        // If Wit returns Insult trait
        if (data.traits.Insult) {
          logger.info(`Deleting previous message from ${message.author}`);
          message.channel.send(AIOperationEmbed);
          client.channels.cache.get("748068812448071750").send(AILogEmbed);
          message.delete().then(() => {
            console.log(`Deleted message for: Insult`);
          }).catch((error) => {

            const AIOperationErrorEmbed = new Discord.MessageEmbed()
              .setColor('#ff5757')
              .setTitle(`An error has occurred`)
              .addField(`There was an error while attempting delete a message`, `${error}`)
              .setTimestamp()
              .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

            message.channel.send(AIOperationErrorEmbed);
          })
          // If wit returns Racism trait
        } else if (data.traits.Racism) {
          logger.info(`Racism detected in message, Deleting previous message from ${message.author}`);
          message.channel.send(AIOperationEmbed);
          client.channels.cache.get("748068812448071750").send(AILogEmbed);
          message.delete().then(() => {
            console.log(`Deleted message for: Racism`);
          }).catch((error) => {

            const AIOperationErrorEmbed = new Discord.MessageEmbed()
              .setColor('#ff5757')
              .setTitle(`An error has occurred`)
              .addField(`There was an error while attempting delete a message`, `${error}`)
              .setTimestamp()
              .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

            message.channel.send(AIOperationErrorEmbed);
          })

          // If wit returns Threat trait
        } else if (data.traits.Threat) {
          logger.info(`Threat detected in message, Deleting previous message from ${message.author}`);
          message.channel.send(AIOperationEmbed);
          client.channels.cache.get("748068812448071750").send(AILogEmbed);
          message.delete().then(() => {
            console.log(`Deleted message for: Threat`);
          }).catch((error) => {

            const AIOperationErrorEmbed = new Discord.MessageEmbed()
              .setColor('#ff5757')
              .setTitle(`An error has occurred`)
              .addField(`There was an error while attempting delete a message`, `${error}`)
              .setTimestamp()
              .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

            message.channel.send(AIOperationErrorEmbed);
          })

          // If wit returns toxicity trait
        } else if (data.traits.Toxicity) {
          logger.info(`Toxicity detected in message, Deleting previous message from ${message.author}`);
          message.channel.send(AIOperationEmbed);
          client.channels.cache.get("748068812448071750").send(AILogEmbed);
          message.delete().then(() => {
            console.log(`Deleted message for: Toxicity`);
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

      // Embed to send if a user doesnt have permission to do an action
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