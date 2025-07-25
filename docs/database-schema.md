 # Схема базы данных - VMC Учебник

## Описание
База данных PostgreSQL для каталога мототехники VMC. Содержит товары, категории, характеристики и админа.

## Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Категории товаров
model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  description String?
  order       Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  products    Product[]
  
  @@map("categories")
}

// Товары мототехники
model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  images      String[] // URLs изображений
  videoUrls   String[] // YouTube/VK URLs
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Связь с категорией
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  
  // Характеристики товара
  characteristics ProductCharacteristic[]
  
  @@map("products")
}

// Характеристики товара (65+ полей)
model ProductCharacteristic {
  id        String @id @default(cuid())
  productId String
  name      String // Название характеристики
  value     String // Значение характеристики
  
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([productId, name])
  @@map("product_characteristics")
}

// Админ пользователь (один)
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // hashed
  name      String
  role      String   @default("admin")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("users")
}
```

## Характеристики товаров

### Полный список характеристик (65 полей):

**Заводские данные:**
- `manufacturer` - Завод изготовитель
- `engine_manufacturer` - Завод производитель ДВС

**Габариты:**
- `dimensions_lwh` - Размеры ДхШхВ (мм)  
- `seat_height` - Высота сидения (мм)
- `handlebar_height` - Высота по рулю (мм)
- `wheelbase` - Размер по осям (мм)
- `ground_clearance` - Клиренс (мм)
- `weight` - Масса (кг)
- `box_dimensions` - Размеры коробки (мм)

**Двигатель:**
- `engine_marking` - Маркировка ДВС на крышке
- `engine_actual` - ДВС фактически
- `cooling` - Охлаждение
- `displacement` - Рабочий объем ДВС (сс)
- `bore` - Диаметр поршня (мм)
- `stroke` - Ход поршня (мм)
- `starting` - Запуск
- `kickstarter` - Кикстартер
- `fuel_supply` - Подача топлива
- `diagnostic_port` - Диагностический разъем
- `valves_per_cylinder` - Количество клапанов на цилиндр

**Характеристики:**
- `max_speed` - МАХ скорость (км/час)
- `transmission` - Трансмиссия
- `gears_count` - Количество передач
- `power` - Мощность ДВС (л.с/кВт/об.мин)
- `fuel_tank_volume` - Объем бака (л)
- `fuel_consumption` - Расход топлива на (л/100 км)

**Обслуживание:**
- `oil_filter` - Фильтр масляный
- `oil_volume` - Объем масла в ДВС (л)
- `cooling_system` - Система охлаждения
- `coolant` - Охлаждающая жидкость
- `air_filter` - Фильтр воздушный
- `fuel_type` - Топливо

**Ходовая часть:**
- `tire_pressure_sensors` - Датчики давления воздуха в шинах
- `front_wheel` - Колесо переднее
- `rear_wheel` - Колесо заднее
- `front_suspension` - Подвеска передняя
- `rear_suspension` - Подвеска задняя
- `front_shocks` - Амортизаторы передние
- `rear_shocks` - Амортизаторы задние
- `front_brake_disc` - Передний тормозной диск
- `front_brake_caliper` - Передний тормозной суппорт
- `rear_brake_disc` - Задний тормозной диск
- `rear_brake_caliper` - Задний тормозной суппорт
- `abs_sensor` - Датчик ABS
- `speed_sensor` - Датчик скорости/привод спидометра

**Привод:**
- `exhaust` - Глушитель
- `drive_type` - Привод: цепь/ремень
- `front_sprocket` - Звезда ведущая
- `rear_sprocket` - Звезда ведомая
- `battery` - АКБ

**Электрика:**
- `headlight` - Фара головного света
- `tail_light` - Задний фонарь
- `turn_signals` - Указатели поворотов
- `instrument_panel` - Панель приборов
- `right_switch_block` - Блок переключателей правый
- `left_switch_block` - Блок переключателей левый

**Управление:**
- `handlebar` - Руль
- `levers` - Рычаги
- `grips` - Ручки

**Кузов:**
- `seat` - Сидение
- `luggage_rack` - Багажник
- `mirrors` - Зеркала
- `security_system` - Система доступа/сигнализация

**Дополнительно:**
- `features` - Особенности
- `maintenance_interval` - Интервал прохождения ТО
- `warranty` - Гарантия
- `registration` - Регистрация в ГИБДД
- `pts_certificate` - Наличие ПТС
- `license_required` - Наличие водительского удостоверения

## Индексы

```sql
-- Поиск по категориям
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);

-- Поиск по товарам
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_categories_slug ON categories(slug);

-- Поиск по характеристикам
CREATE INDEX idx_characteristics_product ON product_characteristics(product_id);
CREATE INDEX idx_characteristics_name ON product_characteristics(name);
CREATE INDEX idx_characteristics_value ON product_characteristics(value);

-- Полнотекстовый поиск (PostgreSQL)
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('russian', name || ' ' || COALESCE(description, '')));
```

## Seed данные

### Категории:
```sql
INSERT INTO categories (name, slug, description, "order") VALUES
('Скутера', 'scooters', 'Городские скутера для ежедневных поездок', 1),
('Мопеды', 'mopeds', 'Легкие мопеды для новичков', 2),
('Мотоциклы', 'motorcycles', 'Спортивные и туристические мотоциклы', 3),
('Питбайки', 'pitbikes', 'Питбайки для бездорожья и трюков', 4);
```

### Пример товара:
```sql
-- Товар
INSERT INTO products (name, slug, description, category_id, images, video_urls) VALUES
('Honda PCX 150', 'honda-pcx-150', 'Популярный городской скутер', 'category_id', 
'["/images/honda-pcx-1.jpg", "/images/honda-pcx-2.jpg"]',
'["https://youtube.com/watch?v=example"]');

-- Характеристики
INSERT INTO product_characteristics (product_id, name, value) VALUES
('product_id', 'manufacturer', 'Honda'),
('product_id', 'displacement', '153'),
('product_id', 'max_speed', '95'),
('product_id', 'fuel_tank_volume', '8.1'),
-- ... остальные характеристики
```

## Миграции

### Создание таблиц:
```bash
npx prisma migrate dev --name init
```

### Сброс базы:
```bash
npx prisma migrate reset
```

### Генерация клиента:
```bash
npx prisma generate
```

## API запросы

### Получение товаров категории:
```typescript
const products = await prisma.product.findMany({
  where: {
    category: { slug: 'scooters' },
    isActive: true
  },
  include: {
    characteristics: true
  },
  orderBy: { order: 'asc' }
});
```

### Поиск товаров:
```typescript
const products = await prisma.product.findMany({
  where: {
    OR: [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } }
    ],
    isActive: true
  }
});
```

### Сравнение товаров:
```typescript
const products = await prisma.product.findMany({
  where: { id: { in: productIds } },
  include: {
    characteristics: true,
    category: true
  }
});
```

## Бэкапы

### Создание бэкапа:
```bash
pg_dump $DATABASE_URL > backup.sql
```

### Восстановление:
```bash
psql $DATABASE_URL < backup.sql
```

## Мониторинг

### Медленные запросы:
```sql
SELECT * FROM pg_stat_statements 
WHERE mean_time > 1000 
ORDER BY mean_time DESC;
```

### Размер таблиц:
```sql
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```
