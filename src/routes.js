// src/routes/url.routes.js
const express = require('express');
const router = express.Router();
const urlController = require('./controller');

router.post('/shorten', urlController.shortenUrl);
router.get('/urls', urlController.listUrls);
router.get('/:shortId', urlController.redirectUrl);

module.exports = router;
