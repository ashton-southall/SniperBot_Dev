async function sendReply(discordjs, discord, message, embeds) {
    const newMessageEmbed = new discordjs.MessageEmbed().setColor('#ff5757').setTitle(`New Message`).addField(`User ID: ${message.author.id}`, `${message}`, true).setTimestamp().setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');
    message.author.send(embeds.DMReply)
    discord.channels.cache.get("707636583121158174").send(newMessageEmbed)
}

async function sendKicked(discordjs, discord, message, embeds) {
    const kickedMessage = new discordjs.MessageEmbed().setColor('#ff5757').setTitle(`You've been kicked!`).addField(`You were kicked from a server`).addField(`Manually kicked by ${message.author.username}`).setTimestamp().setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');
    message.mentions.members.first().send(kickedMessage)
}

async function sendBanned(discordjs, discord, message, embeds) {
    const bannedMessage = new discordjs.MessageEmbed().setColor('#ff5757').setTitle(`You've been banned!`).addField(`You have been banned from a server`, `Banned by ${message.author.username}`).setTimestamp().setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');
    message.mentions.members.first().send(bannedMessage)
}

module.exports = {
    sendReply,
    sendKicked,
    sendBanned
}