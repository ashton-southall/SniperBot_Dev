async function check(config, sender, TMI, fauna, q, channel, tags, channelmanagement) {
    if (message.toLowerCase().startsWith(`${config.masterConfig.prefix}sniperbot`)) {sniperbot(sender, TMI, fauna, q, channel, tags, channelmanagement);};
};

async function sniperbot(sender, TMI, fauna, q, channel, tags, channelmanagement) {
    var action = message.split(' ')[1];
    if (action == 'join') {
        channelmanagement.joinChannel(sender, TMI, fauna, q, channel, tags).catch(error => console.log(error));
    } else if (action == 'leave') {
        channelmanagement.leaveChannel(sender, TMI, fauna, q, channel, tags).catch(error => console.log(error));
    } else {
        TMI.say(channel, `SniperBot is an Advanced Moderation Bot for Twitch and Discord that utilizes Artificial Intelligence to make Moderation Decisions. Add SniperBot to your Twitch Chanel or Discord Server today and experience next level moderation https://sniperbot.tk`);
    };
};

module.exports = {
    check
};