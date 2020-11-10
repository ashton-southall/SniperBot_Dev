async function kick(SBconfig, discordjs, discord, message, sender) {
    if (message.content.startsWith(`${SBconfig.masterConfig.prefix}kick`)) {
        if (message.member.hasPermission(['KICK_MEMBERS'])) {
            let memberToKick = message.mentions.members.first();
            if (memberToKick) {
                memberToKick.kick({reason: `Manually kicked by ${message.author.username}`}).then((member) => {
                    message.channel.send(embeds.kickMessage)
                    sendDM.sendKicked(discordjs, discord, message, embeds)
                }).catch(error => message.channel.send(`There was an error trying to kick ${memberToKick}: ${error}`))
            }
        } else if (sender[0][3] == true) {
            let memberToKick = message.mentions.members.first();
            if (memberToKick) {
                memberToKick.kick({reason: `Manually kicked by ${message.author.username}`}).then((member) => {
                    message.channel.send(embeds.kickMessage)
                    sendDM.sendKicked(discordjs, discord, message, embeds)
                }).catch(error => message.channel.send(`There was an error trying to kick ${memberToKick}: ${error}`))
            }
        }
    }
}

async function ban(SBconfig, discordjs, discord, message, sender) {
    if (message.content.startsWith(`${SBconfig.masterConfig.prefix}ban`)) {
        if (message.member.hasPermission('BAN_MEMBERS')) {
            let memberToBan = message.mentions.members.first();
            if (memberToBan) {
                memberToBan.ban({reason: `Manually banned by ${message.author.username}`}).then((member) => {
                    sendDM.sendBanned(discordjs, discord, message, embeds);
                }).catch(error => message.channel.send(`There was an error trying to ban ${memberToBan}: ${error}`))
            }
        } else if (sender[0][3] == true) {
            let memberToBan = message.mentions.members.first();
            if (memberToBan) {
                memberToBan.ban({reason: `Manually banned by ${message.author.username}`}).then((member) => {
                    sendDM.sendBanned(discordjs, discord, message, embeds);
                }).catch(error => message.channel.send(`There was an error trying to ban ${memberToBan}: ${error}`))
            }
        }
    }
}

async function purge(SBconfig, discordjs, discord, message, sender) {
    if (message.content.startsWith(`${SBconfig.masterConfig.prefix}purge`)) {
        if (message.member.hasPermission(['ADMINISTRATOR'])) {
            var purgeCount = message.content.split(' ')[1]
            message.channel.bulkDelete(purgeCount)
                .then(messages => message.channel.send(`Purged ${messages.size} messages`))
        } else if (sender[0][3] == true) {
            var purgeCount = message.content.split(' ')[1]
            message.channel.bulkDelete(purgeCount)
                .then(messages => message.channel.send(`A SniperBot admin purged ${messages.size} messages`))
        }
    }
}

module.exports = {
    kick,
    ban,
    purge
}