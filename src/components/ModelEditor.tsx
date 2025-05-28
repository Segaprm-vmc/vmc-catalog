import { useState } from 'react';
import { X, Plus, Upload, Trash2, FileSpreadsheet, Download, Edit3, Check, RotateCcw, Eye, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import type { MotorcycleModel } from '@/types';

interface ModelEditorProps {
  model?: MotorcycleModel;
  onSave: (model: Partial<MotorcycleModel>) => void;
  onCancel: () => void;
}

/**
 * Компонент для редактирования и создания моделей мотоциклов
 */
export function ModelEditor({ model, onSave, onCancel }: ModelEditorProps) {
  const [formData, setFormData] = useState({
    name: model?.name || '',
    description: model?.description || '',
    images: model?.images || [],
    specifications: model?.specifications || {},
    yandexDiskLink: model?.yandexDiskLink || '',
    videoFrame: model?.videoFrame || '',
    order: model?.order || undefined
  });

  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loadingSpecs, setLoadingSpecs] = useState(false);
  const [editingSpec, setEditingSpec] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState('');
  const [editingValue, setEditingValue] = useState('');
  const [isDescriptionPreview, setIsDescriptionPreview] = useState(false);

  const handleInputChange = (field: string, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey.trim()]: newSpecValue.trim()
        }
      }));
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const handleRemoveSpecification = (key: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: Object.fromEntries(
        Object.entries(prev.specifications).filter(([k]) => k !== key)
      )
    }));
  };

  // Функции для редактирования характеристик
  const startEditingSpec = (key: string, value: string) => {
    setEditingSpec(key);
    setEditingKey(key);
    setEditingValue(value);
  };

  const saveEditingSpec = () => {
    if (editingKey.trim() && editingValue.trim() && editingSpec) {
      const trimmedKey = editingKey.trim();
      
      // Проверяем, не создается ли дубликат названия (если название изменилось)
      if (trimmedKey !== editingSpec && formData.specifications.hasOwnProperty(trimmedKey)) {
        alert(`Характеристика с названием "${trimmedKey}" уже существует`);
        return;
      }
      
      const newSpecs: Record<string, string> = {};
      
      // Пересоздаем объект, сохраняя порядок и заменяя редактируемую характеристику
      Object.entries(formData.specifications).forEach(([key, value]) => {
        if (key === editingSpec) {
          // Заменяем редактируемую характеристику на новую
          newSpecs[trimmedKey] = editingValue.trim();
        } else {
          // Оставляем остальные характеристики без изменений
          newSpecs[key] = value;
        }
      });
      
      setFormData(prev => ({
        ...prev,
        specifications: newSpecs
      }));
      
      cancelEditingSpec();
    }
  };

  const cancelEditingSpec = () => {
    setEditingSpec(null);
    setEditingKey('');
    setEditingValue('');
  };

  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Вычисляем новые размеры с сохранением пропорций
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Рисуем изображение на canvas
        ctx?.drawImage(img, 0, 0, width, height);

        // Конвертируем в base64 с сжатием
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => reject(new Error('Ошибка загрузки изображения'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setUploading(true);
      let processedCount = 0;
      const totalFiles = files.length;

      // Конвертируем файлы в сжатый base64
      Array.from(files).forEach(async (file) => {
        try {
          // Проверяем тип файла
          if (!file.type.startsWith('image/')) {
            alert(`Файл ${file.name} не является изображением`);
            processedCount++;
            if (processedCount === totalFiles) {
              setUploading(false);
            }
            return;
          }

          // Проверяем размер файла (максимум 10MB)
          if (file.size > 10 * 1024 * 1024) {
            alert(`Файл ${file.name} слишком большой. Максимальный размер: 10MB`);
            processedCount++;
            if (processedCount === totalFiles) {
              setUploading(false);
            }
            return;
          }

          // Сжимаем изображение
          const compressedImage = await compressImage(file);
          console.log(`Изображение ${file.name} сжато с ${(file.size / 1024).toFixed(2)}KB до ${(compressedImage.length / 1024).toFixed(2)}KB`);

          setFormData(prev => ({
            ...prev,
            images: [...prev.images, compressedImage]
          }));

          processedCount++;
          if (processedCount === totalFiles) {
            setUploading(false);
          }
        } catch (error) {
          console.error(`Ошибка обработки файла ${file.name}:`, error);
          alert(`Ошибка при обработке файла ${file.name}`);
          processedCount++;
          if (processedCount === totalFiles) {
            setUploading(false);
          }
        }
      });
      
      // Очищаем input для возможности загрузки тех же файлов повторно
      event.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Простой парсер CSV/TSV данных из Excel (после копирования)
  const parseExcelData = (text: string): Record<string, string> => {
    const lines = text.trim().split('\n');
    const specs: Record<string, string> = {};
    
    lines.forEach(line => {
      // Поддерживаем разделители: табуляция, точка с запятой, запятая
      const parts = line.split(/[\t;,]/).map(part => part.trim().replace(/['"]/g, ''));
      
      if (parts.length >= 2 && parts[0] && parts[1]) {
        specs[parts[0]] = parts[1];
      }
    });
    
    return specs;
  };

  // Чтение Excel файла с полной поддержкой .xlsx, .xls и CSV
  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoadingSpecs(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        let specs: Record<string, string> = {};

        // Проверяем тип файла и парсим соответственно
        if (file.name.toLowerCase().endsWith('.csv')) {
          // CSV файл - парсим как текст
          const text = data as string;
          specs = parseExcelData(text);
        } else if (file.name.toLowerCase().match(/\.(xlsx|xls)$/)) {
          // Excel файл - используем библиотеку xlsx
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Конвертируем в JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
          
          // Парсим данные (ожидаем 2 колонки)
          jsonData.forEach((row, index) => {
            // Пропускаем заголовок и пустые строки
            if (index === 0 || !row || row.length < 2) return;
            
            const key = String(row[0]).trim();
            const value = String(row[1]).trim();
            
            if (key && value) {
              specs[key] = value;
            }
          });
        } else {
          alert('Поддерживаемые форматы: .xlsx, .xls, .csv');
          return;
        }

        if (Object.keys(specs).length > 0) {
          setFormData(prev => ({
            ...prev,
            specifications: { ...prev.specifications, ...specs }
          }));
          alert(`Загружено ${Object.keys(specs).length} характеристик из файла ${file.name}`);
        } else {
          alert('Не удалось найти характеристики в файле. Убедитесь, что в файле есть 2 колонки: Название и Значение.');
        }
      } catch (error) {
        console.error('Ошибка чтения файла:', error);
        alert('Ошибка при чтении файла. Проверьте формат данных.');
      } finally {
        setLoadingSpecs(false);
        event.target.value = '';
      }
    };

    reader.onerror = () => {
      alert('Ошибка при чтении файла');
      setLoadingSpecs(false);
    };

    // Читаем в зависимости от типа файла
    if (file.name.toLowerCase().endsWith('.csv')) {
      reader.readAsText(file, 'UTF-8');
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  // Ручной ввод данных из Excel (копирование)
  const handlePasteExcelData = () => {
    const textData = prompt(
      'Скопируйте данные из Excel (2 колонки: Название характеристики | Значение) и вставьте сюда:\n\nПример:\nДвигатель\t250cc\nМощность\t25 л.с.\nВес\t140 кг'
    );
    
    if (textData) {
      setLoadingSpecs(true);
      try {
        const specs = parseExcelData(textData);
        if (Object.keys(specs).length > 0) {
          setFormData(prev => ({
            ...prev,
            specifications: { ...prev.specifications, ...specs }
          }));
          alert(`Добавлено ${Object.keys(specs).length} характеристик`);
        } else {
          alert('Не удалось распознать характеристики. Проверьте формат данных.');
        }
      } catch (error) {
        alert('Ошибка обработки данных');
      } finally {
        setLoadingSpecs(false);
      }
    }
  };

  // Экспорт характеристик в CSV
  const exportSpecsToCSV = () => {
    const specs = formData.specifications;
    if (Object.keys(specs).length === 0) {
      alert('Нет характеристик для экспорта');
      return;
    }

    const csvContent = Object.entries(specs)
      .map(([key, value]) => `"${key}","${value}"`)
      .join('\n');
    
    const header = '"Название характеристики","Значение"\n';
    const fullContent = header + csvContent;

    const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${formData.name || 'модель'}_характеристики.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Пожалуйста, заполните название');
      return;
    }

    const modelData: Partial<MotorcycleModel> = {
      ...formData,
      id: model?.id,
      createdAt: model?.createdAt
    };

    onSave(modelData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {model ? 'Редактировать модель' : 'Добавить новую модель'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 rounded-md hover:bg-slate-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Название модели *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Например: VMC 250R"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Порядок сортировки
              </label>
              <input
                type="number"
                value={formData.order || ''}
                onChange={(e) => handleInputChange('order', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Автоматически"
                min="1"
              />
              <p className="text-xs text-slate-500 mt-1">
                Чем меньше число, тем выше в списке. Если не указано - порядок по дате создания.
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Описание
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDescriptionPreview(false)}
                  className={`inline-flex items-center px-2 py-1 text-xs rounded-md transition-colors ${
                    !isDescriptionPreview 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  <FileText className="mr-1 h-3 w-3" />
                  Редактор
                </button>
                <button
                  type="button"
                  onClick={() => setIsDescriptionPreview(true)}
                  className={`inline-flex items-center px-2 py-1 text-xs rounded-md transition-colors ${
                    isDescriptionPreview 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  <Eye className="mr-1 h-3 w-3" />
                  Предпросмотр
                </button>
              </div>
            </div>
            
            {!isDescriptionPreview ? (
              <div className="space-y-2">
                {/* Панель инструментов markdown */}
                <div className="flex items-center gap-1 p-2 bg-slate-100 border border-slate-300 rounded-t-md">
                  <button
                    type="button"
                    onClick={() => {
                      const textarea = document.querySelector('textarea[placeholder*="Markdown"]') as HTMLTextAreaElement;
                      if (textarea) {
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const selectedText = textarea.value.substring(start, end);
                        const newText = `**${selectedText || 'жирный текст'}**`;
                        const newValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
                        handleInputChange('description', newValue);
                        setTimeout(() => {
                          textarea.focus();
                          textarea.selectionStart = start + 2;
                          textarea.selectionEnd = start + 2 + (selectedText || 'жирный текст').length;
                        }, 0);
                      }
                    }}
                    className="px-2 py-1 text-xs font-bold bg-white border border-slate-300 rounded hover:bg-slate-50"
                    title="Жирный текст"
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const textarea = document.querySelector('textarea[placeholder*="Markdown"]') as HTMLTextAreaElement;
                      if (textarea) {
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const selectedText = textarea.value.substring(start, end);
                        const newText = `*${selectedText || 'курсив'}*`;
                        const newValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
                        handleInputChange('description', newValue);
                        setTimeout(() => {
                          textarea.focus();
                          textarea.selectionStart = start + 1;
                          textarea.selectionEnd = start + 1 + (selectedText || 'курсив').length;
                        }, 0);
                      }
                    }}
                    className="px-2 py-1 text-xs italic bg-white border border-slate-300 rounded hover:bg-slate-50"
                    title="Курсив"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const textarea = document.querySelector('textarea[placeholder*="Markdown"]') as HTMLTextAreaElement;
                      if (textarea) {
                        const start = textarea.selectionStart;
                        const newText = '\n## Заголовок\n';
                        const newValue = textarea.value.substring(0, start) + newText + textarea.value.substring(start);
                        handleInputChange('description', newValue);
                        setTimeout(() => {
                          textarea.focus();
                          textarea.selectionStart = start + 3;
                          textarea.selectionEnd = start + 3 + 'Заголовок'.length;
                        }, 0);
                      }
                    }}
                    className="px-2 py-1 text-xs bg-white border border-slate-300 rounded hover:bg-slate-50"
                    title="Заголовок"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const textarea = document.querySelector('textarea[placeholder*="Markdown"]') as HTMLTextAreaElement;
                      if (textarea) {
                        const start = textarea.selectionStart;
                        const newText = '\n- Пункт списка\n';
                        const newValue = textarea.value.substring(0, start) + newText + textarea.value.substring(start);
                        handleInputChange('description', newValue);
                        setTimeout(() => {
                          textarea.focus();
                          textarea.selectionStart = start + 3;
                          textarea.selectionEnd = start + 3 + 'Пункт списка'.length;
                        }, 0);
                      }
                    }}
                    className="px-2 py-1 text-xs bg-white border border-slate-300 rounded hover:bg-slate-50"
                    title="Список"
                  >
                    •
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const textarea = document.querySelector('textarea[placeholder*="Markdown"]') as HTMLTextAreaElement;
                      if (textarea) {
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const selectedText = textarea.value.substring(start, end);
                        const newText = `[${selectedText || 'текст ссылки'}](http://example.com)`;
                        const newValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
                        handleInputChange('description', newValue);
                        setTimeout(() => {
                          textarea.focus();
                          if (selectedText) {
                            textarea.selectionStart = start + newText.length - 'http://example.com)'.length;
                            textarea.selectionEnd = start + newText.length - 1;
                          } else {
                            textarea.selectionStart = start + 1;
                            textarea.selectionEnd = start + 1 + 'текст ссылки'.length;
                          }
                        }, 0);
                      }
                    }}
                    className="px-2 py-1 text-xs bg-white border border-slate-300 rounded hover:bg-slate-50"
                    title="Ссылка"
                  >
                    🔗
                  </button>
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  onKeyDown={(e) => {
                    // Разрешаем Tab в textarea для отступов
                    if (e.key === 'Tab') {
                      e.preventDefault();
                      const textarea = e.target as HTMLTextAreaElement;
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const value = textarea.value;
                      
                      // Вставляем tab (или пробелы)
                      const newValue = value.substring(0, start) + '  ' + value.substring(end);
                      handleInputChange('description', newValue);
                      
                      // Восстанавливаем позицию курсора
                      setTimeout(() => {
                        textarea.selectionStart = textarea.selectionEnd = start + 2;
                      }, 0);
                    }
                  }}
                  rows={6}
                  wrap="soft"
                  className="w-full px-3 py-2 border border-slate-300 border-t-0 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-y"
                  style={{ 
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                  }}
                  placeholder="Подробное описание модели с поддержкой Markdown...

Примеры форматирования:
**жирный текст**
*курсив*
- списки
- пункты

## Заголовки
### Подзаголовки

[ссылки](http://example.com)
"
                />
                <div className="text-xs text-slate-500">
                  <strong>Поддерживается Markdown:</strong> **жирный**, *курсив*, ## заголовки, - списки, [ссылки](url)
                </div>
              </div>
            ) : (
              <div className="min-h-[150px] p-4 border border-slate-300 rounded-md bg-slate-50">
                <div className="prose prose-sm max-w-none" style={{ whiteSpace: 'pre-wrap' }}>
                  {formData.description.trim() ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                      {formData.description}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-slate-500 italic">Начните вводить описание в режиме редактора...</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Изображения
            </label>
            
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <p className="text-slate-600 mb-2">Загрузите изображения модели</p>
              <p className="text-xs text-slate-500 mb-4">
                Поддерживаемые форматы: JPG, PNG, GIF. Максимальный размер: 10MB<br />
                Изображения автоматически сжимаются до 800px ширины для экономии места
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploading}
              />
              <label
                htmlFor="image-upload"
                className={`inline-flex items-center px-4 py-2 rounded-md transition-colors ${
                  uploading 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                } text-white`}
              >
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? 'Загрузка...' : 'Выбрать файлы'}
              </label>
            </div>

            {/* Image preview */}
            {formData.images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-slate-600 mb-2">
                  Загружено изображений: {formData.images.length}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Изображение ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk0YTNiOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPklNRzwvdGV4dD48L3N2Zz4=';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Удалить изображение"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Yandex Disk Link */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Ссылка на Яндекс.Диск
            </label>
            <div className="space-y-2">
              <input
                type="url"
                value={formData.yandexDiskLink}
                onChange={(e) => handleInputChange('yandexDiskLink', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://disk.yandex.ru/d/..."
              />
              <p className="text-xs text-slate-500">
                Ссылка на папку Яндекс.Диска с дополнительными фотографиями модели. 
                Если указана ссылка, на странице модели появится кнопка "Смотреть больше фото".
              </p>
            </div>
          </div>

          {/* Video Frame */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Видеофрейм
            </label>
            <div className="space-y-2">
              <textarea
                value={formData.videoFrame}
                onChange={(e) => handleInputChange('videoFrame', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder='<iframe src="https://vk.com/video_ext.php?..." width="325" height="646" allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;" frameborder="0" allowfullscreen></iframe>'
                rows={4}
              />
              <p className="text-xs text-slate-500">
                HTML-код iframe для встраивания видео с ВКонтакте, YouTube или других платформ. 
                Будет отображаться на странице модели.
              </p>
              {formData.videoFrame && (
                <div className="p-3 bg-slate-50 rounded-md">
                  <p className="text-xs text-slate-600 mb-2">Предпросмотр:</p>
                  <div className="bg-white p-2 rounded border" dangerouslySetInnerHTML={{ __html: formData.videoFrame }} />
                </div>
              )}
            </div>
          </div>

          {/* Specifications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Технические характеристики
                </label>
                <p className="text-xs text-slate-500 mt-1">
                  Кликните на иконку карандаша для редактирования характеристики
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={exportSpecsToCSV}
                  disabled={Object.keys(formData.specifications).length === 0}
                  className="inline-flex items-center px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
                  title="Экспорт в CSV"
                >
                  <Download className="mr-1 h-3 w-3" />
                  Экспорт
                </button>
              </div>
            </div>

            {/* Excel/CSV upload section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Загрузка характеристик из Excel
              </h4>
              <p className="text-xs text-blue-700 mb-3">
                Загрузите Excel/CSV файл или скопируйте данные из Excel (2 колонки: Название | Значение)
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv,.txt"
                    onChange={handleExcelUpload}
                    className="hidden"
                    id="excel-upload"
                    disabled={loadingSpecs}
                  />
                  <label
                    htmlFor="excel-upload"
                    className={`inline-flex items-center px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                      loadingSpecs 
                        ? 'bg-slate-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {loadingSpecs ? 'Загрузка...' : 'Загрузить Excel/CSV'}
                  </label>
                </div>
                
                <button
                  type="button"
                  onClick={handlePasteExcelData}
                  disabled={loadingSpecs}
                  className="inline-flex items-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50"
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Вставить из Excel
                </button>
              </div>
              
              <div className="mt-2 text-xs text-blue-600">
                <strong>Excel/CSV:</strong> Файлы .xlsx, .xls, .csv с 2 колонками (Название | Значение)<br />
                <strong>Из Excel:</strong> Выделите 2 колонки в Excel, скопируйте (Ctrl+C) и нажмите "Вставить из Excel"
              </div>
            </div>
            
            {/* Manual add specification */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
                placeholder="Название характеристики"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                placeholder="Значение"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddSpecification}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Existing specifications */}
            <div className="space-y-2">
              {Object.entries(formData.specifications).length === 0 ? (
                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                  <FileSpreadsheet className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                  <p className="text-sm">Нет характеристик</p>
                  <p className="text-xs">Добавьте характеристики вручную или загрузите из Excel</p>
                </div>
              ) : (
                <>
                  <div className="text-sm text-slate-600 mb-2">
                    Характеристик: {Object.keys(formData.specifications).length}
                    {editingSpec && (
                      <span className="ml-2 text-blue-600 text-xs">
                        (редактируется: {editingSpec})
                      </span>
                    )}
                  </div>
                  {Object.entries(formData.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 p-3 bg-slate-50 rounded-md">
                      {editingSpec === key ? (
                        // Режим редактирования
                        <>
                          <input
                            type="text"
                            value={editingKey}
                            onChange={(e) => setEditingKey(e.target.value)}
                            className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Название характеристики"
                          />
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Значение"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                saveEditingSpec();
                              } else if (e.key === 'Escape') {
                                cancelEditingSpec();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={saveEditingSpec}
                            className="p-1 text-green-600 hover:bg-green-100 rounded"
                            title="Сохранить (Enter)"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditingSpec}
                            className="p-1 text-slate-600 hover:bg-slate-100 rounded"
                            title="Отмена (Esc)"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        // Режим просмотра
                        <>
                          <span className="font-medium text-slate-700 flex-1">{key}:</span>
                          <span className="text-slate-900 flex-1">{value}</span>
                          <button
                            type="button"
                            onClick={() => startEditingSpec(key, value)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                            title="Редактировать"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveSpecification(key)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            title="Удалить"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {model ? 'Сохранить изменения' : 'Создать модель'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}