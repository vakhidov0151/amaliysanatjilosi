const { Telegraf, Markup } = require('telegraf');
const config = require('../config/default');

const bot = new Telegraf(config.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    "Assalomu alaykum! Onlayn Dorixona (Apteka) botiga xush kelibsiz. ??\n\nQuyidagi tugmani bosib katalogimizga kiring va kerakli dori hamda vitaminlarni uydan chiqmay buyurtma qiling:",
    Markup.inlineKeyboard([
      Markup.button.webApp("?? Dorixonani ochish", config.MINI_APP_URL)
    ])
  );
});

module.exports = bot;
