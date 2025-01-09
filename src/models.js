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
      return new Date(Date.now() + 24 * 60 * 60 * 1000);
    },
    index: { expireAfterSeconds: 0 },
  },
});

module.exports = mongoose.model('URL', urlSchema);
