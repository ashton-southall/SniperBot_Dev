async function checkisBlacklisted(sender, message) {
    if (typeof sender !== "undefined") {
        console.log(sender)
        if (sender.length !== 0) {
            if (sender[0][3] == true) {
                message.member.kick().then(() => {
                    message.channel.send(embeds.blacklistKick)
                    message.author.send(embeds.blacklistDM)
                }).catch(error => message.channel.send(`Hmm, there was a problem timing out blacklisted user ${message.author.username}, Only bad very bad people are put on the blacklist so keep an eye on them, okay? error: ${error}`))
            }
        } else {
            fauna.query(q.Create(q.Collection("discord_users"), {data: {"id": message.author.id,"username": message.author.username,"isAdmin": false,"isBlacklisted": false}}))
        }
    } else {
        setTimeout(checkisBlacklisted, 250)
    }

}

module.exports = {checkisBlacklisted}