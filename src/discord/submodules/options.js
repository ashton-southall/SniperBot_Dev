async function doChannelOptions(config, discordjs, discord, message, sender, server, fauna, q) {
    if (message.content.startsWith(`${config.masterConfig.prefix}options`)) {
        if (message.member.hasPermission(['ADMINISTRATOR']) || sender[0][2] == true) {
            var optionToChange = message.content.split(' ')[1]
            var optionValue = message.content.split(' ')[2]
            if (typeof optionToChange !== "undefined") {
                if (typeof optionValue !== "undefined") {
                    if (optionToChange == 'insultthreshold') {
                        console.log(`Notice: User updating option ${optionToChange}`);
                        fauna.query(q.Update(q.Ref(q.Collection('discord_servers'), sender[0][0]), {data: {options: {insultThreshold: optionValue}}}, ))
                        .catch(error => message.channel.send(`There was an error changing channel options, please double check your message, if you dont see an issue contact support at http://adfoc.us/54699276543906\r error: ${error}`).then(error => `ERROR: ${error}`))
                        .then(message.channel.send(`Channel options changed successfully`))
                    }
                    else if (optionToChange == 'racismthreshold') {
                        console.log(`Notice: User updating option ${optionToChange}`);
                        fauna.query(q.Update(q.Ref(q.Collection('discord_servers'), sender[0][0]), {data: {options: {racismThreshold: optionValue}}}, ))
                        .catch(error => message.channel.send(`There was an error changing channel options, please double check your message, if you dont see an issue contact support at http://adfoc.us/54699276543906\r error: ${error}`).then(error => `ERROR: ${error}`))
                        .then(message.channel.send(`Options changed successfully`))
                    }
                    else if (optionToChange == 'threatthreshold') {
                        console.log(`Notice: User updating option ${optionToChange}`);
                        fauna.query(q.Update(q.Ref(q.Collection('discord_servers'), sender[0][0]), {data: {options: {threatThreshold: optionValue}}}, ))
                        .catch(error => message.channel.send(`There was an error changing channel options, please double check your message, if you dont see an issue contact support at http://adfoc.us/54699276543906\r error: ${error}`).then(error => `ERROR: ${error}`))
                        .then(message.channel.send(`Options changed successfully`))
                    }
                    else if (optionToChange == 'toxicitythreshold') {
                        console.log(`Notice: User updating option ${optionToChange}`);
                        fauna.query(q.Update(q.Ref(q.Collection('discord_servers'), sender[0][0]), {data: {options: {toxicityThreshold: optionValue}}}, ))
                        .catch(error => message.channel.send(`There was an error changing channel options, please double check your message, if you dont see an issue contact support at http://adfoc.us/54699276543906\r error: ${error}`).then(error => `ERROR: ${error}`))
                        .then(message.channel.send(`Options changed successfully`))
                    }
                }
            } else {
                message.channel.send(`Options for server ${server[0][0]}: insultThreshold: ${options[0][0]}, racismThreshold: ${options[0][1]}, threatThreshold: ${options[0][2]}, toxicityThreshold ${options[0][3]}`);
            }
        }
    }
}

module.exports = {
    doChannelOptions
}