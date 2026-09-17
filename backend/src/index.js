const express = require('express');
const cors = require('cors');
const config = require('./config/default');
const bot = require('./core/bot');

const cartController = require('./controllers/cartController');
const adminController = require('./controllers/adminController');

const app = express();
app.use(cors());
app.use(express.json());

// Client API (Mini App)
app.get('/api/products', cartController.getProducts);
app.post('/api/orders', cartController.submitOrder);
app.get('/api/orders/user/:userId', cartController.getUserOrders);

// Admin API
app.get('/api/admin/orders', adminController.getOrders);
app.get('/api/admin/products', adminController.getProducts);
app.post('/api/admin/products', adminController.createProduct);
app.put('/api/admin/products/:id', adminController.updateProduct);
app.delete('/api/admin/products/:id', adminController.deleteProduct);

// Start Server and Bot
app.listen(config.PORT, () => {
  console.log(`Backend server http://localhost:${config.PORT} da ishga tushdi.`);
  bot.launch().then(() => {
    console.log("Telegram Bot ishga tushdi!");
  });
});

// Enable graceful stop for Railway
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = app;
