require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  BOT_TOKEN: process.env.BOT_TOKEN,
  MINI_APP_URL: process.env.MINI_APP_URL,
};
