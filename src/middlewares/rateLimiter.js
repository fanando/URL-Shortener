const { redisClient } = require('../config/redis');

module.exports = async (req, res, next) => {
  try {
    const ip = req.ip;
    const now = Date.now();
    const key = `rate:${ip}`;
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 100;
    
    await redisClient.zRemRangeByScore(key, 0, now - windowMs);

    const count = await redisClient.zCount(key, now - windowMs, now);

    if (count >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    await redisClient.zAdd(key, [{ score: now, value: now.toString() }]);
    await redisClient.expire(key, 60);

    next();
  } catch (err) {
    console.error('Rate limiter error:', err);
    next();
  }
};
