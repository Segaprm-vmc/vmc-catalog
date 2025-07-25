 # Git Workflow - VMC Учебник

## Обзор рабочего процесса

Проект VMC Учебник использует **GitHub Flow** - простой и эффективный workflow для быстрой разработки.

### Основные принципы
- `main` ветка всегда готова к продакшену
- Создаем feature ветки от `main`
- Делаем частые коммиты с осмысленными сообщениями
- Pull Request для каждой фичи
- Тестируем перед мержем
- Деплоим из `main`

## Структура веток

### Main ветка
```bash
main                    # Основная ветка (всегда стабильная)
├── v1.0.0             # Теги для релизов  
├── v1.1.0
└── v1.2.0
```

### Feature ветки
```bash
feature/product-search          # Новая функциональность
feature/admin-dashboard        # Крупная фича
fix/image-loading-bug          # Исправление бага
hotfix/critical-api-error      # Критическое исправление
docs/update-api-docs           # Обновление документации
chore/update-dependencies      # Технические задачи
```

## Соглашения по именованию

### Префиксы веток
- `feature/` - новая функциональность
- `fix/` - исправление багов
- `hotfix/` - критические исправления
- `docs/` - документация
- `style/` - стили, UI изменения
- `refactor/` - рефакторинг кода
- `test/` - добавление тестов
- `chore/` - технические задачи

### Примеры названий веток
```bash
# ✅ Хорошо - описательные названия
feature/add-product-comparison
feature/implement-search-filters
fix/resolve-image-gallery-bug
hotfix/fix-database-connection
docs/update-installation-guide
style/apply-vmc-brand-colors
refactor/extract-api-service
test/add-product-form-tests
chore/upgrade-next-js-version

# ❌ Плохо - неинформативные названия
feature/new-stuff
fix/bug
update/changes
temp/test
```

## Commit сообщения

### Conventional Commits
Используем [Conventional Commits](https://www.conventionalcommits.org/) для структурированных сообщений.

### Формат
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Типы коммитов
```bash
feat:     # Новая функциональность
fix:      # Исправление бага
docs:     # Обновление документации
style:    # Стили, форматирование (не влияет на код)
refactor: # Рефакторинг (не добавляет функций, не исправляет баги)
test:     # Добавление или изменение тестов
chore:    # Технические задачи (обновление зависимостей, конфиг)
perf:     # Улучшение производительности
ci:       # Изменения CI/CD
build:    # Изменения системы сборки
revert:   # Отмена предыдущего коммита
```

### Примеры коммитов
```bash
# ✅ Хорошо - простые коммиты
feat: add product search functionality
fix: resolve image loading in gallery
docs: update API documentation
style: apply VMC brand colors to buttons

# ✅ Хорошо - с scope
feat(admin): add product creation form
fix(api): handle database connection errors
test(product): add unit tests for ProductCard

# ✅ Хорошо - с детальным описанием
feat: implement product comparison feature

Add ability to compare up to 4 products side by side.
Features include:
- Compare all 65 characteristics
- Highlight differences between products
- Export comparison as PDF
- Share comparison via link

Closes #123

# ✅ Хорошо - breaking changes
feat!: migrate to new API structure

BREAKING CHANGE: Product API now returns nested category object
instead of categoryId. Update all API calls accordingly.

# ❌ Плохо - неинформативные коммиты
fix: bug
update: stuff
wip: working on something
temp: temporary changes
```

## Рабочий процесс

### 1. Создание feature ветки
```bash
# Переключаемся на main и получаем последние изменения
git checkout main
git pull origin main

# Создаем новую feature ветку
git checkout -b feature/product-search

# Альтернативно - создаем и сразу отправляем на remote
git checkout -b feature/product-search
git push -u origin feature/product-search
```

### 2. Разработка
```bash
# Делаем изменения в коде
# Добавляем файлы для коммита
git add .

# Делаем коммит с описательным сообщением
git commit -m "feat: add basic search input component"

# Продолжаем разработку
git add src/components/SearchResults.tsx
git commit -m "feat: implement search results display"

git add src/hooks/useSearch.ts
git commit -m "feat: add search logic hook"

# Регулярно отправляем изменения на remote
git push origin feature/product-search
```

### 3. Синхронизация с main
```bash
# Получаем последние изменения из main
git checkout main
git pull origin main

# Переключаемся обратно на feature ветку
git checkout feature/product-search

# Мержим изменения из main (или используем rebase)
git merge main

# Если есть конфликты - разрешаем их
# Отправляем обновленную ветку
git push origin feature/product-search
```

### 4. Pull Request
```markdown
## Описание
Добавлена функциональность поиска товаров по названию и характеристикам.

## Изменения
- ✅ Компонент SearchInput с автокомплитом
- ✅ Хук useSearch для логики поиска  
- ✅ Страница результатов поиска
- ✅ Интеграция с API поиска
- ✅ Мобильная адаптация

## Тестирование
- [x] Unit тесты для SearchInput
- [x] Integration тесты для useSearch
- [x] Ручное тестирование на всех устройствах

## Скриншоты
[Прикрепить скриншоты интерфейса]

## Связанные задачи
Closes #123
Related to #124
```

### 5. Code Review
```bash
# Reviewer проверяет код
# Оставляет комментарии в PR
# Запрашивает изменения если нужно

# Автор вносит правки
git add .
git commit -m "fix: address code review comments"
git push origin feature/product-search

# После одобрения - мерж в main
```

### 6. Завершение
```bash
# После мержа PR - удаляем локальную ветку
git checkout main
git pull origin main
git branch -d feature/product-search

# Удаляем remote ветку (если не сделано автоматически)
git push origin --delete feature/product-search
```

## Hotfix процесс

### Критические исправления
```bash
# Создаем hotfix ветку от main
git checkout main
git pull origin main
git checkout -b hotfix/fix-critical-api-error

# Делаем минимальное исправление
git add src/api/products.ts
git commit -m "hotfix: fix null pointer in products API"

# Немедленно создаем PR
git push -u origin hotfix/fix-critical-api-error

# После мержа - обновляем версию и создаем тег
git checkout main
git pull origin main
git tag v1.2.1
git push origin v1.2.1
```

## Теги и релизы

### Семантическое версионирование
```bash
# Формат: MAJOR.MINOR.PATCH
v1.0.0    # Первый релиз
v1.0.1    # Patch - исправление багов
v1.1.0    # Minor - новая функциональность (обратно совместимая)
v2.0.0    # Major - breaking changes
```

### Создание релиза
```bash
# Создаем тег для релиза
git checkout main
git pull origin main

# Обновляем версию в package.json
npm version minor  # или patch/major

# Создаем тег
git tag v1.1.0

# Отправляем тег на remote
git push origin v1.1.0

# Создаем release notes в GitHub
```

## Полезные команды

### Просмотр истории
```bash
# Красивый лог коммитов
git log --oneline --graph --decorate

# Изменения в конкретном файле
git log --follow src/components/ProductCard.tsx

# Коммиты конкретного автора
git log --author="Sergej"

# Коммиты за период
git log --since="2024-01-01" --until="2024-01-31"
```

### Работа с изменениями
```bash
# Посмотреть статус
git status

# Посмотреть изменения
git diff
git diff --staged

# Отменить изменения в файле
git checkout -- src/components/ProductCard.tsx

# Отменить последний коммит (сохранив изменения)
git reset HEAD~1

# Изменить последний коммит
git commit --amend -m "новое сообщение"
```

### Stash (временное сохранение)
```bash
# Сохранить текущие изменения
git stash save "работа над поиском"

# Посмотреть список stash
git stash list

# Восстановить последний stash
git stash pop

# Восстановить конкретный stash
git stash apply stash@{1}

# Удалить stash
git stash drop stash@{1}
```

## Решение конфликтов

### При merge конфликтах
```bash
# Git покажет конфликтующие файлы
git status

# Редактируем файлы, разрешаем конфликты
# Ищем маркеры: <<<<<<< HEAD, =======, >>>>>>> 

# После разрешения - добавляем файлы
git add src/components/ProductCard.tsx

# Завершаем merge
git commit -m "resolve merge conflicts"
```

### Пример разрешения конфликта
```typescript
// ❌ Конфликт в файле
<<<<<<< HEAD
function ProductCard({ product }: ProductCardProps) {
  return <div className="product-card-new">{product.name}</div>;
}
=======
function ProductCard({ product }: ProductCardProps) {
  return <div className="product-card-updated">{product.name}</div>;
}
>>>>>>> feature/update-styles

// ✅ После разрешения
function ProductCard({ product }: ProductCardProps) {
  return <div className="product-card-updated">{product.name}</div>;
}
```

## GitHub настройки

### Branch protection rules
```yaml
# Настройки для main ветки:
- Require pull request reviews before merging
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Include administrators
- Allow force pushes: false
- Allow deletions: false
```

### Автоматизация
```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build
```

## Лучшие практики

### Коммиты
- Делайте частые, маленькие коммиты
- Каждый коммит должен компилироваться
- Одна логическая единица изменений = один коммит
- Пишите осмысленные сообщения коммитов

### Ветки
- Создавайте ветку для каждой задачи
- Удаляйте ветки после мержа
- Не коммитьте напрямую в main
- Синхронизируйтесь с main регулярно

### Pull Requests
- Делайте небольшие PR (до 400 строк)
- Пишите детальные описания
- Добавляйте скриншоты для UI изменений
- Отвечайте на комментарии reviewer'ов

### Code Review
- Проверяйте код внимательно
- Давайте конструктивные комментарии
- Одобряйте PR только после тщательной проверки
- Тестируйте изменения локально

Этот Git workflow обеспечивает качественную разработку и легкую поддержку проекта VMC Учебник.
