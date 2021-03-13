const embeds = require('./embeds.js')

async function sendMessage(AI, message) {
    if (message.channel.nsfw == false) {
        AI.message(message, {})
            .then((data) => {
                if (data.intents[0].name == 'Banned' && data.intents[0].confidence > 0.9) {
                    if (data.traits.Insult) {
                        message.channel.startTyping();
                        console.log(`Detected: "Insult" in message, Purging Messages From ${tags.username}`);
                        message.delete().then((message) => {
                        message.channel.send(embeds.messageDeleted).catch(console.log(`ERROR: ${error}`))
                        }).catch(console.log(`ERROR: ${error}`))
                        message.channel.stopTyping();
                    } else if (data.traits.Racism) {
                        message.channel.startTyping();
                        console.log(`Detected: "Racism" in message, Purging Messages From ${tags.username}`);
                        message.delete().then((message) => {
                        message.channel.send(embeds.messageDeleted).catch(console.log(`ERROR: ${error}`))
                        }).catch(console.log(`ERROR: ${error}`))
                        message.channel.stopTyping();
                    } else if (data.traits.Threat) {
                        message.channel.startTyping();
                        console.log(`Detected: "Threat" in message, Purging Messages From ${tags.username}`);
                        message.delete().then((message) => {
                        message.channel.send(embeds.messageDeleted).catch(console.log(`ERROR: ${error}`))
                        }).catch(console.log(`ERROR: ${error}`))
                        message.channel.stopTyping();
                    } else if (data.traits.Toxicity) {
                        message.channel.startTyping();
                        console.log(`Detected: "Toxicity" in message, Purging Messages From ${tags.username}`);
                        message.delete().then((message) => {
                            message.channel.send(embeds.messageDeleted).catch(console.log(`ERROR: ${error}`))
                        }).catch(console.log(`ERROR: ${error}`))
                        message.channel.stopTyping();
                    }
                }
            }).catch(err => console.err);
    }
}

module.exports = {
    sendMessage
}