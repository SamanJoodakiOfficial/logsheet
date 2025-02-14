const Log = require('../models/log.model');

const logger = async (action, module = 'system', userId, userIp) => {
    try {
        if (!userId) {
            userId = null;
        }

        await Log.create({
            action,
            module,
            userId,
            userIp
        });

        return;

    } catch (error) {
        console.error(error.message);
    }
}

module.exports = logger;