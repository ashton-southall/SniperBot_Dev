async function run(sender, message, tags, channel, channelOptions, TMI, fauna, q, config){
    console.log(message.toLowerCase());
    if (message.toLowerCase() == `${config.masterConfig.prefix}help`){
        TMI.say(channel, `${tags.username}, Here's a list of commands available for SniperBot\n`)
    }
}

module.exports = {
    run
}