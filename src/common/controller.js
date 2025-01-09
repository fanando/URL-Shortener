const urlService = require("./service");
const { createHashedPassword, comparePasswords } = require("../utils/utils");
const validator = require('validator');
/**
 * POST /shorten
 * Body: { "url": "https://example.com","password":String | Null }
 * Returns shorten id
 */
async function shortenUrl(req, res, next) {
  try {
    let { url, password } = req.body;
    let normalizeUrl = url ? url.trim() : '';
    if (!normalizeUrl)  return res.status(400).json({ error: "URL is required" });
    if (!normalizeUrl.startsWith("http://") && !normalizeUrl.startsWith("https://"))  normalizeUrl = `https://${normalizeUrl}`;
    if (!validator.isURL(normalizeUrl,{require_protocol:false})) return res.status(400).json({error: "Invalid URL Format" })

    let hashedPass = await createHashedPassword(password);

    const record = await urlService.createShortUrl(normalizeUrl, hashedPass);
    const shortUrl = `${req.protocol}://${req.get("host")}/${record.shortId}`;

    return res.json({ shortUrl });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /:shortId
 * Header Authroization:Bearer password (optional) 
 * Redirects if found, else 404
 */
async function redirectUrl(req, res, next) {
  try {
    const { shortId } = req.params;
    const record = await urlService.getShortUrl(shortId);
    // Normally i would change the endpoint to POST in that case rather than putting plain password in Auth header
    // Didnt know if thats ok
    const userInputPassword = req?.headers['authorization']?.split(' ')[1];
    if (!record) return res.status(404).json({ error: "URL not found or expired" });
    if (record.hashedPass && !userInputPassword ) return res.status(401).json({ error: "Password Required" });
    if (userInputPassword ) {
      const checkPass = await comparePasswords(userInputPassword , record.hashedPass);
      if (!checkPass)
        return res.status(401).json({ error: "Invalid Password" });
    }
    // we passed everything

    await urlService.incrementClickCount(shortId);
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
