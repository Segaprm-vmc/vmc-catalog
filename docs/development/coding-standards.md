 # Coding Standards - VMC Учебник

## Общие принципы кодирования

### Основные правила
- **Читаемость превыше всего** - код должен быть понятен любому разработчику
- **Консистентность** - единый стиль во всем проекте
- **Простота** - избегать сложных конструкций где возможно
- **DRY (Don't Repeat Yourself)** - избегать дублирования кода
- **SOLID принципы** - особенно Single Responsibility

### Язык комментариев
- Комментарии на **русском языке**
- Названия переменных и функций на **английском**
- Commit сообщения на **английском**

## TypeScript

### Настройки tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Типизация
```typescript
// ✅ Хорошо - явная типизация
interface ProductProps {
  product: Product;
  onEdit?: (product: Product) => void;
  className?: string;
}

// ❌ Плохо - any
function handleProduct(data: any) {}

// ✅ Хорошо - generic types
function createApiClient<T>(): ApiClient<T> {}

// ✅ Хорошо - union types
type Status = 'loading' | 'success' | 'error';

// ✅ Хорошо - optional chaining
const productName = product?.name ?? 'Без названия';
```

### Интерфейсы vs Types
```typescript
// ✅ Используй interface для объектов
interface Product {
  id: string;
  name: string;
  category: Category;
}

// ✅ Используй type для unions, примитивов, функций
type ProductStatus = 'active' | 'inactive';
type EventHandler = (event: Event) => void;

// ✅ Extend interfaces
interface ExtendedProduct extends Product {
  rating: number;
}
```

## React

### Структура компонентов
```tsx
// 1. Импорты внешних библиотек
import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';

// 2. Импорты внутренних модулей
import { Button } from '@/components/ui/Button';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/product';

// 3. Типы компонента
interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
  onEdit?: (product: Product) => void;
}

// 4. Компонент
export function ProductCard({ 
  product, 
  variant = 'default', 
  onEdit 
}: ProductCardProps) {
  // Хуки в начале
  const [isEditing, setIsEditing] = useState(false);
  
  // Вычисляемые значения
  const isCompact = variant === 'compact';
  
  // Обработчики событий
  const handleEditClick = () => {
    setIsEditing(true);
    onEdit?.(product);
  };
  
  // Early returns
  if (!product) return null;
  
  // Основной JSX
  return (
    <div className={`product-card ${isCompact ? 'compact' : ''}`}>
      <h3>{product.name}</h3>
      <Button onClick={handleEditClick}>
        Редактировать
      </Button>
    </div>
  );
}
```

### Хуки и состояние
```typescript
// ✅ Хорошо - деструктуризация в параметрах
function ProductForm({ product, onSave }: ProductFormProps) {}

// ✅ Хорошо - именованные state переменные
const [isLoading, setIsLoading] = useState(false);
const [products, setProducts] = useState<Product[]>([]);

// ✅ Хорошо - кастомные хуки
function useProductForm(initialProduct?: Product) {
  const [product, setProduct] = useState(initialProduct);
  const [errors, setErrors] = useState<FormErrors>({});
  
  return { product, setProduct, errors, setErrors };
}

// ✅ Хорошо - useCallback для стабильных ссылок
const handleSubmit = useCallback((data: FormData) => {
  onSave(data);
}, [onSave]);
```

### JSX Guidelines
```tsx
// ✅ Хорошо - многострочные атрибуты
<ProductCard
  product={product}
  variant="compact"
  onEdit={handleEdit}
  className="mb-4"
/>

// ✅ Хорошо - условный рендеринг
{isLoading && <Loading />}
{products.length > 0 ? (
  <ProductList products={products} />
) : (
  <EmptyState message="Товары не найдены" />
)}

// ✅ Хорошо - списки с keys
{products.map(product => (
  <ProductCard key={product.id} product={product} />
))}

// ❌ Плохо - индекс как key
{products.map((product, index) => (
  <ProductCard key={index} product={product} />
))}
```

## Именование

### Переменные и функции
```typescript
// ✅ Хорошо - camelCase, описательные имена
const productCount = products.length;
const isProductVisible = product.status === 'active';

// ✅ Хорошо - Boolean переменные начинаются с is/has/can/should
const isLoading = false;
const hasError = true;
const canEdit = user.role === 'admin';

// ✅ Хорошо - функции начинаются с глагола
function getProduct(id: string) {}
function createProduct(data: ProductData) {}
function validateProductForm(data: FormData) {}

// ✅ Хорошо - обработчики событий с handle
const handleProductClick = () => {};
const handleFormSubmit = () => {};
```

### Компоненты и файлы
```typescript
// ✅ Хорошо - PascalCase для компонентов
export function ProductCard() {}
export function ProductDetailPage() {}

// ✅ Хорошо - файлы совпадают с компонентами
// ProductCard.tsx
// ProductDetailPage.tsx

// ✅ Хорошо - папки в kebab-case
// components/product-card/
// pages/product-detail/
```

### Константы
```typescript
// ✅ Хорошо - SCREAMING_SNAKE_CASE
const MAX_PRODUCTS_PER_PAGE = 20;
const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  CATEGORIES: '/api/categories'
} as const;

// ✅ Хорошо - enum в PascalCase
enum ProductStatus {
  Active = 'active',
  Inactive = 'inactive',
  Draft = 'draft'
}
```

## Структура проекта

### Организация файлов
```
apps/web/src/
├── components/           # Переиспользуемые компоненты
│   ├── ui/              # Базовые UI компоненты
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   └── Modal/
│   ├── product/         # Компоненты товаров
│   └── layout/          # Компоненты лейаута
├── pages/               # Страницы Next.js
├── hooks/               # Кастомные хуки
├── utils/               # Утилиты и хелперы
├── types/               # TypeScript типы
├── styles/              # Глобальные стили
└── constants/           # Константы приложения
```

### Импорты
```typescript
// ✅ Хорошо - группировка импортов
// 1. Внешние библиотеки
import React from 'react';
import { NextPage } from 'next';
import { z } from 'zod';

// 2. Внутренние модули (абсолютные пути)
import { Button } from '@/components/ui/Button';
import { useProducts } from '@/hooks/useProducts';

// 3. Относительные импорты
import './ProductCard.css';

// ✅ Хорошо - именованные экспорты
export { ProductCard } from './ProductCard';

// ✅ Хорошо - default экспорт только для страниц
export default ProductDetailPage;
```

## API и данные

### Fetch и async/await
```typescript
// ✅ Хорошо - обработка ошибок
async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
    throw error;
  }
}

// ✅ Хорошо - типизированные API функции
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

async function createProduct(data: CreateProductData): Promise<ApiResponse<Product>> {
  // реализация
}
```

### Валидация с Zod
```typescript
// ✅ Хорошо - схемы валидации
const ProductSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().optional(),
  categoryId: z.string().uuid('Некорректный ID категории'),
  characteristics: z.array(z.object({
    name: z.string(),
    value: z.string()
  }))
});

type Product = z.infer<typeof ProductSchema>;

// ✅ Хорошо - валидация данных
function validateProductData(data: unknown): Product {
  return ProductSchema.parse(data);
}
```

## Стилизация

### Tailwind CSS conventions
```tsx
// ✅ Хорошо - группировка классов по типу
<div className={`
  // Layout
  flex items-center justify-between
  // Spacing  
  p-4 mb-6
  // Styling
  bg-white border border-gray-200 rounded-lg
  // States
  hover:shadow-lg focus:ring-2 focus:ring-vmc-red
  // Responsive
  md:p-6 lg:mb-8
`}>

// ✅ Хорошо - условные стили
<button 
  className={`
    btn-base
    ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `}
>

// ✅ Хорошо - использование clsx для сложной логики
import clsx from 'clsx';

const buttonClasses = clsx(
  'px-4 py-2 rounded-md font-medium',
  {
    'bg-vmc-red text-white': variant === 'primary',
    'bg-gray-200 text-gray-800': variant === 'secondary',
    'opacity-50 cursor-not-allowed': disabled
  }
);
```

## Обработка ошибок

### Error Boundaries
```tsx
// ✅ Хорошо - Error Boundary компонент
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Что-то пошло не так</h2>
          <details>
            {this.state.error?.message}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Обработка ошибок в хуках
```typescript
// ✅ Хорошо - централизованная обработка ошибок
function useAsyncOperation<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (operation: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await operation();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
}
```

## Тестирование

### Unit тесты с Jest
```typescript
// ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  category: { id: '1', name: 'Скутера', slug: 'scooters' }
};

describe('ProductCard', () => {
  it('отображает название товара', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('вызывает onEdit при клике на кнопку', () => {
    const handleEdit = jest.fn();
    render(<ProductCard product={mockProduct} onEdit={handleEdit} />);
    
    fireEvent.click(screen.getByText('Редактировать'));
    expect(handleEdit).toHaveBeenCalledWith(mockProduct);
  });
});
```

## Performance

### Оптимизация рендеринга
```typescript
// ✅ Хорошо - React.memo для дорогих компонентов
const ProductCard = React.memo<ProductCardProps>(({ product, onEdit }) => {
  return (
    <div className="product-card">
      {/* компонент */}
    </div>
  );
});

// ✅ Хорошо - useMemo для дорогих вычислений
function ProductList({ products, filters }: ProductListProps) {
  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(filters.search.toLowerCase())
    );
  }, [products, filters.search]);

  return <div>{/* рендер списка */}</div>;
}

// ✅ Хорошо - useCallback для стабильных функций
function ProductForm({ onSave }: ProductFormProps) {
  const handleSubmit = useCallback((data: ProductData) => {
    onSave(data);
  }, [onSave]);

  return <form onSubmit={handleSubmit}>{/* форма */}</form>;
}
```

### Lazy loading
```typescript
// ✅ Хорошо - динамические импорты для кода
const ProductDetailModal = lazy(() => import('./ProductDetailModal'));

// ✅ Хорошо - Next.js Image для картинок
import Image from 'next/image';

<Image
  src={product.mainImage}
  alt={product.name}
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

## Безопасность

### Санитизация данных
```typescript
// ✅ Хорошо - валидация пользовательского ввода
function sanitizeProductName(name: string): string {
  return name.trim().replace(/[<>]/g, '');
}

// ✅ Хорошо - избегание XSS
function ProductDescription({ description }: { description: string }) {
  return (
    <div 
      dangerouslySetInnerHTML={{ 
        __html: DOMPurify.sanitize(description) 
      }} 
    />
  );
}

// ✅ Хорошо - проверка авторизации
function useRequireAuth() {
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);
  
  return user;
}
```

## Работа с формами

### React Hook Form
```typescript
// ✅ Хорошо - типизированные формы
interface ProductFormData {
  name: string;
  description: string;
  categoryId: string;
  characteristics: Array<{
    name: string;
    value: string;
  }>;
}

function ProductForm({ product, onSave }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control
  } = useForm<ProductFormData>({
    defaultValues: product,
    resolver: zodResolver(ProductSchema)
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      await onSave(data);
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('name')}
        placeholder="Название товара"
        className={errors.name ? 'error' : ''}
      />
      {errors.name && (
        <span className="error-message">{errors.name.message}</span>
      )}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Сохранение...' : 'Сохранить'}
      </button>
    </form>
  );
}
```

## Git и коммиты

### Commit сообщения
```bash
# ✅ Хорошо - conventional commits
feat: add product comparison feature
fix: resolve image loading issue in gallery
docs: update API documentation
style: apply VMC brand colors to buttons
refactor: extract ProductCard component
test: add unit tests for ProductForm
chore: update dependencies

# ✅ Хорошо - детальные описания
feat: add product search functionality

- Implement search bar in header
- Add search results page with pagination
- Integrate with Algolia search service
- Add search analytics tracking

# ❌ Плохо - неинформативные сообщения
fix: bug
update: changes
wip: stuff
```

### Ветки
```bash
# ✅ Хорошо - описательные названия веток
feature/product-comparison
fix/image-loading-bug
hotfix/critical-api-error
docs/update-readme

# ❌ Плохо
feature1
fix
temp
test-branch
```

## Документация

### JSDoc комментарии
```typescript
/**
 * Компонент карточки товара VMC
 * 
 * @param product - Данные товара для отображения
 * @param variant - Вариант отображения карточки
 * @param onEdit - Callback для редактирования товара
 * @returns JSX элемент карточки товара
 * 
 * @example
 * ```tsx
 * <ProductCard 
 *   product={product} 
 *   variant="compact"
 *   onEdit={handleEdit}
 * />
 * ```
 */
function ProductCard({ product, variant, onEdit }: ProductCardProps) {
  // реализация
}

/**
 * Хук для работы с товарами
 * 
 * @param categoryId - ID категории для фильтрации (опционально)
 * @returns Объект с данными и методами для работы с товарами
 */
function useProducts(categoryId?: string) {
  // реализация
}
```

### README файлы
```markdown
# ProductCard Component

Компонент для отображения карточки товара в каталоге VMC.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| product | Product | - | Данные товара |
| variant | 'default' \| 'compact' | 'default' | Размер карточки |
| onEdit | (product: Product) => void | - | Callback редактирования |

## Usage

```tsx
import { ProductCard } from '@/components/ProductCard';

<ProductCard 
  product={product}
  variant="compact"
  onEdit={handleEdit}
/>
```
```

## ESLint и Prettier

### .eslintrc.js
```javascript
module.exports = {
  extends: [
    'next/core-web-vitals',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // Запретить any
    '@typescript-eslint/no-explicit-any': 'error',
    
    // Требовать типы для функций
    '@typescript-eslint/explicit-function-return-type': 'warn',
    
    // Запретить неиспользуемые переменные
    '@typescript-eslint/no-unused-vars': 'error',
    
    // Требовать await в async функциях
    'require-await': 'error',
    
    // Предпочитать const
    'prefer-const': 'error',
    
    // Консистентные кавычки
    'quotes': ['error', 'single'],
    
    // Точки с запятой
    'semi': ['error', 'always']
  }
};
```

### .prettierrc
```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "quoteProps": "as-needed",
  "trailingComma": "es5",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid"
}
```

## Мониторинг и логирование

### Структурированное логирование
```typescript
// ✅ Хорошо - структурированные логи
const logger = {
  info: (message: string, meta?: Record<string, any>) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  },
  
  error: (message: string, error?: Error, meta?: Record<string, any>) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      error: error?.message,
      stack: error?.stack,
      ...meta
    }));
  }
};

// Использование
logger.info('Товар создан', { productId: product.id, userId: user.id });
logger.error('Ошибка загрузки товаров', error, { categoryId });
```

## Code Review

### Чек-лист для review
- [ ] Код соответствует стандартам проекта
- [ ] Все функции и компоненты типизированы
- [ ] Нет использования `any`
- [ ] Обработаны все возможные ошибки
- [ ] Добавлены необходимые тесты
- [ ] Нет дублирования кода
- [ ] Производительность оптимальна
- [ ] Доступность соблюдена
- [ ] Комментарии актуальны
- [ ] Commit сообщения информативны

### Автоматизация
```json
// package.json scripts
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "pre-commit": "lint-staged"
  }
}

// .lintstagedrc
{
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write",
    "jest --findRelatedTests --passWithNoTests"
  ]
}
```

Эти стандарты кодирования обеспечивают высокое качество кода и легкость поддержки проекта VMC Учебник.
