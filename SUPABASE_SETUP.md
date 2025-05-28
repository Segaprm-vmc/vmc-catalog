# Настройка Supabase для VMC Catalog

## Быстрый старт

Проект уже настроен для работы с Supabase. Нужно только выполнить SQL скрипт для создания таблицы.

### 1. Выполните SQL скрипт

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Перейдите в проект VMC: `https://supabase.com/dashboard/project/nqiqdnqmzuqcumxvjveg`
3. Откройте **SQL Editor**
4. Скопируйте и выполните содержимое файла `supabase-migration.sql`

### 2. Проверьте подключение

1. Откройте сайт VMC Catalog
2. Перейдите в админ-панель (Ctrl+Shift+A)
3. Нажмите "🚀 Настройка Supabase"
4. Нажмите "🔗 Подключиться" - должно показать "✅ Подключено"

## Конфигурация

### Credentials (уже настроены)
- **URL**: `https://nqiqdnqmzuqcumxvjveg.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Таблица `vmc_models`

```sql
CREATE TABLE vmc_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  specifications JSONB NOT NULL DEFAULT '{}',
  yandex_disk_link TEXT,
  video_frame TEXT,
  "order" INTEGER DEFAULT 999,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Функции

### Автоматические возможности
- ✅ **Real-time обновления** - изменения синхронизируются между вкладками
- ✅ **Автоматический updated_at** - обновляется при каждом изменении
- ✅ **Индексы** - оптимизированные запросы по order, created_at, name
- ✅ **Row Level Security** - настроена политика доступа

### API методы
- `getAllModels()` - получить все модели
- `createModel()` - создать новую модель
- `updateModel()` - обновить модель
- `deleteModel()` - удалить модель
- `getModelById()` - получить модель по ID
- `searchModels()` - поиск моделей
- `reorderModels()` - изменить порядок
- `moveModel()` - переместить вверх/вниз

## Миграция с JSON

Данные из `models.json` уже включены в SQL скрипт миграции. После выполнения скрипта:

1. ✅ Локальный `models.json` удален
2. ✅ Все данные перенесены в Supabase
3. ✅ Приложение автоматически использует Supabase
4. ✅ Fallback на пустой массив при недоступности

## Troubleshooting

### Проблема: "Supabase недоступен"
1. Проверьте интернет-соединение
2. Убедитесь, что выполнен SQL скрипт
3. Проверьте credentials в админ-панели

### Проблема: "Данные не загружаются"
1. Откройте DevTools → Console
2. Найдите ошибки с префиксом "❌"
3. Проверьте, что таблица `vmc_models` создана

### Проблема: "Real-time не работает"
1. Убедитесь, что выполнена команда: `ALTER PUBLICATION supabase_realtime ADD TABLE vmc_models;`
2. Перезагрузите страницу

## Мониторинг

### Логи в консоли
- `🚀 Используем Supabase API` - API выбран
- `✅ Supabase подключен успешно` - подключение OK
- `📁 Загружено моделей из Supabase: X` - данные загружены
- `🔄 Real-time обновление моделей` - получено обновление

### Проверка данных
```sql
-- Количество моделей
SELECT COUNT(*) FROM vmc_models;

-- Список моделей
SELECT id, name, "order" FROM vmc_models ORDER BY "order";

-- Последние изменения
SELECT id, name, updated_at FROM vmc_models ORDER BY updated_at DESC;
``` 