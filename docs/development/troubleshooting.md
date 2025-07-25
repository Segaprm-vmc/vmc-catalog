 # Troubleshooting - VMC Учебник

## Частые проблемы и решения

### Проблемы установки и настройки

#### 1. Cannot find module '@prisma/client'
```bash
# Проблема: Prisma клиент не сгенерирован
# Решение:
cd packages/database
npx prisma generate

# Если не помогает:
rm -rf node_modules
npm install
npx prisma generate
```

#### 2. Module not found: Can't resolve 'bcryptjs'
```bash
# Проблема: Отсутствует зависимость bcryptjs
# Решение:
npm install bcryptjs @types/bcryptjs

# В seed.ts проверить импорт:
import bcrypt from 'bcryptjs';
```

#### 3. Cannot find name 'process'
```typescript
// Проблема: Отсутствуют типы Node.js
// Решение: Установить типы
npm install --save-dev @types/node

// В tsconfig.json добавить:
{
  "compilerOptions": {
    "types": ["node"]
  }
}
```

#### 4. Turbo: command not found
```bash
# Проблема: Turbo не установлен глобально
# Решение:
npm install -g turbo

# Или использовать npx:
npx turbo dev
```

### Проблемы с базой данных

#### 1. Database connection refused
```bash
# Проблема: PostgreSQL не запущен или неверные настройки
# Решение:

# Проверить статус PostgreSQL
sudo systemctl status postgresql

# Запустить PostgreSQL
sudo systemctl start postgresql

# Проверить переменные окружения
echo $DATABASE_URL

# Исправить URL в .env:
DATABASE_URL="postgresql://user:password@localhost:5432/vmc_handbook"
```

#### 2. Migration failed
```bash
# Проблема: Ошибка при выполнении миграций
# Решение:

# Сбросить базу данных (ОСТОРОЖНО!)
npx prisma migrate reset

# Применить миграции заново
npx prisma migrate dev

# Если проблема в схеме - исправить schema.prisma и:
npx prisma db push
```

#### 3. Seed script fails
```bash
# Проблема: Ошибка при заполнении данными
# Решение:

# Проверить подключение к БД
npx prisma studio

# Очистить данные перед seed
npx prisma migrate reset

# Запустить seed отдельно
npx prisma db seed

# Проверить логи ошибок в консоли
```

### Проблемы с Next.js

#### 1. Module build failed: ReferenceError
```javascript
// Проблема: Использование browser API на сервере
// ❌ Неправильно:
function Component() {
  const width = window.innerWidth; // Ошибка на сервере
}

// ✅ Правильно:
function Component() {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);
}
```

#### 2. Hydration failed
```typescript
// Проблема: Разное содержимое на сервере и клиенте
// ❌ Неправильно:
function Component() {
  return <div>{new Date().toString()}</div>;
}

// ✅ Правильно:
function Component() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return <div>{new Date().toString()}</div>;
}
```

#### 3. Image optimization error
```typescript
// Проблема: Неправильная настройка изображений
// ✅ Решение в next.config.js:
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'your-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
};

module.exports = nextConfig;
```

### Проблемы с Tailwind CSS

#### 1. Styles not applying
```css
/* Проблема: Стили не применяются */
/* Решение: Проверить импорт в globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Проверить настройку в tailwind.config.js */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'vmc-red': '#EC2834',
        'vmc-black': '#1E1E1E',
        'vmc-gray': '#CCCCCC',
      },
    },
  },
  plugins: [],
};
```

#### 2. Custom colors not working
```typescript
// Проблема: Кастомные цвета VMC не работают
// ✅ Решение в tailwind.config.js:
module.exports = {
  theme: {
    extend: {
      colors: {
        vmc: {
          red: '#EC2834',
          'red-light': '#F5B7BB',
          'red-dark': '#C41E2A',
          black: '#1E1E1E',
          gray: '#CCCCCC',
        },
      },
    },
  },
};

// Использование:
<div className="bg-vmc-red text-vmc-black">
```

### Проблемы с TypeScript

#### 1. Type errors in Prisma
```typescript
// Проблема: Ошибки типов Prisma
// Решение: Регенерировать клиент
npx prisma generate

// Проверить импорт типов:
import { Product, Category } from '@prisma/client';

// Для связанных данных:
import { Prisma } from '@prisma/client';
type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true; characteristics: true }
}>;
```

#### 2. Module resolution errors
```json
// Проблема: TypeScript не находит модули
// Решение в tsconfig.json:
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  }
}
```

#### 3. Cannot use import statement outside module
```json
// Проблема: Ошибка импорта в Node.js
// Решение в package.json:
{
  "type": "module"
}

// Или переименовать файлы в .mjs/.mts
```

### Проблемы с API

#### 1. CORS errors
```typescript
// Проблема: CORS блокирует запросы
// Решение в API middleware:
import cors from 'cors';

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://vmc-handbook.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));
```

#### 2. 404 Not Found на API routes
```typescript
// Проблема: API маршруты не работают в Next.js
// Решение: Проверить структуру app/api/
app/
├── api/
│   ├── products/
│   │   ├── route.ts          // GET/POST /api/products
│   │   └── [id]/
│   │       └── route.ts      // GET/PUT/DELETE /api/products/[id]
│   └── categories/
│       └── route.ts

// В route.ts экспортировать HTTP методы:
export async function GET(request: Request) {
  // логика
}

export async function POST(request: Request) {
  // логика
}
```

#### 3. Request timeout
```typescript
// Проблема: Запросы таймаутят
// Решение: Увеличить timeout
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000);

try {
  const response = await fetch('/api/products', {
    signal: controller.signal
  });
} finally {
  clearTimeout(timeoutId);
}
```

### Проблемы с производительностью

#### 1. Медленная загрузка страниц
```typescript
// Проблема: Большие бандлы
// Решение: Анализ бандла
npm install --save-dev @next/bundle-analyzer

// В next.config.js:
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

// Запуск анализа:
ANALYZE=true npm run build
```

#### 2. Медленные API запросы
```typescript
// Проблема: N+1 запросы к базе
// ❌ Неправильно:
const products = await prisma.product.findMany();
for (const product of products) {
  const category = await prisma.category.findUnique({
    where: { id: product.categoryId }
  });
}

// ✅ Правильно:
const products = await prisma.product.findMany({
  include: {
    category: true,
    characteristics: true
  }
});
```

#### 3. Большие изображения
```typescript
// Проблема: Неоптимизированные изображения
// Решение: Next.js Image + оптимизация
import Image from 'next/image';

// Вместо <img>:
<Image
  src={product.image}
  alt={product.name}
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Проблемы с аутентификацией

#### 1. NextAuth session not working
```typescript
// Проблема: Сессия не сохраняется
// Решение: Проверить переменные окружения
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="super-secret-key"

// Проверить SessionProvider:
import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
```

#### 2. JWT token errors
```typescript
// Проблема: Ошибки JWT токенов
// Решение в [...nextauth].ts:
export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 часа
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
});
```

### Проблемы с готовыми админками

#### 1. React Admin не подключается к API
```typescript
// Проблема: React Admin не может подключиться
// Решение: Правильный dataProvider
import { fetchUtils, Admin, Resource } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  options.headers.set('Authorization', `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
};

const dataProvider = jsonServerProvider('/api', httpClient);

function App() {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="products" />
    </Admin>
  );
}
```

#### 2. shadcn/ui components not styling
```bash
# Проблема: shadcn/ui компоненты не стилизуются
# Решение: Правильная инициализация
npx shadcn-ui@latest init

# Проверить components.json:
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### Проблемы с развертыванием

#### 1. Build fails in production
```bash
# Проблема: Сборка падает в продакшене
# Решение: Проверить переменные окружения

# Локально тестировать продакшен сборку:
npm run build
npm run start

# Проверить логи сборки:
npm run build -- --debug
```

#### 2. Environment variables not working
```bash
# Проблема: Переменные окружения не работают
# Решение: Правильные префиксы

# Для клиентской стороны (Next.js):
NEXT_PUBLIC_API_URL="https://api.example.com"

# Для серверной стороны:
DATABASE_URL="postgresql://..."
JWT_SECRET="secret"

# В коде:
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

### Инструменты для диагностики

#### 1. Анализ производительности
```bash
# Next.js анализ:
npm run build
npm run start

# Chrome DevTools:
# Performance tab -> Record -> Analyze

# Lighthouse audit:
# DevTools -> Lighthouse -> Analyze
```

#### 2. Отладка API
```bash
# Использовать curl для тестирования:
curl -X GET http://localhost:8000/api/products
curl -X POST http://localhost:8000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product"}'

# Использовать Postman или Insomnia
# Проверить логи сервера
```

#### 3. Отладка базы данных
```bash
# Prisma Studio для визуального просмотра:
npx prisma studio

# Прямые SQL запросы:
psql $DATABASE_URL
\dt  # Показать таблицы
SELECT * FROM products LIMIT 5;

# Проверить логи PostgreSQL:
sudo tail -f /var/log/postgresql/postgresql-*.log
```

#### 4. Мониторинг логов
```bash
# Логи Next.js:
npm run dev  # Development logs
npm run start  # Production logs

# Логи API (если отдельный сервер):
pm2 logs

# Системные логи:
journalctl -f -u postgresql
```

### Общие советы по решению проблем

#### 1. Пошаговая диагностика
1. **Воспроизвести проблему** - убедиться что ошибка повторяется
2. **Проверить логи** - console, сеть, сервер
3. **Изолировать проблему** - минимальный пример
4. **Проверить документацию** - официальные docs
5. **Поискать в интернете** - GitHub issues, Stack Overflow

#### 2. Проверочный список
- [ ] Все зависимости установлены
- [ ] Переменные окружения настроены
- [ ] База данных запущена и доступна
- [ ] Миграции применены
- [ ] Код скомпилирован без ошибок
- [ ] Тесты проходят
- [ ] Логи проверены

#### 3. Резервные планы
```bash
# Откат к последней рабочей версии:
git log --oneline
git checkout <working-commit-hash>

# Сброс локальных изменений:
git reset --hard HEAD
git clean -fd

# Переустановка зависимостей:
rm -rf node_modules package-lock.json
npm install
```

#### 4. Получение помощи
- **GitHub Issues** - поиск по ошибке
- **Stack Overflow** - технические вопросы
- **Discord/Slack** сообщества - Next.js, Prisma, React
- **Официальная документация** - всегда первый источник

### Полезные команды для диагностики

```bash
# Проверка версий:
node --version
npm --version
npx --version

# Проверка портов:
lsof -i :3000
netstat -tulpn | grep :3000

# Очистка кешей:
npm cache clean --force
rm -rf .next
rm -rf node_modules

# Проверка дискового пространства:
df -h
du -sh node_modules/

# Проверка памяти:
free -h
htop
```

Эти решения помогут быстро диагностировать и исправить большинство проблем в проекте VMC Учебник.
