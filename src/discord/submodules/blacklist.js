async function checkisBlacklisted(SBconfig, discordjs, discord, message, sender) {
    console.log(`running blacklist check`);
        console.log(`sender exists`);
        console.log(sender);
        if (sender.length !== 0) {
            if (sender[0][3] == true) {
                message.member.kick().then(() => {
                    console.log(`Alert: user ${message.author.id} is blacklisted, kicking from server`);
                    message.channel.send(embeds.blacklistKick);
                    message.author.send(embeds.blacklistDM);
                }).catch(error => console.log(`ERROR: ${error}`))
            }
        } else {
            console.log(`Notice: User ${message.author.id} is not in database, creating entry`);
            fauna.query(q.Create(q.Collection("discord_users"), {data: {"id": message.author.id,"username": message.author.username,"isAdmin": false,"isBlacklisted": false}}))
            .catch(error => console.log(`ERROR: ${error}`))
        }
}

module.exports = {checkisBlacklisted}