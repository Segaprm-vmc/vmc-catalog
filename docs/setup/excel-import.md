 # Excel Import для характеристик - VMC Учебник

## Функциональность Excel импорта

### Возможности
- **Импорт характеристик** из Excel файла (.xlsx)
- **Валидация данных** перед сохранением
- **Предварительный просмотр** импортируемых данных
- **Обработка ошибок** с детальными сообщениями
- **Шаблон Excel** для скачивания

## Структура Excel файла

### Формат файла для импорта
```
| Характеристика              | Значение                    |
|------------------------------|----------------------------|
| Завод изготовитель          | VMC                        |
| Завод производитель ДВС     | VMC                        |
| Размеры ДхШхВ (мм)          | 1923 x 745 x 1107         |
| Высота сидения (мм)         | 764                        |
| Рабочий объем ДВС (сс)      | 153                        |
| МАХ скорость (км/час)       | 95                         |
| Мощность ДВС                | 15.4 л.с / 11.4 кВт        |
| Объем бака (л)              | 8.1                        |
| ...                         | ...                        |
```

### Шаблон Excel файла
```typescript
// Генератор шаблона Excel
export const generateCharacteristicsTemplate = () => {
  const characteristics = [
    'Завод изготовитель',
    'Завод производитель ДВС',
    'Размеры ДхШхВ (мм)',
    'Высота сидения (мм)',
    'Высота по рулю (мм)',
    'Размер по осям (мм)',
    'Клиренс (мм)',
    'Масса (кг)',
    'Размеры коробки (мм)',
    'Маркировка ДВС на крышке',
    'ДВС фактически',
    'Охлаждение',
    'Рабочий объем ДВС (сс)',
    'Диаметр поршня (мм)',
    'Ход поршня (мм)',
    'Запуск',
    'Кикстартер',
    'Подача топлива',
    'Диагностический разъем',
    'Количество клапанов на цилиндр',
    'МАХ скорость (км/час)',
    'Трансмиссия',
    'Количество передач',
    'Мощность ДВС (л.с/кВт/об.мин)',
    'Объем бака (л)',
    'Расход топлива на (л/100 км)',
    'Фильтр масляный',
    'Объем масла в ДВС (л)',
    'Система охлаждения',
    'Охлаждающая жидкость',
    'Фильтр воздушный',
    'Топливо',
    'Датчики давления воздуха в шинах',
    'Колесо переднее',
    'Колесо заднее',
    'Подвеска передняя',
    'Подвеска задняя',
    'Амортизаторы передние',
    'Амортизаторы задние',
    'Передний тормозной диск',
    'Передний тормозной суппорт',
    'Задний тормозной диск',
    'Задний тормозной суппорт',
    'Датчик ABS',
    'Датчик скорости/привод спидометра',
    'Глушитель',
    'Привод: цепь/ремень',
    'Звезда ведущая',
    'Звезда ведомая',
    'АКБ',
    'Фара головного света',
    'Задний фонарь',
    'Указатели поворотов',
    'Панель приборов',
    'Блок переключателей правый',
    'Блок переключателей левый',
    'Руль',
    'Рычаги',
    'Ручки',
    'Сидение',
    'Багажник',
    'Зеркала',
    'Система доступа/сигнализация',
    'Особенности',
    'Интервал прохождения ТО',
    'Гарантия',
    'Регистрация в ГИБДД',
    'Наличие ПТС',
    'Наличие водительского удостоверения'
  ];

  return characteristics.map(name => ({ characteristic: name, value: '' }));
};
```

## Компонент импорта Excel

### React компонент для админки
```typescript
// apps/admin/src/components/ExcelImport.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as XLSX from 'xlsx';

interface CharacteristicRow {
  characteristic: string;
  value: string;
  isValid: boolean;
  error?: string;
}

interface ExcelImportProps {
  onImport: (characteristics: Array<{ name: string; value: string }>) => void;
  onCancel: () => void;
}

export function ExcelImport({ onImport, onCancel }: ExcelImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<CharacteristicRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Маппинг русских названий к внутренним именам
  const characteristicMapping = new Map([
    ['Завод изготовитель', 'manufacturer'],
    ['Завод производитель ДВС', 'engine_manufacturer'],
    ['Размеры ДхШхВ (мм)', 'dimensions_lwh'],
    ['Высота сидения (мм)', 'seat_height'],
    ['Рабочий объем ДВС (сс)', 'displacement'],
    ['МАХ скорость (км/час)', 'max_speed'],
    ['Мощность ДВС (л.с/кВт/об.мин)', 'power'],
    ['Объем бака (л)', 'fuel_tank_volume'],
    // ... все 65 характеристик
  ]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseExcelFile(selectedFile);
    }
  };

  const parseExcelFile = async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Конвертировать в JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Обработать данные
      const characteristics: CharacteristicRow[] = [];
      
      for (let i = 1; i < jsonData.length; i++) { // Пропускаем заголовок
        const row = jsonData[i] as string[];
        if (row[0] && row[1]) { // Проверяем что есть и название и значение
          const characteristic = row[0].trim();
          const value = row[1].toString().trim();
          
          // Валидация
          const isValid = characteristicMapping.has(characteristic) && value.length > 0;
          const error = !characteristicMapping.has(characteristic) 
            ? 'Неизвестная характеристика'
            : !value ? 'Пустое значение' : undefined;
          
          characteristics.push({
            characteristic,
            value,
            isValid,
            error
          });
        }
      }
      
      setData(characteristics);
    } catch (err) {
      setError('Ошибка при чтении файла. Проверьте формат Excel.');
      console.error('Excel parse error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    const validCharacteristics = data
      .filter(item => item.isValid)
      .map(item => ({
        name: characteristicMapping.get(item.characteristic)!,
        value: item.value
      }));
    
    onImport(validCharacteristics);
  };

  const downloadTemplate = () => {
    const template = generateCharacteristicsTemplate();
    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Характеристики');
    
    // Настройка ширины колонок
    worksheet['!cols'] = [
      { width: 35 }, // Характеристика
      { width: 25 }  // Значение
    ];
    
    XLSX.writeFile(workbook, 'template_characteristics.xlsx');
  };

  const validCount = data.filter(item => item.isValid).length;
  const invalidCount = data.filter(item => !item.isValid).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Импорт характеристик из Excel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="flex-1"
            />
            <Button variant="outline" onClick={downloadTemplate}>
              Скачать шаблон
            </Button>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {loading && (
            <div className="text-center py-4">
              Обработка файла...
            </div>
          )}
        </CardContent>
      </Card>

      {data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Предварительный просмотр
              <div className="text-sm font-normal">
                Валидных: {validCount} | Ошибок: {invalidCount}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Характеристика</TableHead>
                    <TableHead>Значение</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index} className={!row.isValid ? 'bg-red-50' : ''}>
                      <TableCell>{row.characteristic}</TableCell>
                      <TableCell>{row.value}</TableCell>
                      <TableCell>
                        {row.isValid ? (
                          <span className="text-green-600">✓ Валидно</span>
                        ) : (
                          <span className="text-red-600">✗ {row.error}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button 
          onClick={handleImport} 
          disabled={validCount === 0}
        >
          Импортировать ({validCount} характеристик)
        </Button>
      </div>
    </div>
  );
}
```

## API для обработки Excel

### Endpoint для импорта
```typescript
// apps/api/src/routes/admin/excel.ts
import { Router } from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';
import { prisma } from '../../lib/prisma';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('sheet') || file.originalname.endsWith('.xlsx')) {
      cb(null, true);
    } else {
      cb(new Error('Только Excel файлы (.xlsx) разрешены'));
    }
  }
});

// Импорт характеристик для товара
router.post('/products/:id/import-characteristics', upload.single('excel'), async (req, res) => {
  try {
    const { id: productId } = req.params;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }

    // Парсинг Excel файла
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const characteristics = [];
    
    // Маппинг характеристик
    const characteristicMapping = new Map([
      ['Завод изготовитель', 'manufacturer'],
      ['Рабочий объем ДВС (сс)', 'displacement'],
      // ... все характеристики
    ]);

    // Обработка данных
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i] as string[];
      if (row[0] && row[1]) {
        const displayName = row[0].trim();
        const value = row[1].toString().trim();
        const name = characteristicMapping.get(displayName);
        
        if (name && value) {
          characteristics.push({ name, value });
        }
      }
    }

    // Удаление существующих характеристик
    await prisma.productCharacteristic.deleteMany({
      where: { productId }
    });

    // Создание новых характеристик
    await prisma.productCharacteristic.createMany({
      data: characteristics.map(char => ({
        productId,
        name: char.name,
        value: char.value
      }))
    });

    res.json({
      success: true,
      imported: characteristics.length,
      message: `Импортировано ${characteristics.length} характеристик`
    });

  } catch (error) {
    console.error('Excel import error:', error);
    res.status(500).json({ 
      error: 'Ошибка при импорте файла',
      details: error.message 
    });
  }
});

// Экспорт характеристик в Excel
router.get('/products/:id/export-characteristics', async (req, res) => {
  try {
    const { id: productId } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { characteristics: true }
    });

    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    // Маппинг обратно к русским названиям
    const displayMapping = new Map([
      ['manufacturer', 'Завод изготовитель'],
      ['displacement', 'Рабочий объем ДВС (сс)'],
      // ... все характеристики
    ]);

    const excelData = product.characteristics.map(char => ({
      'Характеристика': displayMapping.get(char.name) || char.name,
      'Значение': char.value
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Характеристики');

    // Генерация файла
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${product.name}_characteristics.xlsx"`);
    res.send(buffer);

  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({ error: 'Ошибка при экспорте файла' });
  }
});

export default router;
```

## Интеграция в админку

### Добавление кнопки импорта в форму товара
```typescript
// В ProductEdit компоненте
import { ExcelImport } from '../ExcelImport';

export function ProductEdit() {
  const [showExcelImport, setShowExcelImport] = useState(false);

  const handleExcelImport = async (characteristics) => {
    try {
      // API вызов для импорта
      await importCharacteristics(productId, characteristics);
      // Обновить данные формы
      refetch();
      setShowExcelImport(false);
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  return (
    <div>
      {/* Обычная форма */}
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Характеристики
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setShowExcelImport(true)}>
                Импорт из Excel
              </Button>
              <Button variant="outline" onClick={exportToExcel}>
                Экспорт в Excel
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showExcelImport ? (
            <ExcelImport 
              onImport={handleExcelImport}
              onCancel={() => setShowExcelImport(false)}
            />
          ) : (
            // Обычный интерфейс характеристик
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

## Зависимости

### Установка необходимых пакетов
```bash
# Для админки (React)
npm install xlsx

# Для API (Node.js)
npm install xlsx multer
npm install --save-dev @types/multer

# Для обработки файлов в браузере
npm install file-saver
npm install --save-dev @types/file-saver
```

## Валидация данных

### Схема валидации
```typescript
import { z } from 'zod';

const CharacteristicSchema = z.object({
  name: z.string().min(1, 'Название характеристики обязательно'),
  value: z.string().min(1, 'Значение характеристики обязательно')
});

const ImportDataSchema = z.array(CharacteristicSchema).min(1, 'Должна быть хотя бы одна характеристика');

export function validateImportData(data: unknown) {
  return ImportDataSchema.parse(data);
}
```

Эта функциональность позволит быстро импортировать все 65 характеристик для товаров VMC из Excel файлов, что значительно ускорит наполнение каталога!
