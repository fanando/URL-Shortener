/**
 * @fileoverview Integration tests for the URL routes
 */
const request = require('supertest');
const app = require('../../src/app');

jest.mock('../../src/config/redis', () => {
  return {
    redisClient: {
      zRemRangeByScore:jest.fn(),
      zCount: jest.fn().mockResolvedValue(),
      zAdd:jest.fn().mockResolvedValue(),
      expire:jest.fn().mockResolvedValue(),
      setEx: jest.fn(),
      get: jest.fn().mockResolvedValue(null),
      ttl: jest.fn().mockResolvedValue(1000),
      scan: jest.fn().mockResolvedValue({ cursor: 0, keys: [] }),
      multi: jest.fn().mockReturnValue({
        get: jest.fn(),
        exec: jest.fn().mockResolvedValue([]),
      }),
    },
  };
});

describe('URL Routes Integration', () => {
  it('POST /shorten -> creates a short URL', async () => {
    const res = await request(app)
      .post('/shorten')
      .send({ url: 'https://test.com' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('shortUrl');
  });

  it('GET /urls -> lists all URLs', async () => {
    const res = await request(app).get('/urls');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /:shortId -> 404 if not found', async () => {
    const res = await request(app).get('/abc123');
    expect(res.status).toBe(404);
    expect(res.body.error).toContain('not found');
  });
});
