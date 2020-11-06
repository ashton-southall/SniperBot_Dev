//@ts-ignore
async function sendReply(discordjs, discord, message, embeds) {
    const newMessageEmbed = new discordjs.MessageEmbed().setColor('#ff5757').setTitle(`New Message`).addField(`User ID: ${message.author.id}`, `${message}`, true).setTimestamp().setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png')
        message.author.send(embeds.DMReply)
        discord.channels.cache.get("707636583121158174").send(newMessageEmbed)
}

module.exports = {sendReply}