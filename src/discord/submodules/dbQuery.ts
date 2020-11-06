async function querySenderInfo(fauna, q, message) {
    var sender;
    const querySender = fauna.paginate(q.Match(q.Index("discord.users.allInfo"), message.author.id))
    querySender.each(function (page) {
        sender = page
    })
}

module.exports = {querySenderInfo}