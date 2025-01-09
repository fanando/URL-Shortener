const express = require('express');

const helmet = require('helmet');
const urlRoutes = require('./routes');
const rateLimiter = require('./middlewares/rateLimiter');


const app = express();

  

app.use(express.json());
app.use(helmet());

// Middleware
app.use(rateLimiter);         

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
