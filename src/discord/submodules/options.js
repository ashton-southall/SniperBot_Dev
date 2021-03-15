async function doChannelOptions(config, embeds, discordjs, discord, message, sender, server, fauna, q) {
    if (message.content.startsWith(`${config.masterConfig.prefix}options`)) {
        if (message.member.hasPermission(['ADMINISTRATOR']) || sender[0][2] == true) {
            var optionToChange = message.content.split(' ')[1];
            var optionValue = message.content.split(' ')[2];
            console.log(sender[0][0]);
            if (typeof optionToChange !== "undefined") {
                if (typeof optionValue !== "undefined") {
                    if (optionToChange.toLowerCase() == 'insultthreshold') {
                        message.channel.startTyping();
                        console.log(`Notice: User updating option ${optionToChange}`);
                        await fauna.query(q.Update(q.Ref(q.Collection('discord_servers'), server[0][0]), {
                                data: {
                                    options: {
                                        insultThreshold: optionValue
                                    }
                                }
                            }, ))
                            .catch(error => message.channel.send(`There was an error updating channel options, please double check your message, if you dont see an issue contact support at http://adfoc.us/54699276543906\r error: ${error}`).then(error => `ERROR: ${error}`).then(console.log(`ERROR: ${error}`)))
                            .then(message.channel.send(embeds.optionsUpdated));
                        message.channel.stopTyping();
                    } else if (optionToChange.toLowerCase() == 'racismthreshold') {
                        message.channel.startTyping();
                        console.log(`Notice: User updating option ${optionToChange}`);
                        await fauna.query(q.Update(q.Ref(q.Collection('discord_servers'), server[0][0]), {
                                data: {
                                    options: {
                                        racismThreshold: optionValue
                                    }
                                }
                            }, ))
                            .catch(error => message.channel.send(`There was an error updating channel options, please double check your message, if you dont see an issue contact support at http://adfoc.us/54699276543906\r error: ${error}`).then(error => `ERROR: ${error}`).then(console.log(`ERROR: ${error}`)))
                            .then(message.channel.send(embeds.optionsUpdated));
                        message.channel.stopTyping();
                    } else if (optionToChange.toLowerCase() == 'threatthreshold') {
                        message.channel.startTyping();
                        console.log(`Notice: User updating option ${optionToChange}`);
                        await fauna.query(q.Update(q.Ref(q.Collection('discord_servers'), server[0][0]), {
                                data: {
                                    options: {
                                        threatThreshold: optionValue
                                    }
                                }
                            }, ))
                            .catch(error => message.channel.send(`There was an error updating channel options, please double check your message, if you dont see an issue contact support at http://adfoc.us/54699276543906\r error: ${error}`).then(error => `ERROR: ${error}`).then(console.log(`ERROR: ${error}`)))
                            .then(message.channel.send(embeds.optionsUpdated));
                        message.channel.stopTyping();
                    } else if (optionToChange.toLowerCase() == 'toxicitythreshold') {
                        message.channel.startTyping();
                        console.log(`Notice: User updating option ${optionToChange}`);
                        await fauna.query(q.Update(q.Ref(q.Collection('discord_servers'), server[0][0]), {
                                data: {
                                    options: {
                                        toxicityThreshold: optionValue
                                    }
                                }
                            }, ))
                            .catch(error => message.channel.send(`There was an error updating channel options, please double check your message, if you dont see an issue contact support at http://adfoc.us/54699276543906\r error: ${error}`).then(error => `ERROR: ${error}`).then(console.log(`ERROR: ${error}`)))
                            .then(message.channel.send(embeds.optionsUpdated));
                        message.channel.stopTyping();
                    };
                };
            } else {
                console.log(server[0][1]);
                message.channel.startTyping();
                const optionsEmbed = new discordjs.MessageEmbed()
                .setColor('#ff5757')
                .setTitle(`Server Options`)
                .setDescription(`Options for server: ${server[0][1]}`)
                .addFields({
                    name: `insultThreshold`,
                    value: server[0][2]
                }, {
                    name: `racismThreshold`,
                    value: server[0][3]
                }, {
                    name: `threatThreshold`,
                    value: server[0][4]
                }, {
                    name: `toxicityThreshold`,
                    value: server[0][5]
                }).setTimestamp().setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');
                message.channel.send(optionsEmbed);
                message.channel.startTyping();
            };
        };
    };
};

module.exports = {
    doChannelOptions
};