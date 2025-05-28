# Правила разработки VMC Catalog

## Архитектура данных

### Хранение данных
* **Основное хранилище**: Supabase (PostgreSQL)
* **Таблица**: `vmc_models` 
* **Fallback**: Пустой массив при недоступности Supabase
* **Real-time**: Автоматическое обновление через Supabase Realtime

### Структура данных модели
```typescript
interface MotorcycleModel {
  id: string;
  name: string;
  description: string; // Markdown
  images: string[];
  specifications: Record<string, string>;
  yandexDiskLink?: string;
  videoFrame?: string; // HTML iframe
  createdAt: string;
  order?: number;
}
``` 