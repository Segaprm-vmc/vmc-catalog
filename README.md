# VMC Catalog - Каталог мототехники

![VMC Logo](public/images/vmc-logo.png)

**Современный веб-каталог мототехники с админ-панелью и интеграцией Supabase**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-purple.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.49.8-green.svg)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.15-blue.svg)](https://tailwindcss.com/)

## 🚀 Особенности

### ✨ Основной функционал
- 📱 **Адаптивный дизайн** - работает на всех устройствах
- 🔍 **Поиск и фильтрация** моделей мототехники
- 📊 **Детальные характеристики** с таблицами и спецификациями
- 🖼️ **Галерея изображений** с поддержкой увеличения
- 📋 **Регламенты обслуживания** с документами
- 📰 **Система новостей** с медиафайлами
- 🔗 **Интеграция с Яндекс.Диск** для дополнительных фото

### 🛠️ Админ-панель
- 🔐 **Безопасная авторизация** по токену
- ✏️ **CRUD операции** для моделей, новостей, регламентов
- 📤 **Загрузка изображений** с автоматическим сжатием
- 📊 **Импорт характеристик** из Excel/CSV
- 🔄 **Real-time синхронизация** через Supabase
- 📈 **Статус панель** с мониторингом системы

### 🌐 Кроссбраузерность
- ✅ **Поддержка всех современных браузеров**
- 🔒 **Безопасная работа с localStorage**
- 🔄 **Автоматическое обновление данных**
- 🛠️ **Встроенные инструменты отладки**

## 🏗️ Архитектура

### Frontend
- **React 18** с TypeScript
- **Vite** для быстрой разработки
- **Tailwind CSS** для стилизации
- **Lucide React** для иконок
- **React Router** для навигации

### Backend
- **Supabase** (PostgreSQL) для хранения данных
- **Real-time subscriptions** для синхронизации
- **Row Level Security** для безопасности
- **Автоматические триггеры** для обновления данных

### Структура данных
```sql
-- Таблица моделей мототехники
CREATE TABLE vmc_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  images TEXT[],
  specifications JSONB,
  yandex_disk_link TEXT,
  video_frame TEXT,
  order INTEGER DEFAULT 999,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+ 
- npm или yarn
- Аккаунт Supabase

### Установка

1. **Клонируйте репозиторий**
```bash
git clone https://github.com/yourusername/vmc-catalog.git
cd vmc-catalog
```

2. **Установите зависимости**
```bash
npm install
```

3. **Настройте Supabase**
```bash
# Создайте проект в Supabase Dashboard
# Выполните SQL скрипт из supabase-migration.sql
# Обновите credentials в src/lib/supabase.ts
```

4. **Запустите проект**
```bash
npm run dev
```

5. **Откройте браузер**
```
http://localhost:5173
```

### Настройка Supabase

1. Создайте новый проект в [Supabase Dashboard](https://supabase.com/dashboard)
2. Выполните SQL скрипт из `supabase-migration.sql`
3. Обновите credentials в `src/lib/supabase.ts`:

```typescript
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
```

## 📖 Использование

### Основной интерфейс
- **Главная страница**: обзор каталога и навигация
- **Модели**: детальная информация о мототехнике
- **Новости**: актуальные новости и обновления
- **Регламенты**: документы по обслуживанию

### Админ-панель
Доступ: `Ctrl+Shift+A` или `/admin`

**Токен по умолчанию**: `admin123`

#### Функции:
- 📝 Создание и редактирование моделей
- 🖼️ Загрузка и управление изображениями
- 📊 Импорт характеристик из Excel
- 📰 Управление новостями
- 📋 Создание регламентов
- 🔄 Принудительное обновление данных
- 🛠️ Инструменты отладки

## 🔧 Разработка

### Структура проекта
```
vmc-catalog/
├── public/                 # Статические файлы
│   ├── images/            # Изображения
│   ├── documents/         # Документы
│   └── api/              # PHP API (legacy)
├── src/
│   ├── api/              # API классы
│   ├── components/       # React компоненты
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Библиотеки (Supabase)
│   ├── pages/           # Страницы
│   ├── services/        # Сервисы
│   └── types/           # TypeScript типы
├── dist/                # Сборка для продакшена
└── docs/               # Документация
```

### Команды разработки

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Предпросмотр сборки
npm run preview

# Линтинг
npm run lint

# Проверка типов
npm run type-check
```

### Добавление новой модели

1. **Через админ-панель** (рекомендуется):
   - Откройте админ-панель (`Ctrl+Shift+A`)
   - Перейдите в "Управление моделями"
   - Нажмите "Создать модель"

2. **Через API**:
```typescript
import { SupabaseModelsAPI } from '@/api/supabaseModels';

const newModel = await SupabaseModelsAPI.createModel({
  name: 'Новая модель',
  description: 'Описание модели',
  images: ['image1.jpg'],
  specifications: {
    'Двигатель': '250cc',
    'Мощность': '25 л.с.'
  },
  yandexDiskLink: 'https://disk.yandex.ru/...',
  order: 1
});
```

## 🚀 Развертывание

### Подготовка к развертыванию

1. **Сборка проекта**
```bash
npm run build
```

2. **Файлы готовы в папке `dist/`**
- Загрузите все файлы на веб-сервер
- Настройте веб-сервер (Apache/Nginx)
- Проверьте подключение к Supabase

### Поддерживаемые хостинги
- ✅ **Vercel** (рекомендуется)
- ✅ **Netlify**
- ✅ **GitHub Pages**
- ✅ **Обычный веб-хостинг** (Apache/Nginx)

### Настройка веб-сервера

**Apache** (`.htaccess` уже включен):
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

**Nginx**:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 🔍 Troubleshooting

### Частые проблемы

#### Модели не загружаются
```javascript
// В консоли браузера (F12):
localStorage.clear();
window.location.reload();
```

#### Ошибки Supabase
- Проверьте credentials в `src/lib/supabase.ts`
- Убедитесь что таблица `vmc_models` создана
- Проверьте RLS политики

#### Проблемы с админ-панелью
- Используйте `Ctrl+Shift+A` для доступа
- Токен по умолчанию: `admin123`
- Проверьте кнопку "Отладка" для диагностики

### Инструменты отладки
- **Админ-панель**: статус система и отладка
- **Консоль браузера**: подробные логи
- **test-supabase.html**: тестирование подключения

## 📚 Документация

- [Настройка Supabase](SUPABASE_SETUP.md)
- [Кроссбраузерность](BROWSER_COMPATIBILITY.md)
- [Развертывание](DEPLOYMENT.md)
- [Настройка хостинга](HOSTING_SETUP.md)

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл [LICENSE](LICENSE) для подробностей.

## 👥 Авторы

- **VMC Team** - *Разработка и поддержка*

## 🙏 Благодарности

- [React](https://reactjs.org/) - UI библиотека
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS фреймворк
- [Vite](https://vitejs.dev/) - Build tool
- [Lucide](https://lucide.dev/) - Иконки

---

**Версия**: 2.0.0 (Supabase Production + Cross-browser)  
**Дата обновления**: 07.12.2024  
**Статус**: ✅ Готов к продакшену
