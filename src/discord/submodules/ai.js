async function sendMessage(AI, message, messageDeletedEmbed) {
    if (message.channel.nsfw == false) {
        AI.message(message, {})
            .then((data) => {
                if (data.intents[0].name == 'Banned' && data.intents[0].confidence > 0.9) {
                    if (data.traits.Insult) {
                        console.log(`Detected: "Insult" in message, Purging Messages From ${tags.username}`);
                        message.delete().then((message) => {
                        message.channel.send(messageDeletedEmbed).catch(console.log(`ERROR: ${error}`))
                        }).catch(console.log(`ERROR: ${error}`))
                    } else if (data.traits.Racism) {
                        console.log(`Detected: "Racism" in message, Purging Messages From ${tags.username}`);
                        message.delete().then((message) => {
                        message.channel.send(messageDeletedEmbed).catch(console.log(`ERROR: ${error}`))
                        }).catch(console.log(`ERROR: ${error}`))
                    } else if (data.traits.Threat) {
                        console.log(`Detected: "Threat" in message, Purging Messages From ${tags.username}`);
                        message.delete().then((message) => {
                        message.channel.send(messageDeletedEmbed).catch(console.log(`ERROR: ${error}`))
                        }).catch(console.log(`ERROR: ${error}`))
                    } else if (data.traits.Toxicity) {
                        console.log(`Detected: "Toxicity" in message, Purging Messages From ${tags.username}`);
                        message.delete().then((message) => {
                            message.channel.send(messageDeletedEmbed).catch(console.log(`ERROR: ${error}`))
                        }).catch(console.log(`ERROR: ${error}`))
                    }
                }
            })
    }
}

module.exports = {
    sendMessage
}