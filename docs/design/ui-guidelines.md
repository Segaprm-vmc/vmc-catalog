 # UI Guidelines - VMC Учебник

## Общие принципы UI

### Философия интерфейса
- **Простота превыше всего** - каждый элемент должен служить изучению товаров
- **Премиальность без перегрузки** - показать успешность VMC, но не отвлекать от контента
- **Интуитивность** - менеджеры должны понимать интерфейс без обучения
- **Мобильность** - работа на всех устройствах

### Целевая аудитория
Менеджеры VMC различного уровня технической подготовки, изучающие мототехнику для продаж.

## Цветовая схема

### Основная палитра
```css
/* Фирменный красный VMC */
--vmc-red: #EC2834;
--vmc-red-light: #F5B7BB;
--vmc-red-dark: #C41E2A;

/* Основной черный */
--vmc-black: #1E1E1E;
--vmc-black-light: #2A2A2A;

/* Нейтральный серый */
--vmc-gray: #CCCCCC;
--vmc-gray-light: #F8F9FA;
--vmc-gray-dark: #6C757D;

/* Фоны */
--vmc-white: #FFFFFF;
--vmc-background: #FAFBFC;
```

### Применение цветов
- **Красный (#EC2834)**: CTA кнопки, активные состояния, важные акценты, логотип
- **Черный (#1E1E1E)**: заголовки, основной текст, иконки
- **Серый (#CCCCCC)**: второстепенный текст, разделители, неактивные элементы
- **Белый (#FFFFFF)**: фоны карточек, модальных окон, контентных блоков

## Типографика

### Иерархия заголовков
```css
h1 { font-size: 2.5rem; font-weight: 700; color: var(--vmc-black); }    /* Названия страниц */
h2 { font-size: 2rem; font-weight: 600; color: var(--vmc-black); }      /* Названия товаров */
h3 { font-size: 1.5rem; font-weight: 500; color: var(--vmc-black); }    /* Разделы страницы */
h4 { font-size: 1.25rem; font-weight: 500; color: var(--vmc-gray-dark); } /* Подразделы */
```

### Основной текст
```css
body { font-size: 1rem; line-height: 1.6; color: var(--vmc-black); }
.text-secondary { font-size: 0.875rem; color: var(--vmc-gray-dark); }
.text-small { font-size: 0.75rem; color: var(--vmc-gray); }
```

## Компоненты интерфейса

### Кнопки
```css
/* Основная кнопка */
.btn-primary {
  background: var(--vmc-red);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--vmc-red-dark);
  transform: translateY(-1px);
}

/* Вторичная кнопка */
.btn-secondary {
  background: transparent;
  color: var(--vmc-black);
  border: 1px solid var(--vmc-gray);
  padding: 12px 24px;
  border-radius: 8px;
}

/* Кнопка-ссылка */
.btn-link {
  color: var(--vmc-red);
  text-decoration: none;
  font-weight: 500;
}
```

### Карточки товаров
```css
.product-card {
  background: white;
  border: 1px solid var(--vmc-gray-light);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(236, 40, 52, 0.15);
  border-color: var(--vmc-red-light);
}
```

### Формы
```css
.form-input {
  border: 1px solid var(--vmc-gray);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  border-color: var(--vmc-red);
  outline: none;
  box-shadow: 0 0 0 3px rgba(236, 40, 52, 0.1);
}

.form-label {
  font-weight: 500;
  color: var(--vmc-black);
  margin-bottom: 8px;
}
```

## Навигация

### Главное меню
- Логотип VMC слева
- Категории товаров в центре
- Поиск справа
- Мобильное меню-бургер на планшетах/телефонах

### Хлебные крошки
```
Главная > Скутера > VMC INFERNO NEW BY49QT-5A
```

### Пагинация
- Простые стрелки и номера страниц
- Текущая страница выделена красным цветом
- Максимум 7 видимых страниц

## Сетка и отступы

### Сетка товаров
- **Десктоп**: 4 колонки (xl:grid-cols-4)
- **Планшет**: 3 колонки (md:grid-cols-3)  
- **Мобильный**: 2 колонки (grid-cols-2)

### Отступы
```css
--space-xs: 4px;   /* Мелкие отступы */
--space-sm: 8px;   /* Между элементами */
--space-md: 16px;  /* Стандартные отступы */
--space-lg: 24px;  /* Между секциями */
--space-xl: 32px;  /* Большие отступы */
--space-2xl: 48px; /* Отступы между страницами */
```

## Иконки

### Размеры
- **16px**: в тексте, мелкие кнопки
- **20px**: в формах, карточках  
- **24px**: в навигации, заголовках
- **32px**: крупные действия
- **48px**: пустые состояния, загрузка

### Стиль
- Outline иконки (не filled)
- Толщина линии: 1.5px
- Цвет по умолчанию: var(--vmc-black)
- Hover состояние: var(--vmc-red)

## Состояния интерфейса

### Loading состояния
```css
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.spinner {
  border: 2px solid var(--vmc-gray-light);
  border-top: 2px solid var(--vmc-red);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

### Empty состояния
- Простая иллюстрация в фирменных цветах
- Понятный текст объяснения
- CTA кнопка для действия

### Error состояния
- Красный цвет для ошибок
- Иконка + текст + кнопка повтора
- Дружелюбные формулировки

## Анимации

### Принципы
- Быстрые: 200-300ms
- Плавные: ease-out для появления, ease-in для исчезновения
- Subtle: заметные, но не отвлекающие

### Основные анимации
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-fade-in { animation: fadeIn 0.3s ease-out; }
.animate-slide-up { animation: slideUp 0.4s ease-out; }
```

## Адаптивность

### Breakpoints
```css
/* Мобильный: до 768px */
@media (max-width: 767px) {
  /* Меню бургер, карточки в 1-2 колонки */
}

/* Планшет: 768px - 1023px */
@media (min-width: 768px) and (max-width: 1023px) {
  /* 3 колонки товаров, компактная навигация */
}

/* Десктоп: от 1024px */
@media (min-width: 1024px) {
  /* Полная навигация, 4 колонки товаров */
}
```

### Адаптивные паттерны
- **Навигация**: горизонтальная → бургер-меню
- **Галереи**: клики → свайпы
- **Таблицы**: горизонтальный скролл или карточки
- **Поиск**: встроенный → полноэкранный оверлей

## Доступность

### Цветовая контрастность
- Основной текст: минимум 4.5:1
- Крупный текст: минимум 3:1
- Красный VMC на белом: соответствует WCAG AA

### Фокус и навигация
```css
.focus-visible {
  outline: 2px solid var(--vmc-red);
  outline-offset: 2px;
}

/* Для элементов навигации */
.nav-link:focus-visible {
  background: rgba(236, 40, 52, 0.1);
}
```

### Семантика
- Используй правильные HTML теги (nav, main, article, aside)
- ARIA-labels для сложных компонентов
- Alt тексты для всех изображений товаров
- Screen reader friendly navigation

## Специфика VMC

### Галереи товаров
- Основное фото крупно
- Превью снизу или сбоку
- Zoom при наведении на десктопе
- Свайп на мобильных устройствах

### Таблицы характеристик
```css
.characteristics-table th {
  background: var(--vmc-gray-light);
  font-weight: 600;
  color: var(--vmc-black);
}

.characteristics-table tr:hover {
  background: rgba(236, 40, 52, 0.05);
}
```

### Поиск
- Автокомплит с подсветкой
- Фильтры по категориям
- Результаты с превью товаров

### Мобильные особенности
- Увеличенные зоны касания (минимум 44px)
- Свайп-жесты для галерей
- Pull-to-refresh для обновления данных
- Sticky навигация при скролле

Эти UI guidelines обеспечивают консистентный и удобный интерфейс для изучения мототехники VMC.
