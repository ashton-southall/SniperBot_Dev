const embeds = require('./embeds.js');
const config = require('../../config.json');
const { client } = require('tmi.js');

async function sendMessage(discordjs, discord, server, AI, message) {
    
    if (message.channel.nsfw == false) {
        AI.message(message)
            .then((data) => {
                if (data.intents[0]) {
                    if (data.intents[0].name == 'Banned' && data.intents[0].confidence > 0.9) {
                        const AILogEmbed = new discordjs.MessageEmbed().setColor('#ff5757').setTitle(`AI Operation`).setDescription(`A message has been deleted as it was detected for being highly innapropriate`).addFields({name: `Message Content`,value: message}, {name: `Sender ID`,value: message.author.id}, {name: `More Info`,value: `**Channel**\r${message.channel} (${message.channel.id})\r**Server** \r${message.guild} (${message.guild.id})`}, {name: `AI Response`,value: `${data.intents[0].name}: ${data.intents[0].confidence}% Confidence`}).setTimestamp().setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');
                        if (data.traits) {
                            if (data.traits.Insult) {
                                if (server[0][2] < data.traits.Insult[0].value) {
                                    message.channel.startTyping();
                                    discord.channels.cache.get("748068812448071750").send(AILogEmbed).catch(console.log(error => (`ERROR: ${error}`)));
                                    message.delete().then((message) => {
                                        message.channel.send(embeds.messageDeleted).catch(console.log(error => (`ERROR: ${error}`)));
                                    }).catch(console.log(error => (`ERROR: ${error}`)));
                                    message.channel.stopTyping();
                                };
                            } else if (data.traits.Racism) {
                                if (server[0][3] < data.traits.Racism[0].value) {
                                    message.channel.startTyping();
                                    discord.channels.cache.get("748068812448071750").send(AILogEmbed).catch(console.log(error => (`ERROR: ${error}`)));
                                    message.delete().then((message) => {
                                        message.channel.send(embeds.messageDeleted).catch(console.log(error => (`ERROR: ${error}`)));
                                    }).catch(console.log(error => (`ERROR: ${error}`)));
                                    message.channel.stopTyping();
                                };
                            } else if (data.traits.Threat) {
                                if (server[0][4] < data.traits.Threat[0].value) {
                                    message.channel.startTyping();
                                    discord.channels.cache.get("748068812448071750").send(AILogEmbed).catch(console.log(error => (`ERROR: ${error}`)));
                                    message.delete().then((message) => {
                                        message.channel.send(embeds.messageDeleted).catch(console.log(error => (`ERROR: ${error}`)));
                                    }).catch(console.log(error => (`ERROR: ${error}`)));
                                    message.channel.stopTyping();
                                };
                            } else if (data.traits.Toxicity) {
                                if (server[0][5] < data.traits.Insult[0].value) {
                                    message.channel.startTyping();
                                    discord.channels.cache.get("748068812448071750").send(AILogEmbed).catch(console.log(error => (`ERROR: ${error}`)));
                                    message.delete().then((message) => {
                                        message.channel.send(embeds.messageDeleted).catch(console.log(error => (`ERROR: ${error}`)));
                                    }).catch(console.log(error => (`ERROR: ${error}`)));
                                    message.channel.stopTyping();
                                };
                            };
                        };
                    };
                };
            })
            .catch(console.error);
    };
};


module.exports = {
    sendMessage
}