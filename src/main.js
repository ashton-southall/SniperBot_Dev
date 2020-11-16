const discord = require('./discord/discord.js').catch(error => console.log(`ERROR: ${error}`));
const twitch = require('./twitch/twitch.js').catch(error => console.log(`ERROR: ${error}`));