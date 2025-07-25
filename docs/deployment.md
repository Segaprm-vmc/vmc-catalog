 # Руководство по развертыванию - VMC Учебник

## Обзор

Данное руководство описывает процесс развертывания VMC Учебника в производственной среде.

## Системные требования

### Минимальные требования
- **ОС**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **CPU**: 2 ядра
- **RAM**: 4 GB
- **Диск**: 50 GB SSD
- **Node.js**: 18.x или выше
- **PostgreSQL**: 15.x или выше

### Рекомендуемые для продакшена
- **CPU**: 4+ ядра
- **RAM**: 8+ GB
- **Диск**: 100+ GB SSD
- **Backup**: автоматический
- **Мониторинг**: настроен

## Переменные окружения

### Создание .env файлов

#### Корневой .env
```bash
# Database
DATABASE_URL="postgresql://vmc_user:strong_password@localhost:5432/vmc_production"

# Node Environment
NODE_ENV="production"
PORT=8000

# Security
JWT_SECRET="super-strong-jwt-secret-key-256-bits"
BCRYPT_ROUNDS=12

# Uploads
UPLOAD_PATH="/var/www/vmc/uploads"
MAX_FILE_SIZE=10485760  # 10MB

# CORS
ALLOWED_ORIGINS="https://vmc-handbook.company.com,https://admin.vmc-handbook.company.com"
```

#### apps/web/.env.production
```bash
# Next.js
NEXT_PUBLIC_API_URL="https://api.vmc-handbook.company.com"
NEXT_PUBLIC_SITE_URL="https://vmc-handbook.company.com"

# Analytics (опционально)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Search
NEXT_PUBLIC_ALGOLIA_APP_ID="your-algolia-app-id"
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY="your-algolia-search-key"
```

#### apps/admin/.env.production
```bash
# Next.js Admin
NEXT_PUBLIC_API_URL="https://api.vmc-handbook.company.com"
NEXT_PUBLIC_SITE_URL="https://admin.vmc-handbook.company.com"

# NextAuth
NEXTAUTH_URL="https://admin.vmc-handbook.company.com"
NEXTAUTH_SECRET="super-strong-nextauth-secret"

# API
NEXT_PUBLIC_ALGOLIA_APP_ID="your-algolia-app-id"
NEXT_PUBLIC_ALGOLIA_ADMIN_KEY="your-algolia-admin-key"
```

## Установка зависимостей

### Установка Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверка версии
node --version  # должно быть v18+
npm --version
```

### Установка PostgreSQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Запуск сервиса
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Создание пользователя и базы
sudo -u postgres psql
```

SQL команды:
```sql
-- Создание пользователя
CREATE USER vmc_user WITH PASSWORD 'strong_password';

-- Создание базы данных
CREATE DATABASE vmc_production OWNER vmc_user;

-- Права доступа
GRANT ALL PRIVILEGES ON DATABASE vmc_production TO vmc_user;

-- Выход
\q
```

### Установка PM2 (Process Manager)
```bash
sudo npm install -g pm2

# Автозапуск при загрузке системы
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

## Развертывание приложения

### 1. Клонирование репозитория
```bash
# Создание директории для приложения
sudo mkdir -p /var/www/vmc
sudo chown $USER:$USER /var/www/vmc

# Клонирование
cd /var/www/vmc
git clone <repository-url> .

# Установка зависимостей
npm install
```

### 2. Настройка базы данных
```bash
# Копирование конфигурации
cp .env.example .env
# Отредактируйте .env с производственными данными

# Генерация Prisma клиента
npx prisma generate

# Запуск миграций
npx prisma migrate deploy

# Создание админ пользователя
npm run seed:admin
```

### 3. Сборка приложений
```bash
# Сборка всех приложений
npm run build

# Проверка сборки
ls -la apps/web/.next/
ls -la apps/admin/.next/
ls -la apps/api/dist/
```

### 4. Настройка PM2

#### ecosystem.config.js
```javascript
module.exports = {
  apps: [
    {
      name: 'vmc-api',
      script: './apps/api/dist/index.js',
      cwd: '/var/www/vmc',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 8000
      },
      error_file: '/var/log/vmc/api-error.log',
      out_file: '/var/log/vmc/api-out.log',
      log_file: '/var/log/vmc/api.log'
    },
    {
      name: 'vmc-web',
      script: 'npm',
      args: 'run start:web',
      cwd: '/var/www/vmc',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/vmc/web-error.log',
      out_file: '/var/log/vmc/web-out.log'
    },
    {
      name: 'vmc-admin',
      script: 'npm', 
      args: 'run start:admin',
      cwd: '/var/www/vmc',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/var/log/vmc/admin-error.log',
      out_file: '/var/log/vmc/admin-out.log'
    }
  ]
};
```

### 5. Создание логов директории
```bash
sudo mkdir -p /var/log/vmc
sudo chown $USER:$USER /var/log/vmc
```

### 6. Запуск приложений
```bash
# Запуск через PM2
pm2 start ecosystem.config.js

# Проверка статуса
pm2 status

# Просмотр логов
pm2 logs

# Сохранение конфигурации PM2
pm2 save
```

## Настройка Nginx

### Установка Nginx
```bash
sudo apt update
sudo apt install nginx

# Запуск и автозапуск
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Конфигурация Nginx

#### /etc/nginx/sites-available/vmc-handbook
```nginx
# Upstream серверы
upstream vmc_api {
    server 127.0.0.1:8000;
}

upstream vmc_web {
    server 127.0.0.1:3000;
}

upstream vmc_admin {
    server 127.0.0.1:3001;
}

# Основной сайт (публичная часть)
server {
    listen 80;
    server_name vmc-handbook.company.com;
    
    # Редирект на HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name vmc-handbook.company.com;
    
    # SSL сертификаты (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/vmc-handbook.company.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vmc-handbook.company.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    
    # Безопасность
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Размер загружаемых файлов
    client_max_body_size 10M;
    
    # Проксирование к Next.js приложению
    location / {
        proxy_pass http://vmc_web;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Статические файлы (изображения товаров)
    location /images/ {
        alias /var/www/vmc/public/images/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Next.js статические файлы
    location /_next/static/ {
        proxy_pass http://vmc_web;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
}

# Админка
server {
    listen 80;
    server_name admin.vmc-handbook.company.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.vmc-handbook.company.com;
    
    # SSL сертификаты
    ssl_certificate /etc/letsencrypt/live/admin.vmc-handbook.company.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.vmc-handbook.company.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # Дополнительная безопасность для админки
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    location / {
        proxy_pass http://vmc_admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# API сервер
server {
    listen 80;
    server_name api.vmc-handbook.company.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.vmc-handbook.company.com;
    
    # SSL сертификаты
    ssl_certificate /etc/letsencrypt/live/api.vmc-handbook.company.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.vmc-handbook.company.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
    limit_req_zone $binary_remote_addr zone=search:10m rate=50r/m;
    limit_req_zone $binary_remote_addr zone=upload:10m rate=10r/m;
    
    location / {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://vmc_api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS заголовки
        add_header Access-Control-Allow-Origin "https://vmc-handbook.company.com, https://admin.vmc-handbook.company.com" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
    
    # Поиск API (меньший лимит)
    location /api/search {
        limit_req zone=search burst=10 nodelay;
        proxy_pass http://vmc_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Загрузка файлов (самый строгий лимит)
    location /api/admin/upload {
        limit_req zone=upload burst=5 nodelay;
        client_max_body_size 50M;
        
        proxy_pass http://vmc_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_request_buffering off;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```

### Активация конфигурации
```bash
# Симлинк конфигурации
sudo ln -s /etc/nginx/sites-available/vmc-handbook /etc/nginx/sites-enabled/

# Удаление дефолтной конфигурации
sudo rm /etc/nginx/sites-enabled/default

# Проверка конфигурации
sudo nginx -t

# Перезапуск Nginx
sudo systemctl restart nginx
```

## SSL сертификаты (Let's Encrypt)

### Установка Certbot
```bash
sudo apt install certbot python3-certbot-nginx
```

### Получение сертификатов
```bash
# Для основного домена
sudo certbot --nginx -d vmc-handbook.company.com

# Для админки
sudo certbot --nginx -d admin.vmc-handbook.company.com

# Для API
sudo certbot --nginx -d api.vmc-handbook.company.com
```

### Автообновление сертификатов
```bash
# Проверка автообновления
sudo certbot renew --dry-run

# Добавление в cron
sudo crontab -e

# Добавить строку:
0 12 * * * /usr/bin/certbot renew --quiet && systemctl reload nginx
```

## Настройка Algolia

### Создание индексов
```bash
# Войти в админку и выполнить:
curl -X POST "https://admin.vmc-handbook.company.com/api/admin/search/reindex" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Конфигурация поиска
```javascript
// Индекс: vmc_products
{
  "searchableAttributes": [
    "name",
    "description", 
    "category.name",
    "characteristics.manufacturer",
    "characteristics.engine_actual"
  ],
  "attributesForFaceting": [
    "category.slug",
    "characteristics.manufacturer"
  ],
  "ranking": [
    "typo",
    "geo", 
    "words",
    "filters",
    "proximity",
    "attribute",
    "exact",
    "custom"
  ]
}
```

## Резервное копирование

### Скрипт backup.sh
```bash
#!/bin/bash

BACKUP_DIR="/var/backups/vmc"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="vmc_production"
DB_USER="vmc_user"

# Создание директории для бэкапов
mkdir -p $BACKUP_DIR

# Бэкап базы данных
pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Бэкап изображений
tar -czf $BACKUP_DIR/images_backup_$DATE.tar.gz /var/www/vmc/public/images/

# Бэкап конфигурации
tar -czf $BACKUP_DIR/config_backup_$DATE.tar.gz \
  /var/www/vmc/.env \
  /var/www/vmc/ecosystem.config.js \
  /etc/nginx/sites-available/vmc-handbook

# Удаление старых бэкапов (старше 30 дней)
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

### Автоматизация бэкапов
```bash
# Сделать скрипт исполняемым
chmod +x /var/www/vmc/scripts/backup.sh

# Добавить в cron
crontab -e

# Ежедневный бэкап в 2:00
0 2 * * * /var/www/vmc/scripts/backup.sh >> /var/log/vmc/backup.log 2>&1
```

## Мониторинг

### PM2 Monitoring
```bash
# Установка PM2 Plus (опционально)
pm2 install pm2-server-monit

# Мониторинг ресурсов
pm2 monit

# Логи в реальном времени
pm2 logs --lines 100
```

### Система логирования

#### Logrotate конфигурация
```bash
# /etc/logrotate.d/vmc
/var/log/vmc/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 $USER $USER
    postrotate
        pm2 reload all
    endscript
}
```

### Мониторинг базы данных
```sql
-- Проверка соединений
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

-- Размер базы данных  
SELECT pg_size_pretty(pg_database_size('vmc_production'));

-- Медленные запросы
SELECT query, mean_time, calls 
FROM pg_stat_statements 
WHERE mean_time > 1000 
ORDER BY mean_time DESC;
```

## Обновление приложения

### Скрипт deploy.sh
```bash
#!/bin/bash

APP_DIR="/var/www/vmc"
BACKUP_DIR="/var/backups/vmc/deploys"
DATE=$(date +%Y%m%d_%H%M%S)

cd $APP_DIR

echo "Starting deployment: $DATE"

# 1. Создание бэкапа текущей версии
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz --exclude=node_modules --exclude=.git .

# 2. Остановка приложений
pm2 stop all

# 3. Обновление кода
git fetch origin
git reset --hard origin/main

# 4. Установка зависимостей
npm ci --production

# 5. Миграции базы данных
npx prisma migrate deploy

# 6. Сборка приложений
npm run build

# 7. Запуск приложений
pm2 reload all

# 8. Проверка здоровья
sleep 10
curl -f http://localhost:8000/api/health || exit 1
curl -f http://localhost:3000 || exit 1
curl -f http://localhost:3001 || exit 1

echo "Deployment completed successfully: $DATE"
```

### Автоматическое развертывание (CI/CD)

#### GitHub Actions пример
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.7
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/vmc
          ./scripts/deploy.sh
```

## Мониторинг и алерты

### Health Check endpoints
```bash
# Проверка API
curl -f https://api.vmc-handbook.company.com/api/health

# Проверка веб-приложения
curl -f https://vmc-handbook.company.com

# Проверка админки
curl -f https://admin.vmc-handbook.company.com
```

### Uptime мониторинг
Рекомендуется настроить внешний мониторинг:
- UptimeRobot
- Pingdom
- StatusCake

### Алерты
```bash
# Простой скрипт для проверки сервисов
#!/bin/bash
# /var/www/vmc/scripts/health-check.sh

SERVICES=("vmc-api" "vmc-web" "vmc-admin")
EMAIL="admin@company.com"

for service in "${SERVICES[@]}"; do
    if ! pm2 describe $service | grep -q "online"; then
        echo "Service $service is down!" | mail -s "VMC Alert: Service Down" $EMAIL
        pm2 restart $service
    fi
done
```

## Безопасность

### Firewall (ufw)
```bash
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Открыть необходимые порты
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

# Закрыть прямой доступ к приложениям
sudo ufw deny 3000
sudo ufw deny 3001
sudo ufw deny 8000
```

### Обновления системы
```bash
# Автообновления безопасности
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### Пользователи и права
```bash
# Создание отдельного пользователя для приложения
sudo adduser vmc --disabled-password
sudo usermod -aG sudo vmc

# Передача владения файлами
sudo chown -R vmc:vmc /var/www/vmc
sudo chmod -R 755 /var/www/vmc
```

## Производительность

### Оптимизация PostgreSQL
```sql
-- /etc/postgresql/15/main/postgresql.conf
shared_buffers = 256MB                  # 25% от RAM
effective_cache_size = 1GB              # 75% от RAM  
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1                  # Для SSD
```

### Оптимизация Node.js
```bash
# Увеличение лимитов файлов
echo "* soft nofile 65536" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65536" | sudo tee -a /etc/security/limits.conf
```

## Troubleshooting

### Частые проблемы

#### Приложение не запускается
```bash
# Проверка логов
pm2 logs --lines 50

# Проверка портов
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :8000

# Перезапуск
pm2 restart all
```

#### База данных недоступна
```bash
# Статус PostgreSQL
sudo systemctl status postgresql

# Логи PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-15-main.log

# Перезапуск
sudo systemctl restart postgresql
```

#### Nginx ошибки
```bash
# Проверка конфигурации
sudo nginx -t

# Логи ошибок
sudo tail -f /var/log/nginx/error.log

# Перезапуск
sudo systemctl restart nginx
```

### Полезные команды
```bash
# Статус всех сервисов
sudo systemctl status nginx postgresql

# Процессы Node.js
ps aux | grep node

# Использование диска
df -h
du -sh /var/www/vmc/

# Использование памяти
free -h
htop
```

## Production настройки

### Environment Variables для edu.vmcmoto.ru
```bash
# Production .env
NODE_ENV="production"

# Database (Netangels PostgreSQL)
DATABASE_URL="postgresql://username:password@hostname:5432/database_name"

# Domains
NEXT_PUBLIC_SITE_URL="https://edu.vmcmoto.ru"
NEXT_PUBLIC_API_URL="https://edu.vmcmoto.ru/api"
NEXTAUTH_URL="https://edu.vmcmoto.ru"

# Admin
ADMIN_EMAIL="marketing@benzo.ru"
ADMIN_DEFAULT_PASSWORD="secure-password-change-me"

# Security
JWT_SECRET="production-jwt-secret-256-chars"
NEXTAUTH_SECRET="production-nextauth-secret"

# File uploads
UPLOAD_PATH="/var/www/edu.vmcmoto.ru/public/uploads"
MAX_FILE_SIZE=5242880  # 5MB

# Netangels specific
HOSTING_PROVIDER="netangels"
```

### Nginx конфигурация для Netangels
```nginx
# /etc/nginx/sites-available/edu.vmcmoto.ru
server {
    listen 80;
    server_name edu.vmcmoto.ru www.edu.vmcmoto.ru;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name edu.vmcmoto.ru www.edu.vmcmoto.ru;
    
    # SSL сертификаты (Let's Encrypt через Netangels)
    ssl_certificate /etc/letsencrypt/live/edu.vmcmoto.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/edu.vmcmoto.ru/privkey.pem;
    
    # Основное приложение
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # API
    location /api/ {
        proxy_pass http://localhost:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Статические файлы
    location /uploads/ {
        alias /var/www/edu.vmcmoto.ru/public/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Next.js статика
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```
