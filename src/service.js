// src/services/url.service.js
const fs = require("fs");
const path = require("path");
const { redisClient } = require("./config/redis");
const { generateShortId } = require("./utils/utils");

async function createShortUrl(originalUrl) {
  const shortId = generateShortId();

  const key = `url:${shortId}`;
  const createdAt = Date.now();
  const data = {
    originalUrl,
    clickCount: 0,
    createdAt,
  };

  const recordTTL = 24*60*60;
  await redisClient.setEx(key, recordTTL, JSON.stringify(data));

  const archiveEntry = {
    shortId,
    originalUrl,
    createdAt,
    archivedAt: new Date().toISOString(),
  };
  const archivePath = path.join(__dirname, "../archive/shortenedUrls.log");
  fs.appendFileSync(archivePath, JSON.stringify(archiveEntry) + "\n");
  return { shortId, ...data };
}

async function getShortUrl(shortId) {
  const key = `url:${shortId}`;
  const rawData = await redisClient.get(key);
  if (!rawData) return null; 
  return JSON.parse(rawData);
}


async function incrementClickCount(shortId) {
  const key = `url:${shortId}`;
  const recordTTL = await redisClient.ttl(key);
  if (recordTTL <= 0) return null; 
  const rawData = await redisClient.get(key);
  if (!rawData) return null; 
  const data = JSON.parse(rawData);
  data.clickCount += 1;
  await redisClient.setEx(key, recordTTL, JSON.stringify(data));

  return data;
}

async function listAllUrls() {
  const results = [];
  let cursor = 0;

  do {
    const response = await redisClient.scan(cursor, {
      MATCH: "url:*",
      COUNT: 100,
    });

    const { cursor: nextCursor, keys } = response;
    cursor = nextCursor;

    const pipeline = redisClient.multi();
    keys.forEach((key) => pipeline.get(key));
    const rawValues = await pipeline.exec();

    for (let i = 0; i < keys.length; i++) {
      const rawData = rawValues[i];

      if (rawData) {
        const shortData = JSON.parse(rawData);

        const shortId = keys[i].split(":")[1];
        results.push({ shortId, ...shortData });
      }
    }
  } while (cursor !== 0);

  return results;
}

module.exports = {
  createShortUrl,
  getShortUrl,
  incrementClickCount,
  listAllUrls,
};
