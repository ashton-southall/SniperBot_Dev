async function checkBlacklist(sender, TMI, channel, tags) {
    if (typeof sender !== "undefined") {
        if (sender[0][5] == true) {
            TMI.timeout(channel, tags.username, config.twitchConfig.blacklist_ban_time, config.twitchConfig.blacklist_ban_reason).catch(error => `ERROR: ${error}`)
        } 
    } else {
        setTimeout(checkBlacklist, 250);
    }
}

module.exports = {checkBlacklist}