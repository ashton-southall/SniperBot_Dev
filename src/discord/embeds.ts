declare function require(name: string);
const discordjs = require('discord.js');

const DMReply = new discordjs.MessageEmbed()
    .setColor('#ff5757')
    .setTitle(`Thanks for your message, I'll pass it on to my creators`)
    .setDescription(`If you would like my creators to get back to you please join the official discord by clicking the embed title`)
    .setURL('https://discord.io/sniperbot')
    .setTimestamp()
    .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');


export {DMReply};