async function get(discord, message) {
    message.channel.startTyping();
    message.channel.send(`🏓Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(discord.ws.ping)}ms`);
    message.channel.stopTyping();
}

module.exports = {
    get
}