 # API Документация - VMC Учебник

## Обзор API

REST API для VMC Учебника предоставляет доступ к каталогу мототехники и админским функциям.

**Base URL**: `http://localhost:8000/api`

## Аутентификация

### Публичные endpoints
Категории и товары доступны без аутентификации.

### Админские endpoints
Требуют JWT токен в заголовке:
```
Authorization: Bearer <jwt-token>
```

### Получение токена
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@vmc.com",
  "password": "admin-password"
}
```

Ответ:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-id",
    "email": "admin@vmc.com",
    "name": "Admin"
  }
}
```

## Публичные API

### Категории

#### Получить все категории
```http
GET /api/categories
```

Ответ:
```json
{
  "success": true,
  "data": [
    {
      "id": "cat-1",
      "name": "Скутера",
      "slug": "scooters",
      "description": "Городские скутера для ежедневных поездок",
      "order": 1,
      "productsCount": 12
    },
    {
      "id": "cat-2", 
      "name": "Мопеды",
      "slug": "mopeds",
      "description": "Легкие мопеды для новичков",
      "order": 2,
      "productsCount": 8
    }
  ]
}
```

#### Получить товары категории
```http
GET /api/categories/{slug}
GET /api/categories/{slug}?page=1&limit=12
```

Параметры:
- `page` (число): номер страницы (по умолчанию 1)
- `limit` (число): товаров на странице (по умолчанию 12, макс 50)

Ответ:
```json
{
  "success": true,
  "data": {
    "category": {
      "id": "cat-1",
      "name": "Скутера",
      "slug": "scooters",
      "description": "Городские скутера"
    },
    "products": [
      {
        "id": "prod-1",
        "name": "Honda PCX 150",
        "slug": "honda-pcx-150",
        "description": "Популярный городской скутер",
        "images": [
          "/images/honda-pcx-1.jpg",
          "/images/honda-pcx-2.jpg"
        ],
        "mainImage": "/images/honda-pcx-1.jpg",
        "keyCharacteristics": {
          "displacement": "153 сс",
          "max_speed": "95 км/ч",
          "fuel_tank_volume": "8.1 л"
        }
      }
    ],
          "pagination": {
      "page": 1,
      "limit": 12,
      "total": 45,
      "totalPages": 4,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Товары

#### Получить детали товара
```http
GET /api/products/{slug}
```

Ответ:
```json
{
  "success": true,
  "data": {
    "id": "prod-1",
    "name": "Honda PCX 150",
    "slug": "honda-pcx-150",
    "description": "Популярный городской скутер с экономичным двигателем",
    "images": [
      "/images/honda-pcx-1.jpg",
      "/images/honda-pcx-2.jpg",
      "/images/honda-pcx-3.jpg",
      "/images/honda-pcx-4.jpg",
      "/images/honda-pcx-5.jpg"
    ],
    "videoUrls": [
      "https://youtube.com/watch?v=example1",
      "https://vk.com/video-123456_789"
    ],
    "category": {
      "id": "cat-1",
      "name": "Скутера",
      "slug": "scooters"
    },
    "characteristics": [
      {
        "name": "manufacturer",
        "value": "Honda",
        "displayName": "Завод изготовитель"
      },
      {
        "name": "engine_manufacturer", 
        "value": "Honda",
        "displayName": "Завод производитель ДВС"
      },
      {
        "name": "dimensions_lwh",
        "value": "1923 x 745 x 1107",
        "displayName": "Размеры ДхШхВ (мм)"
      },
      {
        "name": "seat_height",
        "value": "764",
        "displayName": "Высота сидения (мм)"
      },
      {
        "name": "displacement",
        "value": "153",
        "displayName": "Рабочий объем ДВС (сс)"
      },
      {
        "name": "max_speed",
        "value": "95",
        "displayName": "МАХ скорость (км/час)"
      },
      {
        "name": "power",
        "value": "15.4 л.с / 11.4 кВт / 8500 об.мин",
        "displayName": "Мощность ДВС"
      },
      {
        "name": "fuel_tank_volume",
        "value": "8.1",
        "displayName": "Объем бака (л)"
      }
    ],
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-20T15:30:00Z"
  }
}
```

### Поиск

#### Поиск товаров
```http
GET /api/search?q={query}&category={slug}&page={page}&limit={limit}
```

Параметры:
- `q` (строка, обязательно): поисковый запрос
- `category` (строка): фильтр по категории
- `page` (число): номер страницы
- `limit` (число): товаров на странице (макс 50)

Пример:
```http
GET /api/search?q=honda&category=scooters&page=1&limit=10
```

Ответ:
```json
{
  "success": true,
  "data": {
    "query": "honda",
    "results": [
      {
        "id": "prod-1",
        "name": "Honda PCX 150",
        "slug": "honda-pcx-150", 
        "description": "Популярный городской скутер",
        "mainImage": "/images/honda-pcx-1.jpg",
        "category": {
          "name": "Скутера",
          "slug": "scooters"
        },
        "keyCharacteristics": {
          "displacement": "153 сс",
          "max_speed": "95 км/ч"
        },
        "matchType": "name" // "name" | "description" | "characteristics"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "totalPages": 1
    },
    "filters": {
      "categories": [
        {
          "slug": "scooters",
          "name": "Скутера", 
          "count": 2
        },
        {
          "slug": "motorcycles",
          "name": "Мотоциклы",
          "count": 1
        }
      ]
    }
  }
}
```

### Сравнение товаров

#### Получить данные для сравнения
```http
GET /api/products/compare?ids={id1},{id2},{id3}
```

Параметры:
- `ids` (строка): список ID товаров через запятую (макс 4 товара)

Пример:
```http
GET /api/products/compare?ids=prod-1,prod-2,prod-3
```

Ответ:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod-1",
        "name": "Honda PCX 150",
        "slug": "honda-pcx-150",
        "mainImage": "/images/honda-pcx-1.jpg",
        "category": "Скутера",
        "characteristics": {
          "manufacturer": "Honda",
          "displacement": "153",
          "max_speed": "95",
          "power": "15.4 л.с",
          "fuel_tank_volume": "8.1"
        }
      },
      {
        "id": "prod-2", 
        "name": "Yamaha NMAX 155",
        "slug": "yamaha-nmax-155",
        "mainImage": "/images/yamaha-nmax-1.jpg",
        "category": "Скутера",
        "characteristics": {
          "manufacturer": "Yamaha",
          "displacement": "155",
          "max_speed": "105",
          "power": "15 л.с",
          "fuel_tank_volume": "6.6"
        }
      }
    ],
    "comparisonTable": [
      {
        "characteristic": "Завод изготовитель",
        "values": ["Honda", "Yamaha"],
        "isDifferent": true
      },
      {
        "characteristic": "Рабочий объем ДВС (сс)",
        "values": ["153", "155"],
        "isDifferent": true
      },
      {
        "characteristic": "МАХ скорость (км/час)",
        "values": ["95", "105"],
        "isDifferent": true
      }
    ]
  }
}
```

## Админские API

### Товары (Admin)

#### Получить список товаров
```http
GET /api/admin/products?page={page}&limit={limit}&category={slug}&search={query}
Authorization: Bearer <token>
```

Параметры:
- `page` (число): номер страницы
- `limit` (число): товаров на странице
- `category` (строка): фильтр по категории
- `search` (строка): поиск по названию

Ответ:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod-1",
        "name": "Honda PCX 150",
        "slug": "honda-pcx-150",
        "description": "Популярный городской скутер",
        "category": {
          "name": "Скутера",
          "slug": "scooters"
        },
        "images": ["/images/honda-pcx-1.jpg"],
        "isActive": true,
        "order": 1,
        "characteristicsCount": 25,
        "createdAt": "2025-01-15T10:00:00Z",
        "updatedAt": "2025-01-20T15:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

#### Создать товар
```http
POST /api/admin/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Honda PCX 150",
  "slug": "honda-pcx-150",
  "description": "Популярный городской скутер",
  "categoryId": "cat-1",
  "images": [
    "/images/honda-pcx-1.jpg",
    "/images/honda-pcx-2.jpg"
  ],
  "videoUrls": [
    "https://youtube.com/watch?v=example"
  ],
  "order": 1,
  "isActive": true,
  "characteristics": [
    {
      "name": "manufacturer",
      "value": "Honda"
    },
    {
      "name": "displacement", 
      "value": "153"
    }
  ]
}
```

Ответ:
```json
{
  "success": true,
  "data": {
    "id": "prod-new",
    "name": "Honda PCX 150",
    "slug": "honda-pcx-150",
    "message": "Товар успешно создан"
  }
}
```

#### Обновить товар
```http
PUT /api/admin/products/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Honda PCX 150 (обновленный)",
  "description": "Обновленное описание",
  "characteristics": [
    {
      "name": "max_speed",
      "value": "100"
    }
  ]
}
```

#### Удалить товар
```http
DELETE /api/admin/products/{id}
Authorization: Bearer <token>
```

Ответ:
```json
{
  "success": true,
  "message": "Товар удален"
}
```

### Категории (Admin)

#### Получить все категории
```http
GET /api/admin/categories
Authorization: Bearer <token>
```

#### Создать категорию
```http
POST /api/admin/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Квадроциклы",
  "slug": "atvs",
  "description": "Квадроциклы для бездорожья",
  "order": 5
}
```

#### Обновить категорию
```http
PUT /api/admin/categories/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Квадроциклы ATV",
  "order": 6
}
```

#### Удалить категорию
```http
DELETE /api/admin/categories/{id}
Authorization: Bearer <token>
```

### Загрузка файлов

#### Загрузить изображения
```http
POST /api/admin/upload/images
Authorization: Bearer <token>
Content-Type: multipart/form-data

files: [file1.jpg, file2.jpg, ...]
productId: "prod-1" (опционально)
```

Ответ:
```json
{
  "success": true,
  "data": {
    "uploadedFiles": [
      {
        "filename": "honda-pcx-1.jpg",
        "url": "/images/honda-pcx-1.jpg",
        "size": 245760
      },
      {
        "filename": "honda-pcx-2.jpg", 
        "url": "/images/honda-pcx-2.jpg",
        "size": 312450
      }
    ]
  }
}
```

### Статистика

#### Получить статистику админки
```http
GET /api/admin/stats
Authorization: Bearer <token>
```

Ответ:
```json
{
  "success": true,
  "data": {
    "totalProducts": 45,
    "totalCategories": 4,
    "totalImages": 238,
    "popularProducts": [
      {
        "id": "prod-1",
        "name": "Honda PCX 150",
        "views": 156
      }
    ],
    "recentActivity": [
      {
        "action": "product_created",
        "productName": "Yamaha MT-07",
        "timestamp": "2025-01-20T15:30:00Z"
      }
    ],
    "categoryStats": [
      {
        "category": "Скутера",
        "count": 15,
        "percentage": 33.3
      },
      {
        "category": "Мотоциклы", 
        "count": 18,
        "percentage": 40.0
      }
    ]
  }
}
```

## Коды ошибок

### HTTP статусы
- `200` - Успешный запрос
- `201` - Ресурс создан
- `400` - Неверный запрос (валидация)
- `401` - Не авторизован
- `403` - Доступ запрещен
- `404` - Ресурс не найден
- `409` - Конфликт (slug уже существует)
- `422` - Ошибка валидации
- `500` - Внутренняя ошибка сервера

### Формат ошибок
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Поля не прошли валидацию",
    "details": [
      {
        "field": "name",
        "message": "Название товара обязательно"
      },
      {
        "field": "slug",
        "message": "Slug должен быть уникальным"
      }
    ]
  }
}
```

### Коды ошибок
- `VALIDATION_ERROR` - Ошибка валидации
- `AUTH_REQUIRED` - Требуется авторизация
- `INVALID_TOKEN` - Неверный токен
- `NOT_FOUND` - Ресурс не найден
- `DUPLICATE_SLUG` - Slug уже существует
- `FILE_UPLOAD_ERROR` - Ошибка загрузки файла
- `DATABASE_ERROR` - Ошибка базы данных

## Rate Limiting

### Лимиты
- Публичные API: 100 запросов/минуту на IP
- Админские API: 1000 запросов/минуту на токен
- Поиск API: 50 запросов/минуту на IP
- Upload API: 10 запросов/минуту на токен

### Заголовки лимитов
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95  
X-RateLimit-Reset: 1640995200
```

## Характеристики товаров

### Полный список (65 полей)

Все характеристики передаются как объекты с полями `name` и `value`:

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

## Примеры использования

### Создание полного товара
```javascript
const productData = {
  name: "Honda PCX 150",
  slug: "honda-pcx-150",
  description: "Экономичный городской скутер",
  categoryId: "scooters-category-id",
  images: [
    "/images/honda-pcx-main.jpg",
    "/images/honda-pcx-side.jpg",
    "/images/honda-pcx-dashboard.jpg"
  ],
  videoUrls: [
    "https://youtube.com/watch?v=example123"
  ],
  characteristics: [
    { name: "manufacturer", value: "Honda" },
    { name: "displacement", value: "153" },
    { name: "max_speed", value: "95" },
    { name: "power", value: "15.4 л.с / 11.4 кВт / 8500 об.мин" },
    { name: "fuel_tank_volume", value: "8.1" },
    { name: "weight", value: "132" },
    { name: "seat_height", value: "764" }
  ]
};

fetch('/api/admin/products', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(productData)
});
```

### Поиск с фильтрацией
```javascript
const searchParams = new URLSearchParams({
  q: 'honda',
  category: 'scooters',
  page: '1',
  limit: '10'
});

fetch(`/api/search?${searchParams}`)
  .then(response => response.json())
  .then(data => console.log(data.results));
```

### Сравнение товаров
```javascript
const productIds = ['prod-1', 'prod-2', 'prod-3'];

fetch(`/api/products/compare?ids=${productIds.join(',')}`)
  .then(response => response.json())
  .then(data => {
    console.log('Товары для сравнения:', data.products);
    console.log('Таблица сравнения:', data.comparisonTable);
  });
```
