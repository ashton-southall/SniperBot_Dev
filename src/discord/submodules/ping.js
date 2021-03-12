async function get(discord, message) {
        message.channel.send('Loading data').then(async (msg) => {
            message.channel.send(`🏓Latency is ${msg.createdTimestamp - message.createdTimestamp}ms.`);
            msg.delete()
        })
    }

        module.exports = {
            get
        }