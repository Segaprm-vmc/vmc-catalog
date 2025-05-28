import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Download, FileText, Search, Filter, ArrowLeft, Clock } from 'lucide-react';
import type { Regulation } from '@/types';
import { RefreshRegulationsButton } from '@/components/RefreshRegulationsButton';

/**
 * Страница со списком всех регламентов с фильтрацией
 */
export function RegulationsPage() {
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [filteredRegulations, setFilteredRegulations] = useState<Regulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = {
    all: 'Все регламенты',
    maintenance: 'Техобслуживание',
    operation: 'Эксплуатация',
    safety: 'Безопасность',
    warranty: 'Гарантия',
    technical: 'Технические'
  };

  const categoryColors = {
    maintenance: 'bg-blue-100 text-blue-800',
    operation: 'bg-green-100 text-green-800', 
    safety: 'bg-red-100 text-red-800',
    warranty: 'bg-purple-100 text-purple-800',
    technical: 'bg-orange-100 text-orange-800'
  };

  useEffect(() => {
    loadRegulations();
  }, []);

  useEffect(() => {
    filterRegulations();
  }, [regulations, searchQuery, selectedCategory]);

  const loadRegulations = async () => {
    try {
      let data: Regulation[] = [];

      // Сначала пробуем загрузить из localStorage (локальные изменения)
      const localRegulations = localStorage.getItem('vmc-regulations');
      if (localRegulations) {
        data = JSON.parse(localRegulations);
      } else {
        // Если нет локальных данных, загружаем из файла
        const response = await fetch('/data/regulations.json');
        if (!response.ok) {
          throw new Error('Failed to load regulations');
        }
        data = await response.json();
      }

      setRegulations(data);
    } catch (error) {
      console.error('Ошибка загрузки регламентов:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRegulations = () => {
    let filtered = regulations;

    // Фильтр по категории
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(reg => reg.category === selectedCategory);
    }

    // Поиск по тексту
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(reg =>
        reg.title.toLowerCase().includes(query) ||
        reg.description.toLowerCase().includes(query)
      );
    }

    // Сортировка по порядку
    filtered.sort((a, b) => (a.order || 999) - (b.order || 999));

    setFilteredRegulations(filtered);
  };

  const getCategoryStats = () => {
    return Object.keys(categories).reduce((stats, category) => {
      if (category === 'all') {
        stats[category] = regulations.length;
      } else {
        stats[category] = regulations.filter(reg => reg.category === category).length;
      }
      return stats;
    }, {} as Record<string, number>);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6 w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = getCategoryStats();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link 
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            К каталогу
          </Link>
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Регламенты VMC</h1>
        </div>
        <p className="text-gray-600 max-w-3xl">
          Полная база регламентов по техническому обслуживанию, эксплуатации и ремонту мототехники VMC. 
          Все документы содержат подробные инструкции, схемы и рекомендации от производителя.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск регламентов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 items-center">
          {Object.entries(categories).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="mr-1.5 h-3 w-3" />
              {label}
              <span className="ml-1.5 text-xs bg-white bg-opacity-20 px-1.5 py-0.5 rounded-full">
                {stats[key] || 0}
              </span>
            </button>
          ))}
          
          {/* Refresh Button */}
          <RefreshRegulationsButton onRefresh={loadRegulations} />
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Найдено регламентов: <span className="font-medium">{filteredRegulations.length}</span>
          {searchQuery && (
            <span> по запросу "<span className="font-medium">{searchQuery}</span>"</span>
          )}
        </p>
      </div>

      {/* Regulations Grid */}
      {filteredRegulations.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Регламенты не найдены</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery 
              ? 'Попробуйте изменить поисковый запрос или выбрать другую категорию'
              : 'В выбранной категории пока нет регламентов'
            }
          </p>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              Показать все регламенты
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegulations.map((regulation) => (
            <div
              key={regulation.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Category badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  categoryColors[regulation.category] || 'bg-gray-100 text-gray-800'
                }`}>
                  {categories[regulation.category]}
                </span>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="mr-1 h-3 w-3" />
                  {formatDate(regulation.updatedAt)}
                </div>
              </div>

              {/* Title and description */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {regulation.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {regulation.description}
              </p>

              {/* Downloads */}
              {regulation.downloadLinks && (
                <div className="flex items-center gap-2 mb-4">
                  {regulation.downloadLinks.pdf && (
                    <a
                      href={regulation.downloadLinks.pdf}
                      download
                      className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      PDF
                    </a>
                  )}
                  {regulation.downloadLinks.word && (
                    <a
                      href={regulation.downloadLinks.word}
                      download
                      className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Word
                    </a>
                  )}
                </div>
              )}

              {/* View button */}
              <Link
                to={`/regulations/${regulation.id}`}
                className="inline-flex items-center w-full justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FileText className="mr-2 h-4 w-4" />
                Читать регламент
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 