 # Архитектура проекта - VMC Учебник

## Обзор системы

VMC Учебник - это внутренний каталог мототехники для менеджеров компании. Состоит из публичной части (каталог) и админки для управления контентом.

## Высокоуровневая архитектура

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Публичная     │    │     Админка     │    │    API/Backend  │
│   часть (Web)   │◄──►│   (Admin)       │◄──►│   (Express)     │
│   Next.js       │    │   Next.js       │    │   Node.js       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │     База данных         │
                    │     PostgreSQL          │
                    │     + Prisma ORM        │
                    └─────────────────────────┘
                                 ▲
                                 │
                    ┌─────────────────────────┐
                    │   Внешние сервисы       │
                    │   • Algolia (поиск)     │
                    │   • YouTube/VK (видео)  │
                    └─────────────────────────┘
```

## Структура проекта

```
vmc-manager-handbook/
├── apps/
│   ├── web/                    # Публичная часть (Next.js)
│   │   ├── app/                # App Router
│   │   │   ├── (categories)/   # Группа маршрутов категорий
│   │   │   │   ├── [slug]/     # Страница категории
│   │   │   │   └── [slug]/[product]/  # Страница товара
│   │   │   ├── search/         # Поиск
│   │   │   ├── compare/        # Сравнение товаров
│   │   │   └── layout.tsx      # Корневой лейаут
│   │   ├── components/         # Компоненты UI
│   │   ├── lib/               # Утилиты и хелперы
│   │   └── public/            # Статические файлы
│   │
│   ├── admin/                  # Админка (Next.js)
│   │   ├── app/
│   │   │   ├── login/         # Авторизация
│   │   │   ├── dashboard/     # Главная админки
│   │   │   ├── products/      # Управление товарами
│   │   │   ├── categories/    # Управление категориями
│   │   │   └── media/         # Управление медиафайлами
│   │   └── components/        # Админ компоненты
│   │
│   └── api/                   # Backend API (Express)
│       ├── routes/            # API маршруты
│       ├── middleware/        # Middleware
│       ├── controllers/       # Контроллеры
│       └── services/          # Бизнес-логика
│
├── packages/
│   ├── ui/                    # Общие UI компоненты
│   │   ├── components/        # React компоненты
│   │   ├── styles/           # Общие стили
│   │   └── icons/            # SVG иконки
│   │
│   ├── database/             # Prisma схема и миграции
│   │   ├── schema.prisma     # Схема БД
│   │   ├── migrations/       # Миграции
│   │   └── seed.ts          # Заполнение тестовыми данными
│   │
│   └── types/               # TypeScript типы
│       ├── product.ts       # Типы товаров
│       ├── category.ts      # Типы категорий
│       └── api.ts          # API типы
│
├── docs/                    # Документация
├── public/                  # Общие статические файлы
│   ├── images/             # Фото товаров
│   └── uploads/            # Загруженные файлы
│
├── .cursorrules            # Правила для Cursor AI
├── package.json           # Корневой package.json (monorepo)
├── turbo.json            # Turbo конфигурация
└── README.md             # Основная документация
```

## Технологический стек

### Frontend (apps/web - Публичная часть)
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Tailwind UI
- **Icons**: Lucide React
- **Images**: Next.js Image optimization
- **Forms**: React Hook Form + Zod validation
- **State**: React hooks (useState, useContext)
- **Search**: Базовый поиск + Algolia (опционально)
- **Animations**: Framer Motion (опционально)

### Admin Panel (apps/admin) - ГОТОВОЕ РЕШЕНИЕ
- **Вариант 1**: React Admin + ra-data-json-server (рекомендуется)
- **Вариант 2**: Next.js + shadcn/ui компоненты
- **Вариант 3**: Admin.js + автогенерация из Prisma
- **Styling**: Кастомизация под VMC (#EC2834, #1E1E1E)
- **Auth**: Простая авторизация для одного админа
- **Forms**: Готовые CRUD формы для 65 характеристик
- **File Upload**: Готовые компоненты для изображений

### Backend API (apps/api)
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JWT tokens
- **Validation**: Zod
- **File Upload**: Multer
- **Logging**: Winston

### Database
- **СУБД**: PostgreSQL 15+
- **ORM**: Prisma 5+
- **Миграции**: Prisma Migrate
- **Backup**: pg_dump автоматизированный

### External Services
- **Search**: Algolia (поиск по товарам)
- **Video**: YouTube/VK embed (хранение ссылок)
- **Images**: Локальное хранение + Next.js оптимизация

## Архитектурные решения

### Monorepo структура
Используем Turborepo для управления монорепозиторием:
- Общие компоненты в packages/ui
- Общие типы в packages/types
- Единая схема БД в packages/database

### Маршрутизация

#### Публичная часть (apps/web):
```
/                           # Главная страница (список категорий)
/[category-slug]/           # Страница категории (скутера, мопеды, etc.)
/[category-slug]/[product]/ # Страница товара
/search                     # Поиск по товарам
/compare                    # Сравнение товаров (query params)
```

#### Админка (apps/admin):
```
/admin/login               # Авторизация
/admin/dashboard           # Главная админки (статистика)
/admin/products            # Список товаров
/admin/products/new        # Создание товара
/admin/products/[id]/edit  # Редактирование товара
/admin/categories          # Управление категориями
/admin/media               # Управление медиафайлами
```

### API Endpoints (apps/api):

#### Публичные API:
```
GET  /api/categories                    # Список категорий
GET  /api/categories/[slug]             # Товары категории
GET  /api/products/[slug]               # Детали товара
GET  /api/search?q=                     # Поиск товаров
GET  /api/products/compare?ids=         # Данные для сравнения
```

#### Админ API:
```
POST /api/auth/login                    # Авторизация админа
GET  /api/admin/products                # Список товаров (пагинация)
POST /api/admin/products                # Создание товара
PUT  /api/admin/products/[id]           # Обновление товара
DEL  /api/admin/products/[id]           # Удаление товара
POST /api/admin/upload                  # Загрузка изображений
GET  /api/admin/categories              # CRUD категорий
```

## Модели данных

### Category (Категория)
```typescript
interface Category {
  id: string
  name: string           # "Скутера", "Мопеды", etc.
  slug: string          # "scooters", "mopeds", etc.
  description?: string
  order: number         # Порядок отображения
  createdAt: Date
  updatedAt: Date
}
```

### Product (Товар)
```typescript
interface Product {
  id: string
  name: string          # "Honda PCX 150"
  slug: string          # "honda-pcx-150"
  description?: string  # Описание товара
  images: string[]      # URLs фотографий
  videoUrls: string[]   # YouTube/VK ссылки
  categoryId: string
  order: number         # Порядок в категории
  isActive: boolean     # Скрыть/показать
  createdAt: Date
  updatedAt: Date
  
  category: Category
  characteristics: ProductCharacteristic[]
}
```

### ProductCharacteristic (Характеристика товара)
```typescript
interface ProductCharacteristic {
  id: string
  productId: string
  name: string          # Название характеристики
  value: string         # Значение характеристики
  
  product: Product
}

// 65 возможных характеристик:
type CharacteristicName = 
  | 'manufacturer'                    # Завод изготовитель
  | 'engine_manufacturer'             # Завод производитель ДВС
  | 'dimensions_lwh'                  # Размеры ДхШхВ (мм)
  | 'seat_height'                     # Высота сидения (мм)
  | 'handlebar_height'                # Высота по рулю (мм)
  | 'wheelbase'                       # Размер по осям (мм)
  | 'ground_clearance'                # Клиренс (мм)
  | 'weight'                          # Масса (кг)
  | 'box_dimensions'                  # Размеры коробки (мм)
  | 'engine_marking'                  # Маркировка ДВС на крышке
  | 'engine_actual'                   # ДВС фактически
  | 'cooling'                         # Охлаждение
  | 'displacement'                    # Рабочий объем ДВС (сс)
  | 'bore'                           # Диаметр поршня (мм)
  | 'stroke'                         # Ход поршня (мм)
  | 'starting'                       # Запуск
  | 'kickstarter'                    # Кикстартер
  | 'fuel_supply'                    # Подача топлива
  | 'diagnostic_port'                # Диагностический разъем
  | 'valves_per_cylinder'            # Количество клапанов на цилиндр
  | 'max_speed'                      # МАХ скорость (км/час)
  | 'transmission'                   # Трансмиссия
  | 'gears_count'                    # Количество передач
  | 'power'                          # Мощность ДВС (л.с/кВт/об.мин)
  | 'fuel_tank_volume'               # Объем бака (л)
  | 'fuel_consumption'               # Расход топлива на (л/100 км)
  | 'oil_filter'                     # Фильтр масляный
  | 'oil_volume'                     # Объем масла в ДВС (л)
  | 'cooling_system'                 # Система охлаждения
  | 'coolant'                        # Охлаждающая жидкость
  | 'air_filter'                     # Фильтр воздушный
  | 'fuel_type'                      # Топливо
  | 'tire_pressure_sensors'          # Датчики давления воздуха в шинах
  | 'front_wheel'                    # Колесо переднее
  | 'rear_wheel'                     # Колесо заднее
  | 'front_suspension'               # Подвеска передняя
  | 'rear_suspension'                # Подвеска задняя
  | 'front_shocks'                   # Амортизаторы передние
  | 'rear_shocks'                    # Амортизаторы задние
  | 'front_brake_disc'               # Передний тормозной диск
  | 'front_brake_caliper'            # Передний тормозной суппорт
  | 'rear_brake_disc'                # Задний тормозной диск
  | 'rear_brake_caliper'             # Задний тормозной суппорт
  | 'abs_sensor'                     # Датчик ABS
  | 'speed_sensor'                   # Датчик скорости/привод спидометра
  | 'exhaust'                        # Глушитель
  | 'drive_type'                     # Привод: цепь/ремень
  | 'front_sprocket'                 # Звезда ведущая
  | 'rear_sprocket'                  # Звезда ведомая
  | 'battery'                        # АКБ
  | 'headlight'                      # Фара головного света
  | 'tail_light'                     # Задний фонарь
  | 'turn_signals'                   # Указатели поворотов
  | 'instrument_panel'               # Панель приборов
  | 'right_switch_block'             # Блок переключателей правый
  | 'left_switch_block'              # Блок переключателей левый
  | 'handlebar'                      # Руль
  | 'levers'                         # Рычаги
  | 'grips'                          # Ручки
  | 'seat'                           # Сидение
  | 'luggage_rack'                   # Багажник
  | 'mirrors'                        # Зеркала
  | 'security_system'                # Система доступа/сигнализация
  | 'features'                       # Особенности
  | 'maintenance_interval'           # Интервал прохождения ТО
  | 'warranty'                       # Гарантия
  | 'registration'                   # Регистрация в ГИБДД
  | 'pts_certificate'                # Наличие ПТС
  | 'license_required';              # Наличие водительского удостоверения
```

### User (Админ)
```typescript
interface User {
  id: string
  email: string         # Единственный админ
  password: string      # Хешированный пароль
  name: string
  role: 'admin'
  createdAt: Date
  updatedAt: Date
}
```

## Компоненты и паттерны

### Основные UI компоненты:

#### packages/ui/components/
- `ProductCard` - Карточка товара для сетки
- `ProductGallery` - Галерея фото с каруселью
- `CharacteristicsTable` - Таблица характеристик (65 полей)
- `CategoryGrid` - Сетка категорий на главной
- `SearchBar` - Поиск товаров
- `VideoEmbed` - Встраивание YouTube/VK видео
- `ProductComparison` - Сравнение товаров
- `Breadcrumbs` - Хлебные крошки
- `Header` - Шапка с логотипом VMC
- `Footer` - Подвал сайта

#### apps/admin/components/
- `ProductForm` - Форма создания/редактирования товара
- `CategoryForm` - Форма категорий
- `ImageUpload` - Загрузка изображений
- `CharacteristicsEditor` - Редактор характеристик
- `AdminLayout` - Лейаут админки
- `LoginForm` - Форма авторизации

### State Management

Используем React hooks без внешних библиотек:
- `useState` для локального состояния
- `useContext` для глобального состояния (если нужно)
- `useSWR` для кеширования API запросов

### Error Handling

```typescript
// Глобальный Error Boundary
function ErrorBoundary({ children }: { children: ReactNode }) {
  // Ловит ошибки React
}

// API Error handling
function handleApiError(error: Error) {
  // Логирование + пользовательские уведомления
}
```

## Performance оптимизации

### Next.js оптимизации:
- Static Generation для категорий и товаров
- Image optimization для всех фото товаров
- Lazy loading для галерей
- Code splitting по маршрутам

### Database оптимизации:
- Индексы на поисковые поля
- Eager loading связанных данных
- Пагинация для списков товаров

### Кеширование:
- Next.js automatic caching
- Browser caching для изображений
- API response caching

## Security

### Аутентификация:
- NextAuth.js для админки
- JWT токены
- Secure cookies

### Авторизация:
- Middleware проверка для админ роутов
- RBAC (только admin роль)

### Валидация:
- Zod схемы для всех форм
- Санитизация пользовательского ввода
- Rate limiting для API

## Мониторинг и логирование

### Логирование:
```typescript
// Winston logger
logger.info('Product created', { productId, userId });
logger.error('Database error', { error, query });
```

### Метрики:
- Время ответа API
- Популярные товары/категории
- Ошибки приложения

## Deployment

### Development:
```bash
npm run dev          # Запуск всех приложений
npm run build        # Сборка продакшена
npm run start        # Продакшен старт
```

### Production stack:
- Node.js процессы за reverse proxy
- PostgreSQL с репликацией
- File storage для изображений
- CDN для статики

## Будущие расширения

### Регламенты (v2):
- MDX страницы с текстом
- Файловые загрузки (Word/PDF)
- Категории регламентов
- Версионирование документов
