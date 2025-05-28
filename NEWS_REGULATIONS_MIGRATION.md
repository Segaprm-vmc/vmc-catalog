# 🔄 Миграция новостей и регламентов на Supabase

## ✅ Что готово

- ✅ **SQL скрипт миграции**: `supabase-news-regulations-migration.sql`
- ✅ **API классы Supabase**: `supabaseNews.ts`, `supabaseRegulations.ts`
- ✅ **Обновленные API**: `news.ts`, `regulations.ts` переключены на Supabase
- ✅ **Структура данных**: таблицы `vmc_news` и `vmc_regulations`
- ✅ **Все данные подготовлены**: 4 новости + 8 регламентов

## 🚀 Шаги миграции

### 1. Выполните SQL скрипт в Supabase

1. **Откройте Supabase Dashboard**: https://supabase.com/dashboard/project/nqiqdnqmzuqcumxvjveg
2. **Перейдите в SQL Editor**
3. **Скопируйте и выполните** содержимое файла `supabase-news-regulations-migration.sql`
4. **Проверьте результат**: должно создаться 2 таблицы с данными

### 2. Проверьте созданные таблицы

**Таблица `vmc_news`:**
- 4 новости (products, company, events, maintenance)
- Поля: id, title, content, excerpt, image, document, category, featured, published, etc.

**Таблица `vmc_regulations`:**
- 8 регламентов (maintenance, safety, technical, warranty)
- Поля: id, title, description, category, content, screenshot, download_links, etc.

### 3. Обновите приложение

Код уже обновлен для использования Supabase:
- `src/api/news.ts` → использует `SupabaseNewsAPI`
- `src/api/regulations.ts` → использует `SupabaseRegulationsAPI`

### 4. Проверьте работу

```bash
npm run dev
```

Проверьте:
- ✅ Страница "Новости" загружает данные из Supabase
- ✅ Страница "Регламенты" загружает данные из Supabase
- ✅ Админ-панель может создавать/редактировать новости и регламенты

## 📋 Структура данных

### Новости (vmc_news)

```sql
CREATE TABLE vmc_news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  image TEXT,
  document JSONB,
  category TEXT DEFAULT 'general',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  publish_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  order_index INTEGER DEFAULT 999
);
```

### Регламенты (vmc_regulations)

```sql
CREATE TABLE vmc_regulations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  content TEXT,
  screenshot TEXT,
  download_links JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  order_index INTEGER DEFAULT 999
);
```

## 🔧 API методы

### Новости

```typescript
import { SupabaseNewsAPI } from './api/supabaseNews';

// Получить все новости
const news = await SupabaseNewsAPI.getNews();

// Получить новость по ID
const newsItem = await SupabaseNewsAPI.getNewsById('news-1');

// Создать новость
const newNews = await SupabaseNewsAPI.createNews({
  title: 'Заголовок',
  content: 'Содержимое',
  category: 'products',
  featured: false,
  published: true,
  order: 1
});

// Обновить новость
const updated = await SupabaseNewsAPI.updateNews('news-1', {
  title: 'Новый заголовок'
});

// Удалить новость
const deleted = await SupabaseNewsAPI.deleteNews('news-1');
```

### Регламенты

```typescript
import { SupabaseRegulationsAPI } from './api/supabaseRegulations';

// Получить все регламенты
const regulations = await SupabaseRegulationsAPI.getRegulations();

// Получить регламент по ID
const regulation = await SupabaseRegulationsAPI.getRegulationById('reg-001');

// Поиск по регламентам
const found = await SupabaseRegulationsAPI.searchRegulations('масло');

// Получить по категории
const maintenance = await SupabaseRegulationsAPI.getRegulationsByCategory('maintenance');
```

## 🎯 Преимущества миграции

### ✅ Что улучшилось:

1. **Real-time обновления** - изменения синхронизируются между устройствами
2. **Надежность** - PostgreSQL вместо JSON файлов
3. **Масштабируемость** - неограниченное количество записей
4. **Поиск** - полнотекстовый поиск по содержимому
5. **Безопасность** - Row Level Security и политики доступа
6. **Производительность** - индексы и оптимизированные запросы

### 📊 Статистика:

- **Новости**: 4 записи → неограниченно
- **Регламенты**: 8 записей → неограниченно
- **Категории новостей**: products, company, events, maintenance
- **Категории регламентов**: maintenance, safety, technical, warranty

## 🔄 Откат (если нужно)

Если нужно вернуться к JSON файлам:

1. **Восстановите старые API файлы** из git истории
2. **Удалите Supabase API файлы**
3. **Обновите импорты** в компонентах

## 📞 Поддержка

При проблемах:

1. **Проверьте Supabase подключение**: консоль браузера (F12)
2. **Проверьте таблицы**: Supabase Dashboard → Table Editor
3. **Проверьте RLS политики**: должны разрешать доступ
4. **Fallback данные**: система автоматически переключится на fallback при ошибках

## 🎉 Результат

После миграции:
- ✅ Новости и регламенты хранятся в Supabase PostgreSQL
- ✅ Real-time синхронизация работает
- ✅ Админ-панель поддерживает CRUD операции
- ✅ Поиск и фильтрация по категориям
- ✅ Автоматический fallback при ошибках
- ✅ Кроссбраузерная совместимость сохранена

**Система готова к продакшену! 🚀** 