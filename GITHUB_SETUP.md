# Настройка GitHub репозитория для VMC Catalog

## 🚀 Шаги для создания репозитория на GitHub

### 1. Создание репозитория на GitHub

1. **Перейдите на GitHub.com**
   - Войдите в свой аккаунт GitHub
   - Нажмите кнопку "New repository" (зеленая кнопка)

2. **Настройте репозиторий**
   ```
   Repository name: vmc-catalog
   Description: Современный веб-каталог мототехники с админ-панелью и интеграцией Supabase
   Visibility: Public (или Private по желанию)
   
   ❌ НЕ добавляйте:
   - README file (у нас уже есть)
   - .gitignore (у нас уже есть)
   - License (можно добавить позже)
   ```

3. **Нажмите "Create repository"**

### 2. Подключение локального репозитория

После создания репозитория на GitHub выполните команды:

```bash
# Добавить remote origin (замените YOUR_USERNAME на ваш GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/vmc-catalog.git

# Отправить код на GitHub
git push -u origin main
```

### 3. Альтернативный способ (если есть проблемы)

Если возникают проблемы с push, попробуйте:

```bash
# Проверить статус
git status

# Убедиться что все изменения закоммичены
git add .
git commit -m "Initial commit: VMC Catalog v2.0.0"

# Отправить с force (осторожно!)
git push -u origin main --force
```

### 4. Настройка GitHub Pages (опционально)

Для автоматического развертывания на GitHub Pages:

1. **Перейдите в Settings репозитория**
2. **Найдите раздел "Pages"**
3. **Выберите источник: "GitHub Actions"**
4. **Создайте файл `.github/workflows/deploy.yml`:**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### 5. Настройка Supabase для продакшена

После развертывания обновите Supabase credentials:

1. **Создайте отдельный проект Supabase для продакшена**
2. **Обновите `src/lib/supabase.ts`:**

```typescript
// Для продакшена используйте environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_PRODUCTION_URL'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_PRODUCTION_KEY'
```

3. **Создайте файл `.env.example`:**

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 6. Обновление README

После создания репозитория обновите ссылку в README.md:

```markdown
git clone https://github.com/YOUR_USERNAME/vmc-catalog.git
```

## 🔧 Команды для работы с репозиторием

```bash
# Клонирование
git clone https://github.com/YOUR_USERNAME/vmc-catalog.git

# Обновление с GitHub
git pull origin main

# Отправка изменений
git add .
git commit -m "Описание изменений"
git push origin main

# Создание новой ветки
git checkout -b feature/new-feature
git push -u origin feature/new-feature
```

## 📋 Checklist после создания репозитория

- [ ] Репозиторий создан на GitHub
- [ ] Код загружен на GitHub
- [ ] README.md отображается корректно
- [ ] Настроен GitHub Pages (опционально)
- [ ] Обновлены Supabase credentials для продакшена
- [ ] Создан .env.example файл
- [ ] Добавлены contributors (если нужно)
- [ ] Настроены branch protection rules (опционально)

## 🌐 Полезные ссылки

- [GitHub Desktop](https://desktop.github.com/) - GUI для работы с Git
- [GitHub CLI](https://cli.github.com/) - Командная строка GitHub
- [GitHub Actions](https://github.com/features/actions) - CI/CD
- [GitHub Pages](https://pages.github.com/) - Бесплатный хостинг

---

**Следующие шаги:**
1. Создайте репозиторий на GitHub
2. Выполните команды подключения
3. Проверьте что код загрузился
4. Настройте автоматическое развертывание (опционально) 