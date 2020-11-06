//@ts-ignore
const discordjs = require('discord.js');
//@ts-ignore
const config = require('../config.json')

const DMReply = new discordjs.MessageEmbed()
    .setColor('#ff5757')
    .setTitle(`Thanks for your message, I'll pass it on to my creators`)
    .setDescription(`If you would like my creators to get back to you please join the official discord by clicking the embed title`)
    .setURL('https://discord.io/sniperbot')
    .setTimestamp()
    .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

const blacklistKick = new discordjs.MessageEmbed()
    .setColor('#ff5757')
    .setTitle(`User Kicked`)
    .addField(`${config.masterConfig.blacklist_ban_reason}`)
    .setTimestamp()
    .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');

const blacklistDM = new discordjs.MessageEmbed()
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
module.exports = {DMReply, blacklistKick, blacklistDM};