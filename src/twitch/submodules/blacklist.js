async function checkIfBlacklisted(sender, TMI, fauna, q, channel, tags) {
    if (typeof sender !== "undefined") {
        console.log(`running blacklist check`)
        console.log(sender)
        if (sender.length == 0) {
            console.log(`${tags.username} does not exist in database, creating entry`)
            fauna.query(q.Create(q.Collection("twitch_users"), {
                data: {
                    "username": tags.username,
                    "inChannel": false,
                    "channelName": `#${tags.username}`,
                    "isAdmin": false,
                    "isBlacklisted": false,
                    "options": {
                        "insultThreshold": "6",
                        "racismThreshold": "6",
                        "threatThreshold": "6",
                        "toxicityThreashold": "6"
                      }
                }
            })).catch(error => `ERROR: ${error}`)
        }
        else if (sender[0][5] == true) {
            console.log(`sender exists`)
            TMI.timeout(channel, tags.username, config.twitchConfig.blacklist_ban_time, config.twitchConfig.blacklist_ban_reason).catch(error => `ERROR: ${error}`)
        } 
    } else {
        setTimeout(checkIfBlacklisted, 250);
    }
}

module.exports = {checkIfBlacklisted}