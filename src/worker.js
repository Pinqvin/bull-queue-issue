'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const redisClient = require('./redis-client');
const Queue = require('bull');

const processChunked = Promise.coroutine(function*(job) {
    // Chunk size
    const size = parseInt(process.env.WORKER_CHUNK_SIZE, 10);

    console.log(`Starting job ${job.jobId}, processing ${job.data.ids.length} ids in chunks of ${size}`);
    const chunks = _.chunk(job.data.ids, size);
    let sum = 0;

    for (let i = job.progress(); i < chunks.length; ++i) {
        try {
            // Do some work
            const result = yield Promise.resolve(1);
            console.log(`Finished work on chunk ${i + 1}`);

            sum += result;
            job.progress(i + 1);
        } catch(err) {
            console.log(`Error occurred: ${err}`);
        }

        yield Promise.delay(1000);
    }

    console.log(`Job ${job.jobId} finished, processed ${sum} ids`);
});

function processQueue(job) {
    return processChunked(job);
}

function listen(processingFunction) {
    const configurations = redisClient.getConfig();
    const config = configurations[0];
    const queueConfig = configurations[1];
    const worker = Queue('id queue', process.env.REDIS_PORT || config.port,
                         process.env.REDIS_HOST || config.hostname,
                         queueConfig);

    worker.on('ready', () => {
        console.log('Worker is ready');
    });

    worker.process(processingFunction);

    return worker;
}

if (require.main === module) {
    const queueConsumer = listen(processQueue);

    function stop(signal) {
        console.log(signal + ' received, stopping queue consumer...');
        queueConsumer.close();
        process.exit();
    }

    process.on('SIGTERM', stop.bind(this, 'SIGTERM'));
    process.on('SIGINT', stop.bind(this, 'SIGINT(Ctrl-C)'));

    process.on('uncaughtException', err => {
        console.log('Uncaught exception!');
        console.log(err);
        console.log(err.stack);
    });
}
