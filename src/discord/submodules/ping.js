async function get(discordjs, discord, message) {
    const pingEmbed = new discordjs.MessageEmbed()
    .setColor('#ff5757')
    .setTitle(`🏓 Pong!`)
    .setDescription(`Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(discord.ws.ping)}ms`)
    .setURL('https://discord.io/sniperbot')
    .setTimestamp()
    .setFooter('© SniperBot By Adsnipers', 'https://i.imgur.com/WFj42aM.png');
    message.channel.startTyping();
    message.channel.send(pingEmbed);
    message.channel.stopTyping();
};

module.exports = {
    get
};