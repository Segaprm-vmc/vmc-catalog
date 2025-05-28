import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  X, 
  Info,
  Copy,
  Grid3X3,
  List,
  ExternalLink,
  Camera
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import type { MotorcycleModel } from '@/types';
import { getModelById } from '@/services/api';

/**
 * Страница детальной информации о модели мотоцикла
 */
export function ModelPage() {
  const { id } = useParams<{ id: string }>();
  const [model, setModel] = useState<MotorcycleModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'list'>('table');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isSmartScrollEnabled, setIsSmartScrollEnabled] = useState(false);

  // Рефы для умного скролла
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      loadModel(id);
    }
  }, [id]);

  // Умный скролл
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (!leftPanelRef.current || !rightPanelRef.current || !model) return;

      const leftPanel = leftPanelRef.current;
      const rightPanel = rightPanelRef.current;
      const descriptionSection = descriptionRef.current;

      // Проверяем, должен ли быть активен умный скролл
      // 1. Если описание свернуто (не развернуто)
      // 2. Или если описание развернуто и мы достигли его конца
      const isDescriptionCollapsed = !isDescriptionExpanded && shouldShowPreview(model.description);
      const hasReachedDescriptionEnd = descriptionSection && 
        leftPanel.scrollTop + leftPanel.clientHeight >= descriptionSection.offsetTop + descriptionSection.offsetHeight + 50;
      
      const shouldEnableSmartScroll = isDescriptionCollapsed || hasReachedDescriptionEnd;

      if (shouldEnableSmartScroll && e.deltaY > 0) {
        // Скролл вниз - блокируем левую панель, скроллим только правую
        e.preventDefault();
        rightPanel.scrollTop += e.deltaY * 0.5; // Замедляем скорость скролла
        setIsSmartScrollEnabled(true);
      } else if (isSmartScrollEnabled && e.deltaY < 0 && rightPanel.scrollTop <= 0) {
        // Скролл вверх от начала правой панели - возвращаем обычный скролл
        setIsSmartScrollEnabled(false);
      } else if (!shouldEnableSmartScroll) {
        setIsSmartScrollEnabled(false);
      }
    };

    const mainContainer = mainContainerRef.current;
    if (mainContainer) {
      mainContainer.addEventListener('wheel', handleScroll, { passive: false });
      return () => mainContainer.removeEventListener('wheel', handleScroll);
    }
  }, [model, isDescriptionExpanded, isSmartScrollEnabled]);

  // Сбрасываем умный скролл при изменении состояния описания
  useEffect(() => {
    setIsSmartScrollEnabled(false);
  }, [isDescriptionExpanded]);

  const loadModel = async (modelId: string) => {
    setLoading(true);
    try {
      const modelData = await getModelById(modelId);
      setModel(modelData);
    } catch (error) {
      console.error('Ошибка загрузки модели:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Умное обрезание текста по словам
  const getPreviewText = (text: string, maxLength: number = 200): string => {
    if (text.length <= maxLength) return text;
    
    // Ищем последний пробел в пределах maxLength
    const trimmed = text.substring(0, maxLength);
    const lastSpace = trimmed.lastIndexOf(' ');
    
    // Если нашли пробел, обрезаем по нему, иначе по maxLength
    const cutPoint = lastSpace > maxLength * 0.7 ? lastSpace : maxLength;
    return trimmed.substring(0, cutPoint);
  };

  // Очистка markdown для превью
  const cleanMarkdownForPreview = (text: string): string => {
    return text
      .replace(/#{1,6}\s+/g, '') // Убираем заголовки
      .replace(/\*\*(.*?)\*\*/g, '$1') // Убираем жирный текст
      .replace(/\*(.*?)\*/g, '$1') // Убираем курсив
      .replace(/`(.*?)`/g, '$1') // Убираем inline код
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Убираем ссылки, оставляем текст
      .replace(/\n\s*\n/g, ' ') // Убираем двойные переносы
      .replace(/\n/g, ' ') // Заменяем переносы на пробелы
      .trim();
  };

  // Определяем нужно ли показывать превью
  const shouldShowPreview = (text: string): boolean => {
    const cleanText = cleanMarkdownForPreview(text);
    return cleanText.length > 150; // Порог для превью
  };

  // Фильтрация характеристик по поисковому запросу
  const filteredSpecs = model ? Object.entries(model.specifications).filter(([key, value]) =>
    key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    value.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-25 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Загрузка модели...</p>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen bg-gray-25 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="h-8 w-8 text-gray-400" />
          </div>
          <h1 className="text-xl font-medium text-gray-900 mb-2">Модель не найдена</h1>
          <p className="text-gray-500 mb-6 text-sm">Запрашиваемая модель отсутствует</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Вернуться
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-25">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Link
                to="/"
                className="p-1.5 sm:p-2 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </Link>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg font-medium text-gray-900 truncate">{model.name}</h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  Создано {new Date(model.createdAt).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto" ref={mainContainerRef}>
        {/* Mobile Layout - Stack vertically */}
        <div className="block lg:hidden">
          {/* Mobile Images Section */}
          <div className="bg-white border-b border-gray-100">
            <div className="p-3 sm:p-4">
              {/* Main Image */}
              <div className="mb-3">
                <div className="relative aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                  {model.images && model.images.length > 0 ? (
                    <img
                      src={model.images[currentImageIndex]}
                      alt={`${model.name} - изображение ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjlmYWZiIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+0J3QtdGCINC40LfQvtCx0YDQsNC20LXQvdC40Y88L3RleHQ+PC9zdmc+';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <Info className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Изображение отсутствует</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Navigation Arrows */}
                  {model.images && model.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex(prev => 
                          prev === 0 ? model.images!.length - 1 : prev - 1
                        )}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all"
                      >
                        <ArrowLeft className="h-4 w-4 text-gray-700" />
                      </button>
                      
                      <button
                        onClick={() => setCurrentImageIndex(prev => 
                          prev === model.images!.length - 1 ? 0 : prev + 1
                        )}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all"
                      >
                        <ArrowLeft className="h-4 w-4 text-gray-700 rotate-180" />
                      </button>
                    </>
                  )}
                  
                  {/* Image counter */}
                  {model.images && model.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                      {currentImageIndex + 1} / {model.images.length}
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Grid - Mobile optimized */}
              {model.images && model.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1 mb-3">
                  {model.images.slice(0, 8).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-md overflow-hidden border transition-all ${
                        index === currentImageIndex
                          ? 'border-gray-400 border-2'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Превью ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjlmYWZiIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JTUc8L3RleHQ+PC9zdmc+';
                        }}
                      />
                    </button>
                  ))}
                  {model.images.length > 8 && (
                    <div className="aspect-square rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center">
                      <span className="text-xs text-gray-500">+{model.images.length - 8}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Yandex Disk Link - Mobile */}
              <button
                onClick={() => model.yandexDiskLink && window.open(model.yandexDiskLink, '_blank')}
                disabled={!model.yandexDiskLink}
                className={`w-full py-3 px-4 rounded-lg border transition-colors flex items-center justify-center space-x-2 text-sm ${
                  model.yandexDiskLink
                    ? 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600'
                    : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Camera className="h-4 w-4" />
                <span className="font-medium">
                  {model.yandexDiskLink ? 'Больше фото на ЯДиск' : 'Дополнительные фото недоступны'}
                </span>
                {model.yandexDiskLink && <ExternalLink className="h-4 w-4" />}
              </button>


            </div>
          </div>

          {/* Mobile Specifications Section */}
          <div className="bg-gray-25 p-3 sm:p-4">
            {/* Description */}
            {model.description && model.description.trim() && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-3">Описание</h3>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                      {model.description}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Specifications */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                  Характеристики ({filteredSpecs.length})
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode(viewMode === 'table' ? 'list' : 'table')}
                    className="p-1.5 hover:bg-gray-200 rounded-md"
                    title={viewMode === 'table' ? 'Список' : 'Таблица'}
                  >
                    {viewMode === 'table' ? (
                      <List className="h-4 w-4 text-gray-600" />
                    ) : (
                      <Grid3X3 className="h-4 w-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск характеристик..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Mobile Specifications Display */}
              {filteredSpecs.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">
                    {searchTerm ? 'Характеристики не найдены' : 'Характеристики отсутствуют'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredSpecs.map(([key, value], index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 mb-1">{key}</div>
                          <div className="text-sm text-gray-600">{value}</div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(`${key}: ${value}`)}
                          className="ml-2 p-1 hover:bg-gray-100 rounded"
                          title="Копировать"
                        >
                          <Copy className="h-3 w-3 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout - Side by side */}
        <div className="hidden lg:grid lg:grid-cols-2 h-[calc(100vh-73px)]">
          {/* Left Panel - Images */}
          <div className="bg-white border-r border-gray-100 overflow-hidden">
            <div className="p-4 h-full overflow-y-auto scrollbar-hide" ref={leftPanelRef}>
              {/* Image Viewer */}
              <div className="mb-4">
                <div className="relative aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                  {model.images && model.images.length > 0 ? (
                    <img
                      src={model.images[currentImageIndex]}
                      alt={`${model.name} - изображение ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjlmYWZiIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+0J3QtdGCINC40LfQvtCx0YDQsNC20LXQvdC40Y88L3RleHQ+PC9zdmc+';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <Info className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Изображение отсутствует</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Navigation Arrows */}
                  {model.images && model.images.length > 1 && (
                    <>
                      {/* Previous Button */}
                      <button
                        onClick={() => setCurrentImageIndex(prev => 
                          prev === 0 ? model.images!.length - 1 : prev - 1
                        )}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                      >
                        <ArrowLeft className="h-3 w-3 text-gray-700" />
                      </button>
                      
                      {/* Next Button */}
                      <button
                        onClick={() => setCurrentImageIndex(prev => 
                          prev === model.images!.length - 1 ? 0 : prev + 1
                        )}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                      >
                        <ArrowLeft className="h-3 w-3 text-gray-700 rotate-180" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Image Grid */}
              {model.images && model.images.length > 1 && (
                <div className="grid grid-cols-6 gap-1 mb-4">
                  {model.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-md overflow-hidden border transition-all ${
                        index === currentImageIndex
                          ? 'border-gray-400 border-2'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Превью ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjlmYWZiIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JTUc8L3RleHQ+PC9zdmc+';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Yandex Disk Link Button */}
              <div>
                <button
                  onClick={() => model.yandexDiskLink && window.open(model.yandexDiskLink, '_blank')}
                  disabled={!model.yandexDiskLink}
                  className={`w-full py-2.5 px-3 rounded-lg border transition-colors flex items-center justify-center space-x-2 text-sm ${
                    model.yandexDiskLink
                      ? 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600'
                      : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Camera className="h-4 w-4" />
                  <span className="font-medium">
                    {model.yandexDiskLink ? 'Больше фото на ЯДиск' : 'Дополнительные фото недоступны'}
                  </span>
                  {model.yandexDiskLink && <ExternalLink className="h-4 w-4" />}
                </button>
              </div>


            </div>
          </div>

          {/* Right Panel - Specifications */}
          <div className="bg-gray-25 h-full overflow-hidden flex flex-col">
            <div className="p-6 flex-1 overflow-y-auto scrollbar-hide" ref={rightPanelRef}>
              {/* Description */}
              {model.description && model.description.trim() && (
                <div className="mb-4" ref={descriptionRef}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-medium text-gray-900 uppercase tracking-wide">Описание</h3>
                    <div className="flex items-center gap-2">
                      {shouldShowPreview(model.description) && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {isDescriptionExpanded ? 'Развернуто' : 'Свернуто'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="relative">
                    {(!isDescriptionExpanded && shouldShowPreview(model.description)) ? (
                      /* ===== ПРЕВЬЮ РЕЖИМ ===== */
                      <div className="space-y-3 description-transition">
                        {/* Превью карточка в стиле сайта */}
                        <div className="relative bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                          {/* Превью контент */}
                          <div className="p-4 pb-8">
                            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                {cleanMarkdownForPreview(getPreviewText(model.description, 180))}
                              </ReactMarkdown>
                            </div>
                          </div>
                          
                          {/* Тонкий градиент fade-out */}
                          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                          
                          {/* Индикатор продолжения */}
                          <div className="absolute bottom-2 right-4">
                            <div className="flex gap-0.5">
                              {[...Array(3)].map((_, i) => (
                                <div 
                                  key={i} 
                                  className="w-1 h-1 bg-gray-400 rounded-full opacity-60"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Управление в минималистичном стиле */}
                        <div className="flex justify-end">
                          <button
                            onClick={() => setIsDescriptionExpanded(true)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
                          >
                            <span>Читать полностью</span>
                            <ArrowLeft className="h-3 w-3 rotate-180" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ===== ПОЛНЫЙ РЕЖИМ ===== */
                      <div className="space-y-3 description-transition">
                        {/* Полный контент без ограничений */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                          <div className="p-4">
                            <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed">
                              <ReactMarkdown 
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                components={{
                                  h1: ({node, ...props}) => <h1 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200" {...props} />,
                                  h2: ({node, ...props}) => <h2 className="text-base font-semibold text-gray-900 mb-2 mt-4" {...props} />,
                                  h3: ({node, ...props}) => <h3 className="text-sm font-semibold text-gray-900 mb-2 mt-3" {...props} />,
                                  h4: ({node, ...props}) => <h4 className="text-sm font-medium text-gray-900 mb-1 mt-2" {...props} />,
                                  p: ({node, ...props}) => <p className="mb-2 last:mb-0 text-gray-700 text-sm" {...props} />,
                                  ul: ({node, ...props}) => <ul className="list-disc list-inside mb-3 space-y-1 text-gray-700" {...props} />,
                                  ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-700" {...props} />,
                                  li: ({node, ...props}) => <li className="text-sm" {...props} />,
                                  strong: ({node, ...props}) => <strong className="font-medium text-gray-900" {...props} />,
                                  em: ({node, ...props}) => <em className="italic text-gray-600" {...props} />,
                                  code: ({node, ...props}) => <code className="px-1.5 py-0.5 bg-gray-100 text-gray-800 text-xs rounded font-mono" {...props} />,
                                  blockquote: ({node, ...props}) => <blockquote className="border-l-3 border-gray-300 pl-3 py-1 my-3 bg-gray-50 text-gray-700 text-sm" {...props} />,
                                  a: ({node, ...props}) => <a className="text-blue-600 hover:text-blue-800 underline text-sm" {...props} />,
                                  hr: ({node, ...props}) => <hr className="my-4 border-gray-200" {...props} />,
                                  table: ({node, ...props}) => <table className="w-full border-collapse border border-gray-200 my-3 text-sm" {...props} />,
                                  th: ({node, ...props}) => <th className="border border-gray-200 px-2 py-1 bg-gray-50 text-left font-medium text-xs" {...props} />,
                                  td: ({node, ...props}) => <td className="border border-gray-200 px-2 py-1 text-xs" {...props} />,
                                }}
                              >
                                {model.description}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </div>
                        
                        {/* Управление свернуть */}
                        {shouldShowPreview(model.description) && (
                          <div className="flex justify-end">
                            <button
                              onClick={() => setIsDescriptionExpanded(false)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
                            >
                              <ArrowLeft className="h-3 w-3 rotate-90" />
                              <span>Свернуть</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Smart Scroll Indicator */}
              {isSmartScrollEnabled && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>Активен умный скролл • Скроллятся только характеристики</span>
                  </div>
                </div>
              )}
              
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Поиск характеристик"
                    className="w-full pl-10 pr-10 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                {searchTerm && (
                  <p className="mt-1.5 text-xs text-gray-500">
                    Найдено: {filteredSpecs.length} из {Object.keys(model.specifications).length}
                  </p>
                )}
              </div>

              {/* Specifications */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    Характеристики ({filteredSpecs.length})
                  </h3>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setViewMode('table')}
                      className={`p-1 rounded transition-colors ${
                        viewMode === 'table' ? 'bg-gray-100' : 'hover:bg-gray-50'
                      }`}
                    >
                      <Grid3X3 className="h-3.5 w-3.5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1 rounded transition-colors ${
                        viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'
                      }`}
                    >
                      <List className="h-3.5 w-3.5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {filteredSpecs.length === 0 ? (
                  <div className="text-center py-8">
                    {searchTerm ? (
                      <>
                        <Search className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Ничего не найдено</p>
                        <p className="text-xs text-gray-400 mt-1">
                          По запросу "{searchTerm}" результатов нет
                        </p>
                      </>
                    ) : (
                      <>
                        <Info className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Характеристики отсутствуют</p>
                      </>
                    )}
                  </div>
                ) : viewMode === 'table' ? (
                  /* Compact Table View */
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                            №
                          </th>
                          <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Параметр
                          </th>
                          <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Значение
                          </th>
                          <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                            
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSpecs.map(([key, value], index) => {
                          const isHighlighted = searchTerm && (
                            key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            value.toLowerCase().includes(searchTerm.toLowerCase())
                          );
                          
                          return (
                            <tr
                              key={key}
                              className={`${
                                isHighlighted ? 'bg-yellow-50' : 'hover:bg-gray-50'
                              } transition-colors`}
                            >
                              <td className="px-2 py-1.5 text-xs text-gray-500 font-mono">
                                {String(index + 1).padStart(2, '0')}
                              </td>
                              <td className={`px-2 py-1.5 text-xs ${
                                isHighlighted ? 'font-medium text-yellow-900' : 'text-gray-900'
                              }`}>
                                {key}
                              </td>
                              <td className={`px-2 py-1.5 text-xs ${
                                isHighlighted ? 'font-medium text-yellow-900' : 'text-gray-600'
                              }`}>
                                {value}
                              </td>
                              <td className="px-2 py-1.5">
                                <button
                                  onClick={() => copyToClipboard(`${key}: ${value}`)}
                                  className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                                  title="Копировать"
                                >
                                  <Copy className="h-3 w-3 text-gray-400" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* Compact List View */
                  <div className="space-y-1.5">
                    {filteredSpecs.map(([key, value], index) => {
                      const isHighlighted = searchTerm && (
                        key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        value.toLowerCase().includes(searchTerm.toLowerCase())
                      );
                      
                      return (
                        <div
                          key={key}
                          className={`p-2 rounded border transition-colors ${
                            isHighlighted 
                              ? 'border-yellow-200 bg-yellow-50' 
                              : 'border-gray-200 bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-xs text-gray-400 font-mono flex-shrink-0">
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              <span className={`text-xs font-medium flex-shrink-0 ${
                                isHighlighted ? 'text-yellow-900' : 'text-gray-900'
                              }`}>
                                {key}:
                              </span>
                              <span className={`text-xs truncate ${
                                isHighlighted ? 'text-yellow-800' : 'text-gray-600'
                              }`}>
                                {value}
                              </span>
                            </div>
                            <button
                              onClick={() => copyToClipboard(`${key}: ${value}`)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              title="Копировать"
                            >
                              <Copy className="h-3 w-3 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 