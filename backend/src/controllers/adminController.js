const prisma = require('../database/connection');

exports.getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Xatolik" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { id: 'desc' } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Xatolik" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { title, description, newPrice, oldPrice, category, imageUrl } = req.body;
    const product = await prisma.product.create({
      data: { title, description, newPrice: parseInt(newPrice), oldPrice: oldPrice ? parseInt(oldPrice) : null, category, imageUrl }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Xatolik" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, newPrice, oldPrice, category, imageUrl } = req.body;
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { title, description, newPrice: parseInt(newPrice), oldPrice: oldPrice ? parseInt(oldPrice) : null, category, imageUrl }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Xatolik" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: parseInt(id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Xatolik" });
  }
};
