 # Дизайн-система VMC Учебник

## Философия дизайна

### Принципы
- **Простота и лаконичность** - ничего лишнего, фокус на контенте
- **Премиальность** - показать успешность компании VMC
- **Функциональность** - каждый элемент служит изучению товаров
- **Минимализм с характером** - не пустой, но и не перегруженный

### Целевая аудитория
Менеджеры компании VMC, изучающие мототехнику для продаж

## Цветовая палитра

### Основные цвета
```css
:root {
  /* Фирменный красный - основной акцент */
  --vmc-red: #EC2834;
  --vmc-red-rgb: 236, 40, 52;
  
  /* Черный - основной текст */
  --vmc-black: #1E1E1E;
  --vmc-black-rgb: 30, 30, 30;
  
  /* Серый - второстепенные элементы */
  --vmc-gray: #CCCCCC;
  --vmc-gray-rgb: 204, 204, 204;
  
  /* Белый - фоны */
  --vmc-white: #FFFFFF;
  --vmc-white-rgb: 255, 255, 255;
}
```

### Использование цветов
- **Красный (#EC2834)**: CTA кнопки, активные состояния, заголовки разделов, логотип
- **Черный (#1E1E1E)**: основной текст, заголовки товаров, иконки
- **Серый (#CCCCCC)**: второстепенный текст, разделители, неактивные элементы
- **Белый (#FFFFFF)**: фоны, карточки товаров

### Дополнительные оттенки
```css
:root {
  /* Оттенки для состояний */
  --vmc-red-light: #F5B7BB;
  --vmc-red-dark: #C41E2A;
  --vmc-gray-light: #F8F9FA;
  --vmc-gray-dark: #6C757D;
}
```

## Типографика

### Шрифты
```css
:root {
  --font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;
}
```

### Размеры и веса
```css
:root {
  /* Заголовки */
  --text-h1: 2.5rem; /* 40px */
  --text-h2: 2rem;   /* 32px */
  --text-h3: 1.5rem; /* 24px */
  --text-h4: 1.25rem; /* 20px */
  
  /* Основной текст */
  --text-base: 1rem;    /* 16px */
  --text-sm: 0.875rem;  /* 14px */
  --text-xs: 0.75rem;   /* 12px */
  
  /* Веса */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Применение
- **H1** (40px, bold): Названия страниц ("Скутера", "Мотоциклы")
- **H2** (32px, semibold): Названия товаров
- **H3** (24px, medium): Разделы на странице товара ("Характеристики", "Описание")
- **H4** (20px, medium): Подзаголовки характеристик
- **Body** (16px, normal): Основной текст описаний
- **Small** (14px, normal): Значения характеристик, вторичная информация

## Компоненты

### Кнопки
```css
.btn-primary {
  background: var(--vmc-red);
  color: var(--vmc-white);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
}

.btn-secondary {
  background: transparent;
  color: var(--vmc-black);
  border: 1px solid var(--vmc-gray);
  padding: 12px 24px;
  border-radius: 8px;
}
```

### Карточки товаров
```css
.product-card {
  background: var(--vmc-white);
  border: 1px solid var(--vmc-gray-light);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(236, 40, 52, 0.1);
}
```

### Таблица характеристик
```css
.characteristics-table {
  width: 100%;
  border-collapse: collapse;
}

.characteristics-table th {
  background: var(--vmc-gray-light);
  color: var(--vmc-black);
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
}

.characteristics-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--vmc-gray-light);
}

.characteristics-table tr:hover {
  background: rgba(236, 40, 52, 0.05);
}
```

## Spacing (отступы)

```css
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
  --space-20: 5rem;    /* 80px */
}
```

## Сетка и Layout

### Контейнеры
- **Максимальная ширина**: 1280px
- **Отступы по бокам**: 24px на десктопе, 16px на мобиле
- **Категории**: сетка 3 колонки на десктопе, 1 на мобиле
- **Товары в категории**: сетка 4 колонки на десктопе, 2 на планшете, 1 на мобиле

### Breakpoints
```css
:root {
  --mobile: 320px;
  --tablet: 768px;
  --desktop: 1024px;
  --wide: 1280px;
}
```

## Иконки

### Размеры
- **Small**: 16px - в тексте, кнопках
- **Medium**: 24px - в карточках, навигации  
- **Large**: 32px - заголовки разделов
- **XL**: 48px - пустые состояния

### Стиль
- Outline иконки (не filled)
- Толщина линии: 1.5px
- Цвет по умолчанию: var(--vmc-black)
- Hover: var(--vmc-red)

## Изображения

### Товары
- **Основное фото**: 800x600px (4:3)
- **Галерея**: 400x300px для превью
- **Качество**: 85% JPEG, WebP при поддержке
- **Lazy loading**: обязательно

### Фон и декорации
- Минимальное использование
- Только геометрические формы
- Цвета из основной палитры

## Анимации

### Принципы
- Быстрые (200-300ms)
- Subtle (незаметные, но приятные)
- Easing: ease-out для появления, ease-in для исчезновения

### Основные анимации
```css
.fade-in {
  animation: fadeIn 0.3s ease-out;
}

.slide-up {
  animation: slideUp 0.4s ease-out;
}

.scale-hover:hover {
  transform: scale(1.02);
  transition: transform 0.2s ease-out;
}
```

## Состояния

### Loading
- Skeleton screens для карточек товаров
- Spinner для поиска (красный цвет)
- Прогресс-бар для загрузки изображений

### Empty states  
- Простые иллюстрации в фирменных цветах
- Понятный текст объяснения
- CTA кнопка для действия

### Error states
- Красный цвет для ошибок
- Иконка + текст + кнопка повтора
- Не пугающие формулировки

## Адаптивность

### Mobile First
Все компоненты сначала проектируются для мобильных устройств

### Ключевые адаптации
- Навигация: бургер-меню на мобиле
- Галерея: свайп на мобиле, клики на десктопе  
- Таблицы: скролл или карточки на мобиле
- Поиск: полноэкранный оверлей на мобиле

## Доступность

### Цветовая контрастность
- Основной текст: 4.5:1 минимум
- Крупный текст: 3:1 минимум
- Красный на белом: проверен, соответствует WCAG AA

### Фокус
- Видимые outline для всех интерактивных элементов
- Цвет фокуса: var(--vmc-red)
- Keyboard navigation поддерживается везде

### Семантика
- Правильные HTML теги
- ARIA атрибуты для сложных компонентов
- Alt тексты для всех изображений товаров
