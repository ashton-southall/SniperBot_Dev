async function sendMessage(AI, message, messageDeletedEmbed) {
    if (message.channel.nsfw == false) {
        AI.message(message, {})
            .then((data) => {
                if (data.intents[0].name == 'Banned' && data.intents[0].confidence > 0.9) {
                    if (data.traits.Insult) {
                        message.delete().then((message) => {
                        message.channel.send(messageDeletedEmbed)
                        })
                    } else if (data.traits.Racism) {
                        message.delete().then((message) => {
                        message.channel.send(messageDeletedEmbed)
                        })
                    } else if (data.traits.Threat) {
                        message.delete().then((message) => {
                        message.channel.send(messageDeletedEmbed)
                        })
                    } else if (data.traits.Toxicity) {
                        message.delete().then((message) => {
                            message.channel.send(messageDeletedEmbed)
                        })
                    }
                }
            })
    }
}

module.exports = {
    sendMessage
}