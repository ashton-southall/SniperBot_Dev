async function checkBlacklist(sender, TMI, config, channel, tags) {
    if (typeof sender !== "undefined") {
        if (sender[0][5] === true) {
            TMI.timeout(channel, tags.username, config.twitchConfig.blacklist_ban_time, config.twitchConfig.blacklist_ban_reason).catch(error => `ERROR: ${error}`)
        }
    } else {
        setTimeout(checkBlacklist, 250);
    }
}

async function blacklistManagement(sender, TMI, fauna, q, config, channel, tags, message) {
    if (typeof sender !== "undefined") {
        if (sender[0][4] === true) {
            if (message.toLowerCase().startsWith(`${config.masterConfig.prefix}blacklist`)) {
                var action = message.split(' ')[1];
                var target = message.split(' ')[2];
                var response;
                var queryTarget = fauna.paginate(q.Match(q.Index("twitch.users.allInfo"), target))
                queryTarget.each(function (page) {
                    response = page
                })

                function waitForResponse() {
                    if (typeof response !== "undefined") {
                        console.log(response[0])
                        if (action == 'add') {
                            fauna.query(q.Update(q.Ref(q.Collection('twitch_users'), response[0][0]), {
                                    data: {
                                        isBlacklisted: true
                                    }
                                }))
                                .then(TMI.say(channel, `${tags.username} -> added ${target} to the global blacklist`))

                        } else if (action == 'remove') {
                            fauna.query(q.Update(q.Ref(q.Collection('twitch_users'), response[0][0]), {
                                    data: {
                                        "isBlacklisted": false,
                                    }
                                }))
                                .then(TMI.say(channel, `${tags.username} -> removed ${target} from the global blacklist`))
                        } else {
                            TMI.say(channel, `${tags.username} -> To use this command: ${config.masterConfig.prefix}blacklist [add/remove] [username]`)
                        }
                    } else {
                        setTimeout(waitForResponse, 250)
                    }
                }
                waitForResponse();
            }
        }
    }
}

module.exports = {
    checkBlacklist,
    blacklistManagement
}