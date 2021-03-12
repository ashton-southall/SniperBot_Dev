async function get(discord, message) {
    message.channel.send(`🏓Latency is ${Date.now() - message.createdTimestamp}ms.`)
}

module.exports = {
    get
}