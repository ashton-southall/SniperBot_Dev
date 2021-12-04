async function run(sender, message, tags, channel, channelOptions, TMI, fauna, q, config, self){
    console.log(message.toLowerCase());
    if (self) return;
    if (message.toLowerCase() == `${config.masterConfig.prefix}help`){
        TMI.say(channel, `${tags.username}, Here's a list of commands available for SniperBot`);
        TMI.say(channel, `${config.masterConfig.prefix}sniperbot join - SniperBot will connect to the sender's channel`);
        TMI.say(channel, `${config.masterConfig.prefix}sniperbot leave - SniperBot will disconnect from the sender's channel`);
        TMI.say(channel, `${config.masterConfig.prefix}options - Display a list of available options, to change this options: "!options {optionName} {value_in_number}" (Option names are case-sensitive)`);
    }
}

module.exports = {
    run
}

