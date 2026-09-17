const { Telegraf, Markup } = require('telegraf');
const config = require('../config/default');

const bot = new Telegraf(config.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    "Assalomu alaykum! Amaliy San'at Jilosi do'koniga xush kelibsiz. 🎨\n\nQuyidagi tugmani bosib galereyamizga kiring va chiroyli asarlarni xarid qiling:",
    Markup.inlineKeyboard([
      Markup.button.webApp("🖼 Galereyani ochish", config.MINI_APP_URL)
    ])
  );
});

module.exports = bot;
