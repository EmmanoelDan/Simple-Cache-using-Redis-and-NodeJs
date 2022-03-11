const redis = require('redis');

const {promisify} = require('util');

const PORT_REDIS = process.env.PORT_REDIS || 6379

const cache = redis.createClient(PORT_REDIS);

const getAsync = promisify(cache.get).bind(cache)
const setAsync = promisify(cache.set).bind(cache)


module.exports = { cache, getAsync, setAsync }