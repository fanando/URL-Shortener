const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortId: {
    type: String,
    required: true,
    unique: true,
  },
  clickCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => {
    //   return new Date(Date.now() + 24 * 60 * 60 * 1000);
      return new Date(Date.now() +   60 * 1000);
    },
    index: { expireAfterSeconds: 0 }, // TTL index
  },
});

// If you want to update `expiresAt` logic after each save, you can do that too.
// For example, if you want a 24-hour sliding window from last click.

module.exports = mongoose.model('URL', urlSchema);
