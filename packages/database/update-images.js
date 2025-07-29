const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateImagePaths() {
  try {
    console.log('🔄 Обновление путей к изображениям...');
    
    // Получаем все товары
    const products = await prisma.product.findMany();
    
    for (const product of products) {
      const updatedImages = product.images.map(imageUrl => {
        // Если это placeholder, заменяем на локальный путь
        if (imageUrl.includes('via.placeholder.com')) {
          return `/uploads/products/${product.slug}-placeholder.jpg`;
        }
        
        // Если это внешний URL, оставляем как есть
        if (imageUrl.startsWith('http')) {
          return imageUrl;
        }
        
        // Если это уже локальный путь, оставляем как есть
        if (imageUrl.startsWith('/uploads/')) {
          return imageUrl;
        }
        
        // По умолчанию возвращаем placeholder
        return `/uploads/products/${product.slug}-default.jpg`;
      });
      
      // Обновляем товар
      await prisma.product.update({
        where: { id: product.id },
        data: { images: updatedImages }
      });
      
      console.log(`✅ Обновлен товар: ${product.name}`);
    }
    
    console.log('🎉 Все пути к изображениям обновлены!');
  } catch (error) {
    console.error('❌ Ошибка обновления:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateImagePaths(); 