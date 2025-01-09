/**
 * @fileoverview Unit tests for the URL Service
 */

const { createShortUrl, getShortUrl } = require('../../src/common/service');
const { redisClient } = require('../../src/config/redis');

jest.mock('../../src/config/redis', () => {
  // Provide a mock Redis client
  return {
    redisClient: {
      setEx: jest.fn(),
      get: jest.fn().mockResolvedValue(null),
      ttl: jest.fn(),
    },
  };
});

describe('URL Service - createShortUrl', () => {
  test('should create a short URL record with hashedPass = null if no password', async () => {
    const originalUrl = 'https://example.com';
    await createShortUrl(originalUrl, null);

    // Expect setEx to be called
    expect(redisClient.setEx).toHaveBeenCalledTimes(1);
  });
});

describe('URL Service - getShortUrl', () => {
  test('should return null if not found in Redis', async () => {
    redisClient.get.mockResolvedValueOnce(null); // simulate "not found"
    const record = await getShortUrl('unknownShortId');
    expect(record).toBeNull();
  });

  test('should return parsed record if found', async () => {
    const fakeData = JSON.stringify({ originalUrl: 'https://found.com' });
    redisClient.get.mockResolvedValueOnce(fakeData);

    const record = await getShortUrl('knownId');
    expect(record).toEqual({ originalUrl: 'https://found.com' });
  });
});
