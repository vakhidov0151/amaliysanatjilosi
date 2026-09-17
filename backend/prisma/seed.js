const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany(); // Clear existing
  
  const artworks = [
    {
      title: "Kuzgi Manzara",
      description: "Moybo'yoq, 50x70 sm. Judayam chiroyli asar.",
      oldPrice: 600000,
      newPrice: 500000,
      category: "Moybo'yoq",
      imageUrl: "https://via.placeholder.com/400x400.png?text=Kuzgi+Manzara"
    },
    {
      title: "Naqshinkor Lali",
      description: "60x60 sm qo'lda mo'yqalam orqali qutichaga chizilgan",
      oldPrice: 1200000,
      newPrice: 1000000,
      category: "Naqsh",
      imageUrl: "https://via.placeholder.com/400x400.png?text=Naqshinkor+Lali"
    },
    {
      title: "Bahor Taronasi",
      description: "Akvarel, 40x50 sm. Tabiat uyg'onishi.",
      oldPrice: null,
      newPrice: 350000,
      category: "Akvarel",
      imageUrl: "https://via.placeholder.com/400x400.png?text=Bahor+Taronasi"
    },
    {
      title: "Tungi Shahar",
      description: "Grafika, A3 format. Zamonaviy uslub.",
      oldPrice: 450000,
      newPrice: 400000,
      category: "Grafika",
      imageUrl: "https://via.placeholder.com/400x400.png?text=Tungi+Shahar"
    }
  ];

  for (const art of artworks) {
    await prisma.product.create({ data: art });
  }
  
  console.log("Ma'lumotlar bazasiga namunaviy asarlar muvaffaqiyatli qo'shildi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
