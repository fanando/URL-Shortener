// src/middlewares/rateLimiter.middleware.js
const { redisClient } = require('../config/redis');

module.exports = async (req, res, next) => {
  try {
    const ip = req.ip;
    const now = Date.now();
    const key = `rate:${ip}`;
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 100;

    // Remove older entries
    await redisClient.zRemRangeByScore(key, 0, now - windowMs);

    // Count current requests in window
    const count = await redisClient.zCount(key, now - windowMs, now);

    if (count >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    // Add new request
    await redisClient.zAdd(key, [{ score: now, value: now.toString() }]);
    // Set a small TTL so it doesn't grow unbounded
    await redisClient.expire(key, 60);

    next();
  } catch (err) {
    console.error('Rate limiter error:', err);
    // Degrade gracefully if there's a Redis issue
    next();
  }
};
