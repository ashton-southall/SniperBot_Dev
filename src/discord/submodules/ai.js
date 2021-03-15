const embeds = require('./embeds.js');
const config = require('../../config.json');

async function sendMessage(server, AI, message) {
    if (message.channel.nsfw == false) {
        AI.message(message)
            .then((data) => {
                console.log(data.traits)
                if (data.intents[0]) {
                    if (data.intents[0].name == 'Banned' && data.intents[0].confidence > 0.9) {
                        if (data.traits) {
                            if (data.traits.Insult) {
                                if (server[0][2] < data.traits.Insult[0].value) {
                                    message.channel.startTyping();
                                    message.delete().then((message) => {
                                        message.channel.send(embeds.messageDeleted).catch(console.log(error => (`ERROR: ${error}`)));
                                    }).catch(console.log(error => (`ERROR: ${error}`)));
                                    message.channel.stopTyping();
                                };
                            } else if (data.traits.Racism) {
                                if (server[0][3] < data.traits.Racism[0].value) {
                                    message.channel.startTyping();
                                    message.delete().then((message) => {
                                        message.channel.send(embeds.messageDeleted).catch(console.log(error => (`ERROR: ${error}`)));
                                    }).catch(console.log(error => (`ERROR: ${error}`)));
                                    message.channel.stopTyping();
                                };
                            } else if (data.traits.Threat) {
                                if (server[0][4] < data.traits.Threat[0].value) {
                                    message.channel.startTyping();
                                    message.delete().then((message) => {
                                        message.channel.send(embeds.messageDeleted).catch(console.log(error => (`ERROR: ${error}`)));
                                    }).catch(console.log(error => (`ERROR: ${error}`)));
                                    message.channel.stopTyping();
                                };
                            } else if (data.traits.Toxicity) {
                                if (server[0][5] < data.traits.Insult[0].value) {
                                    message.channel.startTyping();
                                    message.delete().then((message) => {
                                        message.channel.send(embeds.messageDeleted).catch(console.log(error => (`ERROR: ${error}`)));
                                    }).catch(console.log(error => (`ERROR: ${error}`)));
                                    message.channel.stopTyping();
                                };
                            };
                        };
                    };
                };
            })
            .catch(console.error);
    };
};


module.exports = {
    sendMessage
}