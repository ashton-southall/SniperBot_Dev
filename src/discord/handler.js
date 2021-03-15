const options = require('./submodules/options.js');
const manualModeration = require('./submodules/manualModeration.js');
const blacklist = require('./submodules/blacklist.js');
const ping = require('./submodules/ping.js');
const embeds = require('./submodules/embeds.js');

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
}

module.exports = {
    run
};