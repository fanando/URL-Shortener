// src/middlewares/auth.middleware.js
module.exports = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token || token !== 'token') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  };
  