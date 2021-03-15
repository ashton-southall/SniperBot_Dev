const options = require('./submodules/options.js');
const manualModeration = require('./submodules/manualModeration.js');
const blacklist = require('./submodules/blacklist.js');
const ping = require('./submodules/ping.js');
const help = require('./submodules/help.js');
const embeds = require('./submodules/embeds.js');
const { PageHelper } = require('faunadb');

async function run(config, discordjs, discord, message, sender, server, fauna, q) {
    options.doChannelOptions(config, embeds, discordjs, discord, message, sender, server, fauna, q).catch(error => console.log(error));
    blacklist.checkBlacklist(config, discordjs, discord, fauna, q, message, sender);
    // Add command handling
    blacklist.manageBlacklist(config, discordjs, discord, message, sender, fauna, q);
    // add command handling
    manualModeration.purge(config, discordjs, discord, message, sender);
    // add command handling
    manualModeration.kick(config, discordjs, discord, message, sender);
    // add command handling
    manualModeration.ban(config, discordjs, discord, message, sender);

    if (message.content == `${config.masterConfig.prefix}ping`) {
        ping.get(discordjs, discord, message);
    }

    if (message.content == `${config.masterConfig.prefix}help`) {
        help.send(message);
    }
}

module.exports = {
    run
};