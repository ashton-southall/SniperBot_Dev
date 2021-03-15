async function checkBlacklist(config, discordjs, discord, fauna, q, message, sender) {
    if (sender.length !== 0) {
        if (sender[0][3] == true) {
            message.member.kick().then(() => {
                message.channel.startTyping();
                const BlacklistKickLogembed = new discordjs.MessageEmbed().setColor('#ff5757').setTitle(`Blacklisted user kicked`).setDescription(`A user was kicked from a server because they were on the SniperBot global blacklist`).addFields({name: `Sender ID`,value: message.author.id}, {name: `More Info`,value: `**Server** \r${message.guild} (${message.guild.id})`}).setTimestamp().setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');
                message.channel.send(embeds.blacklistKick);
                message.author.send(embeds.blacklistDM);
                discord.channels.cache.get("748068812448071750").send(BlacklistKickLogembed).catch(console.log(error => (`ERROR: ${error}`)));
                message.channel.stopTyping();
            }).catch(error => console.log(`ERROR: ${error}`));
        };
    } else {
        console.log(`Notice: User ${message.author.id} is not in database, creating entry`);
        fauna.query(q.Create(q.Collection("discord_users"), {
                data: {
                    "id": message.author.id,
                    "username": message.author.username,
                    "isAdmin": false,
                    "isBlacklisted": false
                }
            }))
            .catch(error => console.log(`ERROR: ${error}`));
    };
};

async function manageBlacklist(config, discordjs, discord, message, sender, fauna, q) {
    if (message.content.startsWith('!blacklist')) {
        const mode = message.content.split(' ')[1];
        const target = message.content.split(' ')[2];

        if (mode == 'add') {
            if (sender[0][2] == true) {
                message.channel.startTyping();
                console.log(`Target: ${target}`);
                var queryTarget = fauna.paginate(q.Match(q.Index("discord.users.allInfo"), target));
                queryTarget.each(function (page) {
                    response = page
                });

                function waitForResponse() {
                    if (typeof response !== "undefined") {
                        fauna.query(q.Update(q.Ref(q.Collection('discord_users'), response[0][0]), {
                                data: {
                                    isBlacklisted: true
                                }
                            }))
                            .then(message.channel.send(`added ${target} to the global blacklist`));
                    } else {
                        setTimeout(waitForResponse, 250);
                    };
                    message.channel.stopTyping();
                };
                waitForResponse();
            };
        } else if (mode == 'remove') {
            if (sender[0][2] == true) {
                message.channel.startTyping();
                console.log(`Target: ${target}`);
                var queryTarget = fauna.paginate(q.Match(q.Index("discord.users.allInfo"), target));
                queryTarget.each(function (page) {
                    response = page
                });

                function waitForResponse() {
                    if (typeof response !== "undefined") {
                        fauna.query(q.Update(q.Ref(q.Collection('discord_users'), response[0][0]), {
                                data: {
                                    isBlacklisted: false
                                }
                            }))
                            .then(message.channel.send(`Removed ${target} from the global blacklist`));
                    } else {
                        setTimeout(waitForResponse, 250);
                    };
                    message.channel.stopTyping();
                };
                waitForResponse();
            };
        } else {
            // Is sender blacklisted
        };
    };
};

module.exports = {
    checkBlacklist,
    manageBlacklist
}