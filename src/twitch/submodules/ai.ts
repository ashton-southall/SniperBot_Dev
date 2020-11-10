async function sendMessage(AI, TMI, channel, tags, message) {
    AI.message(message)
      .then((data) => {
        if (data.intents[0]) {
          if (data.intents[0].name == 'Banned' && data.intents[0].confidence > 0.9) {
            if (data.traits) {
              if (data.traits.Insult) {
                logger.info(`Detected: "Insult" in message, Purging Messages From ${tags.username}`);
                TMI.timeout(channel, tags.username, 1, config.masterConfig.automatedActionReason);
              } else if (data.traits.Racism) {
                logger.info(`Detected: "Racism" in message, Purging Messages From ${tags.username}`);
                TMI.timeout(channel, tags.username, 1, config.masterConfig.automatedActionReason);
              } else if (data.traits.Threat) {
                logger.info(`Detected: "Threat" in message, Purging Messages From ${tags.username}`);
                TMI.timeout(channel, tags.username, 1, config.masterConfig.automatedActionReason);
              } else if (data.traits.Toxicity) {
                logger.info(`Detected" "Toxicity" in message, Purging Messages From ${tags.username}`);
                TMI.timeout(channel, tags.username, 1, config.masterConfig.automatedActionReason);
              }
            }
          }
        }
      })
      .catch(console.error)
  }

  module.exports = {sendMessage}