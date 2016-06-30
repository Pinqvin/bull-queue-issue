'use strict';

const redisClient = require('./redis-client');
const Queue = require('bull');
const uuid = require('node-uuid');

function addToQueue(data) {
    const configurations = redisClient.getConfig();
    const config = configurations[0];
    const queueConfig = configurations[1];
    const idQueue = Queue('id queue', process.env.REDIS_PORT || config.port,
                          process.env.REDIS_HOST || config.hostname,
                          queueConfig);

    idQueue.on('ready', () => {
        console.log('Id queue is ready')
        idQueue.add(data);
    });

    idQueue.on('error', err => {
        console.log('An error occurred in the id queue');
        console.log(err.stack);
        console.log(err);
    });
}

if (require.main === module) {
    const ids = [];
    const jobSize = parseInt(process.env.JOB_SIZE, 10);

    for (let i = 0; i < jobSize; ++i) {
        ids.push(uuid.v4());
    }

    addToQueue({ids});
}
