const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function insert() {
  const imgBuffer = fs.readFileSync('C:/Users/Envy/.gemini/antigravity/brain/70358099-4f2f-4697-8209-7e7371575afa/.user_uploaded/media_1790316207791.jpg');
  const base64Img = 'data:image/jpeg;base64,' + imgBuffer.toString('base64');

  const product = await prisma.product.create({
    data: {
      title: "NAQSHINKOR O'YMA LAGAN",
      description: "O'LCHAMI 30 SM",
      oldPrice: 1500000,
      newPrice: 1200000,
      category: "O'yma naqsh",
      imageUrl: base64Img
    }
  });
  console.log('Inserted:', product.id, product.title);
}
insert().catch(console.error).finally(() => prisma.$disconnect());
