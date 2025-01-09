function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  }

  function generateShortId() {
    //gives you the most possible of options 62^6
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let shortId = "";
    for (let i = 0; i < 6; i++) {
      shortId += chars[Math.floor(Math.random() * chars.length)];
    }
    return shortId;
  }
  
  module.exports = {
    isValidUrl,
    generateShortId
  };
  