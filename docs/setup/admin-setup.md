 # Admin Setup - VMC Учебник

## Обзор готовых админок

Для быстрой разработки VMC Учебника мы используем готовые решения вместо создания админки с нуля.

### Варианты админок

#### 1. React Admin (рекомендуется)
- **Плюсы**: Много готовых компонентов, активное сообщество, хорошая документация
- **Минусы**: Может быть избыточным для простых задач
- **Время интеграции**: 2-3 часа

#### 2. shadcn/ui Components
- **Плюсы**: Современный дизайн, легко кастомизировать, TypeScript
- **Минусы**: Больше ручной работы
- **Время интеграции**: 4-5 часов

#### 3. Admin.js
- **Плюсы**: Автогенерация из Prisma, минимальная настройка
- **Минусы**: Меньше контроля над UI
- **Время интеграции**: 1-2 часа

## Вариант 1: React Admin

### Установка React Admin
```bash
cd apps/admin

# Установка основных пакетов
npm install react-admin ra-data-json-server

# Дополнительные пакеты для VMC
npm install ra-input-rich-text ra-data-simple-rest

# TypeScript типы
npm install --save-dev @types/react-admin
```

### Базовая структура
```typescript
// apps/admin/src/App.tsx
import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from 'react-admin';
import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';

// Компоненты для товаров
import { ProductList } from './components/products/ProductList';
import { ProductEdit } from './components/products/ProductEdit';
import { ProductCreate } from './components/products/ProductCreate';
import { ProductShow } from './components/products/ProductShow';

// Компоненты для категорий
import { CategoryList } from './components/categories/CategoryList';
import { CategoryEdit } from './components/categories/CategoryEdit';

function App() {
  return (
    <Admin 
      dataProvider={dataProvider}
      authProvider={authProvider}
      title="VMC Админка"
      theme={{
        palette: {
          primary: { main: '#EC2834' }, // VMC красный
          secondary: { main: '#1E1E1E' }, // VMC черный
        },
      }}
    >
      {/* Ресурсы */}
      <Resource 
        name="products" 
        list={ProductList} 
        edit={ProductEdit} 
        create={ProductCreate}
        show={ProductShow}
        options={{ label: 'Товары' }}
      />
