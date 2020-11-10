async function checkIfBlacklisted(sender, TMI, channel, tags) {
    if (typeof sender !== "undefined") {
        console.log(`running blacklist check`)
        console.log(sender)
        if (sender[0][5] == true) {
            console.log(`sender exists`)
            TMI.timeout(channel, tags.username, config.twitchConfig.blacklist_ban_time, config.twitchConfig.blacklist_ban_reason);
        } else if (sender.length == 0) {
            console.log(`Sender does not exist, creating entry`)
            fauna.query(q.Create(q.Collection("twitch_users"), {
                data: {
                    "username": tags.username,
                    "inChannel": false,
                    "channelName": `#${tags.username}`,
                    "isAdmin": false,
                    "isBlacklisted": false
                }
            }))
        }
    } else {
        setTimeout(checkIfBlacklisted, 250);
    }
}

module.exports = {checkIfBlacklisted}