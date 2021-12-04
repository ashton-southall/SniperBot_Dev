const faunadb = require('faunadb');
const q = faunadb.query;

var channelList;
const fauna = new faunadb.Client({
  secret: process.env.FAUNA_TOKEN
});
const channels = fauna.paginate(q.Match(q.Index("twitch.channelList"), true));
channels.each(function (page) {
  channelList = page
});

var sender;
      var channelOptions;
      var querySender = fauna.paginate(q.Match(q.Index("twitch.users.allInfo"), tags.username));
      querySender.each(function (page) {
        sender = page
      });
      var queryChannelOptions = fauna.paginate(q.Match(q.Index("twitch.users.channelOptions"), tags.username));
      queryChannelOptions.each(function (page) {
        channelOptions = page
      });

async function checkUsername(sender, TMI, fauna, q, channel, tags) {
    if (typeof sender !== "undefined") {
        console.log(sender);
        if (sender.length == 0) {
            fauna.query(q.Create(q.Collection("twitch_users"), {
                data: {
                    "username": tags.username,
                    "inChannel": false,
                    "channelName": `#${tags.username}`,
                    "isAdmin": false,
                    "isBlacklisted": false,
                }
            })).catch(error => `ERROR: ${error}`);
        }
    } else {
        setTimeout(checkUsername, 250);
    };
};

module.exports = {
    checkUsername
}