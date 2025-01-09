const bcrypt = require("bcryptjs");

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
  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let shortId = "";
  for (let i = 0; i < 6; i++) {
    shortId += chars[Math.floor(Math.random() * chars.length)];
  }
  return shortId;
}
async function createHashedPassword(password) {
  if (!password) return null;
  const hashedPass = await bcrypt.hash(password, 10);
  return hashedPass;
}
async function comparePasswords(password,recordHashedPassword){
  return await bcrypt.compare(password,recordHashedPassword);
}

module.exports = {
  isValidUrl,
  generateShortId,
  createHashedPassword,
  comparePasswords
};
