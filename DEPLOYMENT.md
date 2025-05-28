# Инструкции по развертыванию VMC Каталога

## Подготовка к выгрузке на хостинг

### 1. Сборка проекта

```bash
npm run build
```

Это создаст папку `dist` с готовыми файлами для хостинга.

### 2. Структура файлов для хостинга

После сборки нужно выгрузить на хостинг:

```
dist/                    # Основные файлы приложения
├── index.html          # Главная страница
├── assets/             # CSS, JS файлы
├── images/             # Изображения моделей
└── data/               # JSON файлы с данными

public/                 # Статические файлы (копировать отдельно)
├── data/
│   ├── models.json     # Данные моделей
│   ├── news.json       # Новости
│   └── regulations.json # Регламенты
└── images/             # Изображения
    ├── models/         # Фото моделей
    ├── news/           # Изображения новостей
    └── regulations/    # Изображения регламентов
```

### 3. Настройка веб-сервера

#### Apache (.htaccess)
```apache
RewriteEngine On
RewriteBase /

# Handle Angular and Vue.js routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

#### Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # Handle SPA routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # JSON files
    location ~* \.json$ {
        add_header Cache-Control "no-cache";
    }
}
```

### 4. Особенности системы

#### Локальное хранение данных
- Все изменения через админ-панель сохраняются в `localStorage`
- При первой загрузке данные берутся из JSON файлов
- Кнопки "Обновить" очищают localStorage и возвращают к оригинальным данным

#### Структура данных

**Модели** (`/data/models.json`):
```json
[
  {
    "id": "unique-id",
    "name": "Название модели",
    "description": "Описание",
    "images": ["путь/к/изображению.jpg"],
    "specifications": {
      "Характеристика": "Значение"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "order": 1
  }
]
```

**Новости** (`/data/news.json`):
```json
[
  {
    "id": "unique-id",
    "title": "Заголовок",
    "content": "Содержание в Markdown",
    "excerpt": "Краткое описание",
    "image": "путь/к/изображению.jpg",
    "publishedAt": "2024-01-01T00:00:00.000Z",
    "isPublished": true,
    "isFeatured": false,
    "order": 1
  }
]
```

**Регламенты** (`/data/regulations.json`):
```json
[
  {
    "id": "unique-id",
    "title": "Название",
    "content": "Содержание в Markdown",
    "excerpt": "Краткое описание",
    "category": "Категория",
    "image": "путь/к/изображению.jpg",
    "publishedAt": "2024-01-01T00:00:00.000Z",
    "isPublished": true,
    "order": 1
  }
]
```

### 5. Обновление контента

#### Через админ-панель (рекомендуется)
1. Перейти на `/admin`
2. Добавить/редактировать контент
3. Изменения сохраняются в localStorage

#### Прямое редактирование JSON файлов
1. Отредактировать соответствующий JSON файл
2. Загрузить на сервер
3. Обновить страницу или нажать кнопку "Обновить"

### 6. Резервное копирование

Регулярно создавайте резервные копии:
- JSON файлов с данными
- Папки с изображениями
- Настроек веб-сервера

### 7. Мониторинг

Следите за:
- Размером localStorage (ограничение ~5-10MB)
- Производительностью загрузки изображений
- Корректностью отображения на мобильных устройствах

### 8. Безопасность

- Ограничьте доступ к админ-панели (`/admin`)
- Регулярно обновляйте зависимости
- Используйте HTTPS для продакшена

### 9. Поддержка

При возникновении проблем:
1. Проверьте консоль браузера на ошибки
2. Убедитесь в корректности JSON файлов
3. Проверьте пути к изображениям
4. Очистите localStorage и перезагрузите страницу 