const Redis = require('ioredis');
const crypto = require('crypto');

class RedisDistributedLock {
    constructor(redisClient) {
        this.redis = redisClient;
    }

    /**
     * Attempts to acquire a distributed lock.
     * @param {string} resourceName - The name of the resource to lock.
     * @param {number} ttlMs - Time to live in milliseconds.
     * @returns {string|null} - Returns a unique lock value if acquired, or null if failed.
     */
    async acquireLock(resourceName, ttlMs = 5000) {
        const lockKey = `lock:${resourceName}`;
        const lockValue = crypto.randomUUID();

        // NX = Only set the key if it does not already exist
        // PX = Set the key's time to live in milliseconds
        const result = await this.redis.set(lockKey, lockValue, 'NX', 'PX', ttlMs);
        
        if (result === 'OK') {
            return lockValue;
        }
        return null;
    }

    /**
     * Releases a distributed lock using a Lua script to ensure atomicity.
     * @param {string} resourceName - The name of the resource to unlock.
     * @param {string} lockValue - The unique lock value returned during acquisition.
     * @returns {boolean} - True if successfully released, false otherwise.
     */
    async releaseLock(resourceName, lockValue) {
        const lockKey = `lock:${resourceName}`;
        
        // Lua script ensures atomic check-and-delete to prevent releasing someone else's lock
        const luaScript = `
            if redis.call("get", KEYS[1]) == ARGV[1] then
                return redis.call("del", KEYS[1])
            else
                return 0
            end
        `;
        
        const result = await this.redis.eval(luaScript, 1, lockKey, lockValue);
        return result === 1;
    }
}

module.exports = RedisDistributedLock;
