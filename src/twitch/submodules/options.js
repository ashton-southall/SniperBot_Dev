async function doChannelOptions(sender, message, tags, channel, channelOptions, TMI, fauna, q, config) {
    if (message.toLowerCase().startsWith(`${config.masterConfig.prefix}options`)) {
        if (`#${tags.username}` == channel) {
            var optionToChange = message.toLowerCase().split(' ')[1]
            var optionValue = message.split(' ')[2]
            if (typeof optionToChange !== "undefined") {
                if (typeof optionValue !== "undefined") {
                    if (optionToChange == 'insultthreshold') {
                        console.log(`Notice: User updating option ${optionToChange}`);
                        fauna.query(q.Update(q.Ref(q.Collection('twitch_users'), sender[0][0]), {data: {options: {insultThreshold: optionValue}}}, ))
                        .catch(error => TMI.say(channel, `There was an error changing channel options, please double check your message, if you dont see an issue contact support at http://adfoc.us/54699276543906\r error: ${error}`).then(error => `ERROR: ${error}`))
                        .then(TMI.say(channel, `Channel options changed successfully`))
                    }
                    else if (optionToChange == 'racismthreshold') {
                        console.log(`Notice: User updating option ${optionToChange}`);
                        fauna.query(q.Update(q.Ref(q.Collection('twitch_users'), sender[0][0]), {data: {options: {racismThreshold: optionValue}}}, ))
                        .catch(error => TMI.say(channel, `There was an error changing channel options, please double check your message, if you dont see an issue contact support at http://adfoc.us/54699276543906\r error: ${error}`).then(error => `ERROR: ${error}`))
                        .then(TMI.say(channel, `Channel options changed successfully`))
                    }
                    else if (optionToChange == 'threatthreshold') {
                        console.log(`Notice: User updating option ${optionToChange}`);
                        fauna.query(q.Update(q.Ref(q.Collection('twitch_users'), sender[0][0]), {data: {options: {threatThreshold: optionValue}}}, ))
                        .catch(error => TMI.say(channel, `There was an error changing channel options, please double check your message, if you dont see an issue contact support at http://adfoc.us/54699276543906\r error: ${error}`).then(error => `ERROR: ${error}`))
                        .then(TMI.say(channel, `Channel options changed successfully`))
                    }
                    else if (optionToChange == 'toxicitythreshold') {
                        console.log(`Notice: User updating option ${optionToChange}`);
                        fauna.query(q.Update(q.Ref(q.Collection('twitch_users'), sender[0][0]), {data: {options: {toxicityThreshold: optionValue}}}, ))
                        .catch(error => TMI.say(channel, `There was an error changing channel options, please double check your message, if you dont see an issue contact support at http://adfoc.us/54699276543906\r error: ${error}`).then(error => `ERROR: ${error}`))
                        .then(TMI.say(channel, `Channel options changed successfully`))
                    }
                }
            } else {
                TMI.say(channel, `Channel options for channel ${tags.username}: insultThreshold: ${channelOptions[0][0]}, racismThreshold: ${channelOptions[0][1]}, threatThreshold: ${channelOptions[0][2]}, toxicityThreshold ${channelOptions[0][3]}`);
            }
        }
    }
}

module.exports = {
    doChannelOptions
}