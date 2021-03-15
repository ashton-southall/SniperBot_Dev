const embeds = require('./embeds.js');
async function send(message) {
    message.channel.startTyping();
    message.channel.send(embeds.helpEmbed);
    message.channel.stopTyping();
}

module.exports = {send};