async function sendMessage(config, AI, TMI, channel, tags, message, channelOptions) {
    AI.message(message)
      .then((data) => {
        if (data.intents[0]) {
          if (data.intents[0].name == 'Banned' && data.intents[0].confidence > 0.9) {
            if (data.traits) {
              if (data.traits.Insult) {
                if (channelOptions[0][0] > data.traits.Insult[0].value) {
                  console.log(`Detected: "Insult" in message, Purging Messages From ${tags.username}`);
                  TMI.timeout(channel, tags.username, 1, config.masterConfig.automatedActionReason).catch(error => `ERROR: ${error}`);
                };
              } else if (data.traits.Racism) {
                if (channelOptions[0][1] > data.traits.Racism[0].value) {
                  console.log(`Detected: "Racism" in message, Purging Messages From ${tags.username}`);
                  TMI.timeout(channel, tags.username, 1, config.masterConfig.automatedActionReason).catch(error => `ERROR: ${error}`);
                };
              } else if (data.traits.Threat) {
                if (channelOptions[0][2] > data.traits.Threat[0].value) {
                  console.log(`Detected: "Threat" in message, Purging Messages From ${tags.username}`);
                  TMI.timeout(channel, tags.username, 1, config.masterConfig.automatedActionReason).catch(error => `ERROR: ${error}`);
                };
              } else if (data.traits.Toxicity) {
                if (channelOptions[0][3] > data.traits.Insult[0].value) {
                  console.log(`Detected" "Toxicity" in message, Purging Messages From ${tags.username}`);
                  TMI.timeout(channel, tags.username, 1, config.masterConfig.automatedActionReason).catch(error => `ERROR: ${error}`);
                };
              };
            };
            console.log(data.intents[0].name && data.intents[0].confidence)
            
          };
          if (data.intents[0].name == 'bot_message' && data.intents[0].confidence > 0.9) {
            TMI.ban(channel, tags.username, config.masterConfig.bot_message_ban_reason).catch(error => `ERROR: ${error}`);
          }
        };
      })
      .catch(console.error);
  };

  module.exports = {sendMessage};