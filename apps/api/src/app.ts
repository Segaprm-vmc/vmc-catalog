import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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

function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  try {
    const payload = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

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
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { category: true, characteristics: true }
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
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
    
    // Сначала удаляем все существующие характеристики
    await prisma.productCharacteristic.deleteMany({
      where: { productId: parseInt(id) }
    });
    
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
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
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
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