const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

// duplicate redis server
const sub = redisClient.duplicate();

function fib(index) {
    if (index < 2) {
        return 1;
    }
    return fib(index - 1) + fib(index - 2);
}

// any time we get a message run this cb
sub.on('message', (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message)));
})

// Any time we get an insert message
sub.subscribe('insert');