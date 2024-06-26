// !sniperbot join
async function joinChannel(sender, TMI, fauna, q, channel, tags) {
  if (sender[0][2] == true) {
    TMI.say(channel, `${tags.username} SniperBot is already in the channel`)
  } else if (sender[0][2] == false) {
    await fauna.query(q.Update(q.Ref(q.Collection('twitch_users'), sender[0][0]), {
      data: {
        "inChannel": true,
        "options": {
          "insultThreshold": "6",
          "racismThreshold": "6",
          "threatThreshold": "6",
          "toxicityThreshold": "6"
        }
      }
    }, )).catch(error => console.log(error));
    TMI.join(tags.username)
      .then((data) => {
        TMI.say(channel, `Successfully joined channel ${tags.username}`);
      }).catch((err) => {
        TMI.say(channel, `${tags.username} there was an error joining your channel, please try again later or submit a bug report at http://adfoc.us/54699276390696 Error: ${err}`);
      });
  } else {
    fauna.query(q.Create(q.Collection("twitch_users"), {
      data: {
        "username": tags.username,
        "inChannel": true,
        "channelName": `#${tags.username}`,
        "isAdmin": false,
        "isBlacklisted": false
      }
    })).catch(error => `ERROR: ${error}`);
    TMI.join(tags.username)
      .then((data) => {
        TMI.say(channel, `Successfully joined channel ${tags.username}`);
      }).catch((err) => {
        TMI.say(channel, `${tags.username} there was an error joining your channel, please try again later or submit a bug report at http://adfoc.us/54699276390696 Error: ${err}`);
      });
  };
};

async function leaveChannel(sender, TMI, fauna, q, channel, tags) {
  if (sender[0][2] == true) {
    fauna.query(q.Update(q.Ref(q.Collection('twitch_users'), sender[0][0]), {
      data: {
        inChannel: false
      }
    }, )).catch(error => console.log(error));
    TMI.part(tags.username)
      .then((data) => {
        TMI.say(channel, `Successfully left channel ${tags.username}`);
      }).catch((err) => {
        TMI.say(channel, `${tags.username} there was an error leaving your channel, please try again later or submit a bug report at http://adfoc.us/54699276390696 Error: ${err}`);
      });

  } else if (sender[0][2] == false) {
    TMI.say(channel, `${tags.username} SniperBot is not in that channel`);
  } else {
    TMI.say(channel, `${tags.username} Database query returned null, please ensure sniperbot is in your channel before trying to remove it`);
  };
};

module.exports = {
  joinChannel,
  leaveChannel
};