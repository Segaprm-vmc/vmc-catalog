# Image Upload - Загрузка фото товаров VMC

## Функциональность загрузки изображений

### Способы загрузки
- **С устройства** - выбор файлов через file input
- **По ссылке URL** - вставка ссылки на изображение
- **Drag & Drop** - перетаскивание файлов
- **Множественная загрузка** - до 10 фото на товар

### Поддерживаемые форматы
- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **WebP** (.webp)
- **Maximum size**: 5MB на файл

## Компонент загрузки изображений

### Универсальный ImageUpload компонент
```typescript
// apps/admin/src/components/ImageUpload.tsx
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Upload, Link, Image as ImageIcon } from 'lucide-react';

interface ImageFile {
  id: string;
  url: string;
  file?: File;
  isUploaded: boolean;
  isMain?: boolean;
}

interface ImageUploadProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  maxImages?: number;
  maxSizeM?: number;
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 10,
  maxSizeMB = 5 
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Обработка файлов с устройства
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const newImages: ImageFile[] = [];
    const errors: string[] = [];
    
    Array.from(files).forEach((file) => {
      // Валидация типа файла
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} не является изображением`);
        return;
      }
      
      // Валидация размера
      if (file.size > maxSizeMB * 1024 * 1024) {
        errors.push(`${file.name} превышает ${maxSizeMB}MB`);
        return;
      }
      
      // Проверка лимита
      if (images.length + newImages.length >= maxImages) {
        errors.push(`Максимум ${maxImages} изображений`);
        return;
      }
      
      const imageFile: ImageFile = {
        id: `file-${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file),
        file,
        isUploaded: false
      };
      
      newImages.push(imageFile);
    });
    
    if (errors.length > 0) {
      setError(errors.join(', '));
    } else {
      setError(null);
    }
    
    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }
  }, [images, maxImages, maxSizeMB, onImagesChange]);

  // Drag & Drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  // Загрузка по URL
  const handleUrlAdd = async () => {
    if (!urlInput.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Валидация URL
      const url = new URL(urlInput.trim());
      if (!url.protocol.startsWith('http')) {
        throw new Error('URL должен начинаться с http:// или https://');
      }
      
      // Проверка что это изображение
      const response = await fetch(url.toString(), { method: 'HEAD' });
      const contentType = response.headers.get('content-type');
      
      if (!contentType?.startsWith('image/')) {
        throw new Error('URL не содержит изображение');
      }
      
      // Проверка размера
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > maxSizeMB * 1024 * 1024) {
        throw new Error(`Изображение превышает ${maxSizeMB}MB`);
      }
      
      const imageFile: ImageFile = {
        id: `url-${Date.now()}`,
        url: url.toString(),
        isUploaded: true
      };
      
      onImagesChange([...images, imageFile]);
      setUrlInput('');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки изображения по URL');
    } finally {
      setLoading(false);
    }
  };

  // Удаление изображения
  const removeImage = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    onImagesChange(updatedImages);
  };

  // Установка главного изображения
  const setMainImage = (id: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      isMain: img.id === id
    }));
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Загрузка изображений ({images.length}/{maxImages})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="device" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="device">С устройства</TabsTrigger>
              <TabsTrigger value="url">По ссылке</TabsTrigger>
            </TabsList>
            
            {/* Загрузка с устройства */}
            <TabsContent value="device" className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? 'border-vmc-red bg-red-50' : 'border-gray-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Перетащите изображения сюда
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  или нажмите кнопку для выбора файлов
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button type="button" variant="outline" className="cursor-pointer">
                    Выбрать файлы
                  </Button>
                </label>
                <p className="text-xs text-gray-400 mt-2">
                  JPG, PNG, WebP до {maxSizeMB}MB
                </p>
              </div>
            </TabsContent>
            
            {/* Загрузка по URL */}
            <TabsContent value="url" className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleUrlAdd()}
                  />
                </div>
                <Button 
                  onClick={handleUrlAdd} 
                  disabled={!urlInput.trim() || loading}
                  className="shrink-0"
                >
                  <Link className="w-4 h-4 mr-2" />
                  {loading ? 'Проверка...' : 'Добавить'}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Введите прямую ссылку на изображение
              </p>
            </TabsContent>
          </Tabs>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Превью загруженных изображений */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Загруженные изображения</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image.url}
                      alt={`Изображение ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Overlay с кнопками */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant={image.isMain ? "default" : "secondary"}
                      onClick={() => setMainImage(image.id)}
                    >
                      {image.isMain ? 'Главное' : 'Сделать главным'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeImage(image.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Бейджи */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {image.isMain && (
                      <Badge variant="default" className="text-xs">
                        Главное
                      </Badge>
                    )}
                    {!image.isUploaded && (
                      <Badge variant="secondary" className="text-xs">
                        Новое
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

## API для загрузки файлов

### Express endpoint для загрузки
```typescript
// apps/api/src/routes/upload.ts
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Настройка multer для загрузки файлов
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10 // максимум 10 файлов
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Разрешены только изображения (JPEG, PNG, WebP)'));
    }
  }
});

// Функция для обработки изображения
async function processImage(buffer: Buffer, filename: string) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
  
  // Создание директории если не существует
  await fs.mkdir(uploadDir, { recursive: true });
  
  const uniqueFilename = `${uuidv4()}-${filename}`;
  const filepath = path.join(uploadDir, uniqueFilename);
  
  // Оптимизация изображения с помощью Sharp
  await sharp(buffer)
    .resize(800, 600, { 
      fit: 'inside', 
      withoutEnlargement: true 
    })
    .jpeg({ quality: 85 })
    .toFile(filepath);
  
  // Создание превью (300x225)
  const thumbnailFilename = `thumb-${uniqueFilename}`;
  const thumbnailPath = path.join(uploadDir, thumbnailFilename);
  
  await sharp(buffer)
    .resize(300, 225, { 
      fit: 'cover' 
    })
    .jpeg({ quality: 80 })
    .toFile(thumbnailPath);
  
  return {
    url: `/uploads/products/${uniqueFilename}`,
    thumbnail: `/uploads/products/${thumbnailFilename}`,
    filename: uniqueFilename
  };
}

// Загрузка файлов
router.post('/images', upload.array('images', 10), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ 
        error: 'Файлы не загружены' 
      });
    }
    
    const processedImages = [];
    
    for (const file of files) {
      try {
        const result = await processImage(file.buffer, file.originalname);
        processedImages.push({
          id: uuidv4(),
          ...result,
          originalName: file.originalname,
          size: file.size
        });
      } catch (error) {
        console.error(`Ошибка обработки ${file.originalname}:`, error);
      }
    }
    
    res.json({
      success: true,
      images: processedImages,
      uploaded: processedImages.length,
      message: `Загружено ${processedImages.length} из ${files.length} изображений`
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Ошибка загрузки файлов',
      details: error.message 
    });
  }
});

// Загрузка по URL
router.post('/images/from-url', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL не указан' });
    }
    
    // Валидация URL
    let imageUrl;
    try {
      imageUrl = new URL(url);
    } catch {
      return res.status(400).json({ error: 'Некорректный URL' });
    }
    
    if (!imageUrl.protocol.startsWith('http')) {
      return res.status(400).json({ error: 'URL должен использовать HTTP/HTTPS' });
    }
    
    // Загрузка изображения
    const response = await fetch(imageUrl.toString());
    
    if (!response.ok) {
      return res.status(400).json({ error: 'Не удалось загрузить изображение' });
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      return res.status(400).json({ error: 'URL не содержит изображение' });
    }
    
    const buffer = Buffer.from(await response.arrayBuffer());
    
    // Проверка размера
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'Изображение слишком большое (макс 5MB)' });
    }
    
    // Обработка изображения
    const filename = path.basename(imageUrl.pathname) || 'image.jpg';
    const result = await processImage(buffer, filename);
    
    res.json({
      success: true,
      image: {
        id: uuidv4(),
        ...result,
        originalUrl: url,
        size: buffer.length
      }
    });
    
  } catch (error) {
    console.error('URL upload error:', error);
    res.status(500).json({ 
      error: 'Ошибка загрузки изображения по URL',
      details: error.message 
    });
  }
});

// Удаление изображения
router.delete('/images/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    const filepath = path.join(uploadDir, filename);
    const thumbnailPath = path.join(uploadDir, `thumb-${filename}`);
    
    // Удаление основного файла
    try {
      await fs.unlink(filepath);
    } catch (error) {
      console.warn(`Файл ${filename} не найден:`, error);
    }
    
    // Удаление превью
    try {
      await fs.unlink(thumbnailPath);
    } catch (error) {
      console.warn(`Превью ${filename} не найдено:`, error);
    }
    
    res.json({
      success: true,
      message: 'Изображение удалено'
    });
    
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      error: 'Ошибка удаления изображения' 
    });
  }
});

export default router;
```

## Интеграция в форму товара

### Использование в ProductForm
```typescript
// В компоненте ProductForm
import { ImageUpload } from './ImageUpload';

export function ProductForm() {
  const [images, setImages] = useState<ImageFile[]>([]);
  
  const handleImagesChange = (newImages: ImageFile[]) => {
    setImages(newImages);
    
    // Обновление в форме
    const imageUrls = newImages.map(img => img.url);
    form.setValue('images', imageUrls);
    
    // Установка главного изображения
    const mainImage = newImages.find(img => img.isMain);
    if (mainImage) {
      form.setValue('mainImage', mainImage.url);
    }
  };

  const uploadPendingImages = async () => {
    const pendingImages = images.filter(img => !img.isUploaded && img.file);
    
    if (pendingImages.length === 0) return;
    
    const formData = new FormData();
    pendingImages.forEach((img) => {
      if (img.file) {
        formData.append('images', img.file);
      }
    });
    
    try {
      const response = await fetch('/api/upload/images', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Обновление URL загруженных изображений
        const updatedImages = images.map(img => {
          if (!img.isUploaded && img.file) {
            const uploaded = result.images.find(u => 
              u.originalName === img.file?.name
            );
            if (uploaded) {
              return {
                ...img,
                url: uploaded.url,
                isUploaded: true
              };
            }
          }
          return img;
        });
        
        setImages(updatedImages);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  };

  const handleSubmit = async (data) => {
    // Загрузка изображений перед сохранением товара
    await uploadPendingImages();
    
    // Сохранение товара
    await saveProduct(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Другие поля формы */}
      
      <ImageUpload
        images={images}
        onImagesChange={handleImagesChange}
        maxImages={10}
        maxSizeMB={5}
      />
      
      {/* Кнопки сохранения */}
    </form>
  );
}
```

## Зависимости

### Установка пакетов
```bash
# Для обработки изображений (API)
npm install sharp multer uuid
npm install --save-dev @types/multer @types/uuid

# Для UI компонентов (Admin)
npm install lucide-react

# Для Drag & Drop (опционально)
npm install react-dropzone
```

## Настройка Next.js для изображений

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'edu.vmcmoto.ru',
      // Добавить домены для внешних изображений
      'example.com',
      'images.unsplash.com'
    ],
    formats: ['image/webp', 'image/avif'],
  }
};

module.exports = nextConfig;
```

Эта система загрузки изображений обеспечивает гибкость загрузки фото как с устройства, так и по URL, с автоматической оптимизацией и созданием превью для быстрой загрузки каталога VMC.
