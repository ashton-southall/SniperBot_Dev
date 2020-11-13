async function sendMessage(logger, config, AI, TMI, channel, tags, message, channelOptions) {
    AI.message(message)
      .then((data) => {
        if (data.intents[0]) {
          if (data.intents[0].name == 'Banned' && data.intents[0].confidence > 0.9) {
            if (data.traits) {
              if (data.traits.Insult) {
                if (channelOptions[0][0] > data.traits.Insult[0].value) {
                  logger.info(`Detected: "Insult" in message, Purging Messages From ${tags.username}`);
                  TMI.timeout(channel, tags.username, 1, config.masterConfig.automatedActionReason);
                }
              } else if (data.traits.Racism) {
                if (channelOptions[0][1] > data.traits.Racism[0].value) {
                  logger.info(`Detected: "Racism" in message, Purging Messages From ${tags.username}`);
                  TMI.timeout(channel, tags.username, 1, config.masterConfig.automatedActionReason);
                }
              } else if (data.traits.Threat) {
                if (channelOptions[0][2] > data.traits.Threat[0].value) {
                  logger.info(`Detected: "Threat" in message, Purging Messages From ${tags.username}`);
                  TMI.timeout(channel, tags.username, 1, config.masterConfig.automatedActionReason);
                }
              } else if (data.traits.Toxicity) {
                if (channelOptions[0][3] > data.traits.Insult[0].value) {
                  logger.info(`Detected" "Toxicity" in message, Purging Messages From ${tags.username}`);
                  TMI.timeout(channel, tags.username, 1, config.masterConfig.automatedActionReason);
                }
              }
            }
          }
        }
      })
      .catch(console.error)
  }

  module.exports = {sendMessage}