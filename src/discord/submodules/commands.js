async function ping(discord, message) {
    message.channel.send(`Pong`)
}

module.exports = {
    ping
}