'use strict';

const url = require('url');

function getConfig() {
    const redisConfig = url.parse(process.env.REDIS_URL || '');

    let queueConfig;
    if (redisConfig.auth !== null) {
        queueConfig = {
            password: redisConfig.auth.split(':')[1]
        }
    }

    return [redisConfig, queueConfig];
}

module.exports = {
    getConfig,
};
