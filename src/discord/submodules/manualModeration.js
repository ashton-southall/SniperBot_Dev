async function kick(config, discordjs, discord, message, sender) {
    if (message.content.startsWith(`${config.masterConfig.prefix}kick`)) {
        if (message.member.hasPermission(['KICK_MEMBERS'])) {
            message.channel.startTyping();
            let memberToKick = message.mentions.members.first();
            if (memberToKick) {
                console.log(`Attempting to kick member ${memberToKick}`);
                memberToKick.kick({reason: `Manually kicked by ${message.author.username}`}).then((member) => {
                    message.channel.send(embeds.kickMessage)
                    sendDM.sendKicked(discordjs, discord, message, embeds)
                }).catch(error => message.channel.send(`There was an error trying to kick ${memberToKick}: ${error}`).then(console.log(`ERROR: ${error}`)))
            };
        } else if (sender[0][3] == true) {
            let memberToKick = message.mentions.members.first();
            if (memberToKick) {
                console.log(`Attempting to kick member ${memberToKick}`);
                memberToKick.kick({reason: `Manually kicked by ${message.author.username}`}).then((member) => {
                    message.channel.send(embeds.kickMessage);
                    sendDM.sendKicked(discordjs, discord, message, embeds);
                }).catch(error => message.channel.send(`There was an error trying to kick ${memberToKick}: ${error}`).then(console.log(`ERROR: ${error}`)));
            };
        };
        message.channel.stopTyping();
    };
};

async function ban(config, discordjs, discord, message, sender) {
    if (message.content.startsWith(`${config.masterConfig.prefix}ban`)) {
        if (message.member.hasPermission('BAN_MEMBERS')) {
            let memberToBan = message.mentions.members.first();
            if (memberToBan) {
                message.channel.startTyping();
                console.log(`Attempting to ban member ${memberToBan}`);
                memberToBan.ban({reason: `Manually banned by ${message.author.username}`}).then((member) => {
                    sendDM.sendBanned(discordjs, discord, message, embeds);
                }).catch(error => message.channel.send(`There was an error trying to ban ${memberToBan}: ${error}`).then(console.log(`ERROR: ${error}`)));
                message.channel.stopTyping();
            };
        } else if (sender[0][3] == true) {
            let memberToBan = message.mentions.members.first();
            if (memberToBan) {
                message.channel.startTyping();
                console.log(`Attempting to ban member ${memberToBan}`);
                memberToBan.ban({reason: `Manually banned by ${message.author.username}`}).then((member) => {
                    sendDM.sendBanned(discordjs, discord, message, embeds);
                }).catch(error => message.channel.send(`There was an error trying to ban ${memberToBan}: ${error}`).then(console.log(`ERROR: ${error}`)));
                message.channel.stopTyping();
            };
        };
    };
};

async function purge(SBconfig, discordjs, discord, message, sender) {
    if (message.content.startsWith(`${SBconfig.masterConfig.prefix}purge`)) {
        if (message.member.hasPermission(['ADMINISTRATOR'])) {
            message.channel.startTyping();
            var purgeCount = message.content.split(' ')[1];
            console.log(`Attempting to bulk delete ${purgeCount} messages`);
            message.channel.bulkDelete(purgeCount)
                .then(messages => message.channel.send(`Purged ${messages.size} messages`));
                message.channel.stopTyping();
        } else if (sender[0][3] == true) {
            message.channel.startTyping();
            var purgeCount = message.content.split(' ')[1];
            console.log(`Attempting to bulk delete ${purgeCount} messages`);
            message.channel.bulkDelete(purgeCount)
                .then(messages => message.channel.send(`A SniperBot admin purged ${messages.size} messages`).then(console.log(`ERROR: ${error}`)));
            message.channel.stopTyping();
        };
    };
};

module.exports = {
    kick,
    ban,
    purge
};