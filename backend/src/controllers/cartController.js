const prisma = require('../database/connection');
const bot = require('../core/bot');

exports.getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { id: 'desc' } });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Xatolik yuz berdi" });
  }
};

exports.submitOrder = async (req, res) => {
  try {
    const { userId, name, phone, items, totalPrice, location } = req.body;
    
    // Save user if not exists
    let user = await prisma.user.findUnique({ where: { telegramId: String(userId) } });
    if (!user) {
      user = await prisma.user.create({
        data: { telegramId: String(userId), name, phone }
      });
    } else if (phone && user.phone !== phone) {
      user = await prisma.user.update({
        where: { telegramId: String(userId) },
        data: { phone }
      });
    }

    // Save order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        items,
        totalPrice,
        location
      }
    });

    // Notify user via Telegram Bot
    try {
      await bot.telegram.sendMessage(
        userId, 
        `🎉 Buyurtmangiz muvaffaqiyatli qabul qilindi!\n\nBuyurtma raqami: #${order.id}\nJami summa: ${totalPrice.toLocaleString()} so'm\n\nTez orada siz bilan bog'lanamiz! 🎨`
      );
    } catch (botError) {
      console.error("Bot xabari yuborishda xatolik:", botError);
    }

    res.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Buyurtmani saqlashda xatolik" });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({ where: { telegramId: String(userId) } });
    if (!user) return res.json([]);
    
    const orders = await prisma.order.findMany({ 
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Xatolik" });
  }
};
