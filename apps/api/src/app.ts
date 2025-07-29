import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Расширяем типы Express для JWT payload
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const app = express();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../web/public/uploads/products');
    // Создаем папку если её нет
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Генерируем уникальное имя файла
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB лимит
  },
  fileFilter: (req, file, cb) => {
    // Проверяем тип файла
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Только изображения разрешены'));
    }
  }
});

function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth = req.headers.authorization;
  console.log(`🔐 Проверка аутентификации для ${req.method} ${req.path}`);
  console.log(`📋 Заголовки:`, req.headers);
  
  if (!auth || !auth.startsWith('Bearer ')) {
    console.log(`❌ Нет токена в заголовке Authorization`);
    return res.status(401).json({ error: 'No token' });
  }
  
  try {
    const payload = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    req.user = payload;
    console.log(`✅ Токен валиден для пользователя:`, payload);
    next();
  } catch (error) {
    console.log(`❌ Невалидный токен:`, error);
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Статическая раздача загруженных файлов
app.use('/uploads', express.static(path.join(__dirname, '../../web/public/uploads')));

// --- AUTH ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// --- UPLOAD ---
app.post('/api/upload/images', authMiddleware, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Нет файлов для загрузки' });
    }

    const uploadedFiles = (req.files as Express.Multer.File[]).map(file => {
      return `/uploads/products/${file.filename}`;
    });

    res.json({ 
      success: true, 
      files: uploadedFiles,
      message: `Загружено ${uploadedFiles.length} файлов`
    });
  } catch (error) {
    console.error('Ошибка загрузки файлов:', error);
    res.status(500).json({ error: 'Ошибка загрузки файлов' });
  }
});

// Обработка ошибок multer
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Файл слишком большой (максимум 10MB)' });
    }
    return res.status(400).json({ error: 'Ошибка загрузки файла' });
  }
  if (error.message === 'Только изображения разрешены') {
    return res.status(400).json({ error: 'Только изображения разрешены' });
  }
  next(error);
});

// --- PRODUCTS ---
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, characteristics: true }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Запрос товара с ID: ${id}`);
    
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { category: true, characteristics: true }
    });
    
    if (!product) {
      console.log(`❌ Товар с ID ${id} не найден`);
      return res.status(404).json({ error: 'Product not found' });
    }
    
    console.log(`✅ Товар найден: ${product.name}`);
    res.json(product);
  } catch (error) {
    console.error(`💥 Ошибка при получении товара ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch product', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/products', authMiddleware, async (req, res) => {
  try {
    const { name, slug, description, categoryId, order, isActive, images, videoUrls, characteristics } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        categoryId: parseInt(categoryId),
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        images: images || [],
        videoUrls: videoUrls || [],
        characteristics: {
          create: characteristics?.filter((char: any) => char.value).map((char: any) => ({
            name: char.name,
            value: char.value
          })) || []
        }
      },
      include: { category: true, characteristics: true }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, categoryId, order, isActive, images, videoUrls, characteristics } = req.body;
    
    console.log(`✏️ Обновление товара ${id} с данными:`, req.body);
    
    // Создаем объект данных для обновления, исключая undefined значения
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (categoryId !== undefined) updateData.categoryId = parseInt(categoryId);
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (images !== undefined) updateData.images = images;
    if (videoUrls !== undefined) updateData.videoUrls = videoUrls;
    
    console.log(`📝 Данные для обновления:`, updateData);
    
    // Сначала удаляем все существующие характеристики, если они переданы
    if (characteristics !== undefined) {
      await prisma.productCharacteristic.deleteMany({
        where: { productId: parseInt(id) }
      });
    }
    
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...updateData,
        ...(characteristics !== undefined && {
          characteristics: {
            create: characteristics.filter((char: any) => char.value).map((char: any) => ({
              name: char.name,
              value: char.value
            }))
          }
        })
      },
      include: { category: true, characteristics: true }
    });
    
    console.log(`✅ Товар успешно обновлен: ${product.name}`);
    res.json(product);
  } catch (error) {
    console.error(`💥 Ошибка при обновлении товара ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update product', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.delete('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// --- CATEGORIES ---
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { products: true }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: { products: true }
    });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

app.post('/api/categories', authMiddleware, async (req, res) => {
  try {
    const { name, slug, description, order } = req.body;
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        order: order || 0
      },
      include: { products: true }
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.put('/api/categories/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, order } = req.body;
    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        name,
        slug,
        description,
        order: order || 0
      },
      include: { products: true }
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/categories/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
}); 