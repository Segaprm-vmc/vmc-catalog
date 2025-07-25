 # Environment Setup - VMC Учебник

## Системные требования

### Минимальные требования
- **OS**: macOS 10.15+, Windows 10+, Ubuntu 18.04+
- **Node.js**: 18.17.0 или выше
- **npm**: 9.0.0 или выше
- **PostgreSQL**: 13.0 или выше
- **RAM**: 4GB (рекомендуется 8GB+)
- **Диск**: 2GB свободного места

### Рекомендуемые инструменты
- **VS Code** или **Cursor AI** (IDE)
- **Git** для версионирования
- **Chrome** с React DevTools
- **Postman** или **Insomnia** для API тестирования

## Установка Node.js

### macOS
```bash
# Через Homebrew (рекомендуется):
brew install node

# Или скачать с официального сайта:
# https://nodejs.org/

# Проверка установки:
node --version  # должно быть v18.17.0+
npm --version   # должно быть v9.0.0+
```

### Windows
```bash
# Скачать установщик с https://nodejs.org/
# Или через winget:
winget install OpenJS.NodeJS

# Или через Chocolatey:
choco install nodejs

# Проверка:
node --version
npm --version
```

### Linux (Ubuntu/Debian)
```bash
# Через NodeSource repository:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверка:
node --version
npm --version
```

## Установка PostgreSQL

### macOS
```bash
# Через Homebrew:
brew install postgresql
brew services start postgresql

# Создание пользователя:
createuser -s postgres
```

### Windows
```bash
# Скачать установщик с https://www.postgresql.org/download/windows/
# Или через Chocolatey:
choco install postgresql

# Добавить в PATH переменную окружения
```

### Linux (Ubuntu/Debian)
```bash
# Установка:
sudo apt update
sudo apt install postgresql postgresql-contrib

# Запуск:
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Создание пользователя:
sudo -u postgres createuser --superuser $USER
sudo -u postgres createdb $USER
```

### Настройка PostgreSQL
```bash
# Подключение к PostgreSQL:
psql postgres

# Создание пользователя для проекта:
CREATE USER vmc_user WITH PASSWORD 'strong_password';

# Создание базы данных:
CREATE DATABASE vmc_handbook OWNER vmc_user;

# Выход:
\q
```

## Установка Git

### macOS
```bash
# Через Xcode Command Line Tools:
xcode-select --install

# Или через Homebrew:
brew install git
```

### Windows
```bash
# Скачать с https://git-scm.com/
# Или через winget:
winget install Git.Git
```

### Linux
```bash
# Ubuntu/Debian:
sudo apt install git

# CentOS/RHEL:
sudo yum install git
```

### Настройка Git
```bash
# Глобальная настройка:
git config --global user.name "Ваше Имя"
git config --global user.email "your.email@example.com"

# Настройка редактора:
git config --global core.editor "code --wait"

# Проверка настроек:
git config --list
```

## Настройка IDE

### VS Code
```bash
# Установка VS Code:
# https://code.visualstudio.com/

# Полезные расширения:
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension prisma.prisma
code --install-extension ms-vscode.vscode-json
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-eslint
```

### Cursor AI (рекомендуется для VMC проекта)
```bash
# Скачать с https://cursor.sh/
# Установить и настроить как основную IDE
# Cursor уже содержит все необходимые расширения для React/TypeScript
```

## Создание проекта

### 1. Клонирование репозитория
```bash
# Создание папки проекта:
mkdir vmc-manager-handbook
cd vmc-manager-handbook

# Инициализация Git:
git init
git branch -M main
```

### 2. Создание структуры проекта
```bash
# Создание базовых папок:
mkdir -p apps/{web,admin,api}
mkdir -p packages/{ui,database,types}
mkdir -p docs/{design,development,setup}

# Создание базовых файлов:
touch README.md
touch .gitignore
touch .env.example
touch package.json
touch turbo.json
```

### 3. Настройка monorepo
```json
// package.json
{
  "name": "vmc-manager-handbook",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "start": "turbo run start",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check"
  },
  "devDependencies": {
    "turbo": "^1.10.0",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
```

### 4. Установка Turbo
```bash
# Установка Turbo глобально:
npm install -g turbo

# Или использование через npx:
npx turbo --version
```

## Переменные окружения

### Создание .env файлов
```bash
# Корневой .env для общих настроек:
touch .env

# Специфичные для каждого приложения:
touch apps/web/.env.local
touch apps/admin/.env.local
touch apps/api/.env
```

### Базовые переменные (.env)
```bash
# Database
DATABASE_URL="postgresql://vmc_user:strong_password@localhost:5432/vmc_handbook"

# General
NODE_ENV="development"
APP_NAME="VMC Учебник"
APP_VERSION="1.0.0"

# Security
JWT_SECRET="super-secure-jwt-secret-key-256-bits"
BCRYPT_ROUNDS=12

# API
API_PORT=8000
API_HOST="localhost"

# Upload settings
UPLOAD_MAX_SIZE=10485760  # 10MB
UPLOAD_PATH="./uploads"
```

### Web приложение (.env.local)
```bash
# Next.js публичная часть
NEXT_PUBLIC_APP_NAME="VMC Учебник"
NEXT_PUBLIC_API_URL="http://localhost:8000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Analytics (опционально)
NEXT_PUBLIC_GA_ID=""

# Search (Algolia)
NEXT_PUBLIC_ALGOLIA_APP_ID=""
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=""
```

### Админка (.env.local)
```bash
# Next.js админка
NEXT_PUBLIC_API_URL="http://localhost:8000"
NEXT_PUBLIC_SITE_URL="http://localhost:3001"

# NextAuth
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="super-secure-nextauth-secret"

# Admin settings
NEXT_PUBLIC_APP_NAME="VMC Админка"
NEXT_PUBLIC_ITEMS_PER_PAGE=20
```

### API (.env)
```bash
# Express API
PORT=8000
HOST="localhost"

# Database
DATABASE_URL="postgresql://vmc_user:strong_password@localhost:5432/vmc_handbook"

# Security
JWT_SECRET="super-secure-jwt-secret-key-256-bits"
JWT_EXPIRES_IN="24h"
BCRYPT_ROUNDS=12

# CORS
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"

# File uploads
UPLOAD_PATH="./public/uploads"
MAX_FILE_SIZE=10485760

# Rate limiting
RATE_LIMIT_WINDOW=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL="debug"
LOG_FILE="./logs/api.log"
```

## Настройка .gitignore

```bash
# .gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Next.js
.next/
out/

# Vercel
.vercel

# TypeScript
*.tsbuildinfo

# Build outputs
dist/
build/

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Logs
logs
*.log

# Coverage directory used by tools like istanbul
coverage/

# Dependency directories
node_modules/

# Optional npm cache directory
.npm

# ESLint cache
.eslintcache

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Database
*.sqlite
*.db

# Uploads
uploads/
public/uploads/

# Temporary files
tmp/
temp/
```

## Валидация установки

### Проверочный скрипт
```bash
#!/bin/bash
# check-environment.sh

echo "🔍 Проверка окружения для VMC Учебник..."

# Проверка Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
    
    if [[ "$NODE_VERSION" < "v18.17.0" ]]; then
        echo "⚠️  Предупреждение: Рекомендуется Node.js v18.17.0 или выше"
    fi
else
    echo "❌ Node.js не установлен"
    exit 1
fi

# Проверка npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm: $NPM_VERSION"
else
    echo "❌ npm не установлен"
    exit 1
fi

# Проверка PostgreSQL
if command -v psql &> /dev/null; then
    PG_VERSION=$(psql --version | awk '{print $3}')
    echo "✅ PostgreSQL: $PG_VERSION"
    
    # Проверка подключения
    if psql -h localhost -U vmc_user -d vmc_handbook -c "SELECT 1;" &> /dev/null; then
        echo "✅ Подключение к базе данных работает"
    else
        echo "⚠️  Не удается подключиться к базе данных"
    fi
else
    echo "❌ PostgreSQL не установлен"
    exit 1
fi

# Проверка Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | awk '{print $3}')
    echo "✅ Git: $GIT_VERSION"
else
    echo "❌ Git не установлен"
    exit 1
fi

# Проверка переменных окружения
if [ -f ".env" ]; then
    echo "✅ Файл .env найден"
    
    if grep -q "DATABASE_URL" .env; then
        echo "✅ DATABASE_URL настроен"
    else
        echo "⚠️  DATABASE_URL не найден в .env"
    fi
else
    echo "⚠️  Файл .env не найден"
fi

echo "🎉 Проверка окружения завершена!"
```

### Запуск проверки
```bash
# Сделать скрипт исполняемым:
chmod +x check-environment.sh

# Запустить проверку:
./check-environment.sh
```

## Полезные команды

### Управление сервисами
```bash
# PostgreSQL
sudo systemctl start postgresql    # Запуск
sudo systemctl stop postgresql     # Остановка
sudo systemctl restart postgresql  # Перезапуск
sudo systemctl status postgresql   # Статус

# Проверка портов
lsof -i :3000  # Next.js web
lsof -i :3001  # Next.js admin
lsof -i :8000  # Express API
lsof -i :5432  # PostgreSQL
```

### Очистка и переустановка
```bash
# Очистка npm кеша:
npm cache clean --force

# Удаление node_modules:
rm -rf node_modules package-lock.json

# Переустановка зависимостей:
npm install

# Очистка Next.js:
rm -rf .next

# Очистка Turbo кеша:
npx turbo clean
```

### Диагностика проблем
```bash
# Проверка версий:
node --version
npm --version
git --version
psql --version

# Проверка переменных окружения:
printenv | grep -E "(DATABASE_URL|NODE_ENV|PORT)"

# Проверка сетевых подключений:
netstat -tulpn | grep -E "(3000|3001|8000|5432)"

# Логи PostgreSQL:
sudo tail -f /var/log/postgresql/postgresql-*.log
```

## Следующие шаги

После настройки окружения:

1. **Создать структуру проекта** - папки и файлы
2. **Настроить Turborepo** - monorepo конфигурация
3. **Установить зависимости** - все необходимые пакеты
4. **Настроить Prisma** - схема базы данных
5. **Создать seed данные** - 39 товаров VMC
6. **Запустить приложения** - web, admin, api

Подробные инструкции в соответствующих документах из папки `docs/setup/`.
