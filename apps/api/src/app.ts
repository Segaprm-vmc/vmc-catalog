import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

function authMiddleware(req, res, next) {
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

// TODO: добавить маршруты

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
  const products = await prisma.product.findMany({
    include: { category: true, characteristics: true }
  });
  res.json(products);
});
app.post('/api/products', authMiddleware, (req, res) => { res.status(201).json({}); });
app.put('/api/products/:id', authMiddleware, (req, res) => { res.json({}); });
app.delete('/api/products/:id', authMiddleware, (req, res) => { res.status(204).send(); });

// --- CATEGORIES ---
app.get('/api/categories', async (req, res) => {
  const categories = await prisma.category.findMany({
    include: { products: true }
  });
  res.json(categories);
});
app.post('/api/categories', authMiddleware, (req, res) => { res.status(201).json({}); });
app.put('/api/categories/:id', authMiddleware, (req, res) => { res.json({}); });
app.delete('/api/categories/:id', authMiddleware, (req, res) => { res.status(204).send(); });

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
}); 