// src/app.js
// require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
// const helmet = require('helmet');

const urlRoutes = require('./routes');
// (Optional) Rate limiting and Auth
const rateLimiter = require('./middlewares/rateLimiter');
const authMiddleware = require('./middlewares/auth');

const app = express();
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.originalUrl}`);
    next();
  });
  
// Middleware
app.use(express.json());
app.use(morgan('dev'));
// app.use(helmet());

app.use(rateLimiter);         // optional
app.use(authMiddleware);      // optional

app.use('/', urlRoutes);




// Simple Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`URL Shortener running on port ${PORT}`);
});
