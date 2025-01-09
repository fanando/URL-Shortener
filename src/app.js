const express = require('express');

const helmet = require('helmet');
const urlRoutes = require('./common/routes');
const rateLimiter = require('./middlewares/rateLimiter');


const app = express();

  

app.use(express.json());
app.use(helmet());
app.use(rateLimiter);         
app.use('/', urlRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
module.exports = app;