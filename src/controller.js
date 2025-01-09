// src/controllers/url.controller.js
const urlService = require("./service");

/**
 * POST /shorten
 * Body: { "url": "https://example.com" }
 * Returns shorten id
 */
async function shortenUrl(req, res, next) {
  try {
    let { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }

    // Create short URL record
    const record = await urlService.createShortUrl(url);
    const shortUrl = `${req.protocol}://${req.get("host")}/${record.shortId}`;

    return res.json({ shortUrl });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /:shortId
 * Redirects if found, else 404
 */
async function redirectUrl(req, res, next) {
  try {
    const { shortId } = req.params;
    const record = await urlService.getShortUrl(shortId);

    if (!record) {
      return res.status(404).json({ error: "URL not found or expired" });
    }

    // increment the click count
    await urlService.incrementClickCount(shortId);

    // redirect to original
    return res.redirect(record.originalUrl);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /urls
 * Lists all shortened URLs from Redis
 */
async function listUrls(req, res, next) {
  try {
    const urls = await urlService.listAllUrls();

    const mapped = urls.map((item) => ({
      shortId: item.shortId,
      shortUrl: `${req.protocol}://${req.get("host")}/${item.shortId}`,
      originalUrl: item.originalUrl,
      clickCount: item.clickCount,
      createdAt: new Date(item.createdAt).toISOString(),
    }));
    res.json(mapped);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  shortenUrl,
  redirectUrl,
  listUrls,
};
