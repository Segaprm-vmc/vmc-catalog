#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Подготовка к развертыванию VMC Каталога...\n');

// Проверяем наличие папки dist
const distPath = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ Папка dist не найдена. Сначала выполните: npm run build');
  process.exit(1);
}

// Создаем .htaccess для Apache
const htaccessContent = `RewriteEngine On
RewriteBase /

# Handle SPA routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>`;

fs.writeFileSync(path.join(distPath, '.htaccess'), htaccessContent);
console.log('✅ Создан .htaccess файл для Apache');

// Создаем nginx.conf для Nginx
const nginxContent = `server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # Handle SPA routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # JSON files - no cache
    location ~* \\.json$ {
        add_header Cache-Control "no-cache";
        add_header Access-Control-Allow-Origin "*";
    }

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
}`;

fs.writeFileSync(path.join(distPath, 'nginx.conf'), nginxContent);
console.log('✅ Создан nginx.conf файл для Nginx');

// Проверяем наличие необходимых файлов
const requiredFiles = [
  'index.html',
  'data/models.json',
  'data/news.json', 
  'data/regulations.json'
];

const missingFiles = [];
requiredFiles.forEach(file => {
  const filePath = path.join(distPath, file);
  if (!fs.existsSync(filePath)) {
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.warn('⚠️  Отсутствуют файлы:');
  missingFiles.forEach(file => console.warn(`   - ${file}`));
  console.warn('   Убедитесь, что все файлы скопированы в dist/\n');
}

// Проверяем размер файлов
const getDirectorySize = (dirPath) => {
  let totalSize = 0;
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    files.forEach(file => {
      const filePath = path.join(dirPath, file.name);
      if (file.isDirectory()) {
        totalSize += getDirectorySize(filePath);
      } else {
        totalSize += fs.statSync(filePath).size;
      }
    });
  }
  return totalSize;
};

const totalSize = getDirectorySize(distPath);
const sizeMB = (totalSize / 1024 / 1024).toFixed(2);

console.log(`📊 Размер проекта: ${sizeMB} MB`);

if (totalSize > 50 * 1024 * 1024) { // 50MB
  console.warn('⚠️  Проект довольно большой. Рассмотрите оптимизацию изображений.');
}

// Создаем README для деплоя
const deployReadme = `# Файлы для развертывания

## Содержимое папки dist/

Все файлы из этой папки нужно загрузить на веб-сервер.

### Конфигурация сервера:
- **Apache**: используйте .htaccess (уже включен)
- **Nginx**: используйте nginx.conf как основу

### Важные папки:
- \`data/\` - JSON файлы с данными
- \`images/\` - изображения моделей, новостей, регламентов
- \`assets/\` - CSS и JS файлы

### После загрузки:
1. Убедитесь, что все файлы загружены
2. Проверьте права доступа к файлам
3. Настройте веб-сервер согласно инструкциям
4. Протестируйте сайт

### Админ-панель:
Доступна по адресу: \`/admin\`

Дата сборки: ${new Date().toLocaleString('ru-RU')}
Размер: ${sizeMB} MB
`;

fs.writeFileSync(path.join(distPath, 'DEPLOY-README.txt'), deployReadme);
console.log('✅ Создан DEPLOY-README.txt с инструкциями');

console.log('\n🎉 Подготовка завершена!');
console.log('\n📁 Файлы готовы к загрузке на сервер:');
console.log(`   ${distPath}`);
console.log('\n📖 Подробные инструкции: DEPLOYMENT.md');
console.log('🔧 Конфигурация сервера: .htaccess или nginx.conf');
console.log('📋 Инструкции по деплою: DEPLOY-README.txt\n'); 