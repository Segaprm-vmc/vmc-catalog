import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Download, Star, Eye, Clock, Newspaper } from 'lucide-react';
import type { News } from '@/types';
import { RefreshNewsButton } from '@/components/RefreshNewsButton';

/**
 * Страница списка новостей
 */
export function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = {
    all: 'Все новости',
    company: 'Компания', 
    products: 'Продукты',
    events: 'События',
    maintenance: 'Обслуживание',
    other: 'Прочее'
  };

  const categoryColors = {
    company: 'bg-blue-100 text-blue-800',
    products: 'bg-green-100 text-green-800',
    events: 'bg-purple-100 text-purple-800',
    maintenance: 'bg-orange-100 text-orange-800',
    other: 'bg-gray-100 text-gray-800'
  };

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      let data: News[] = [];

      // Сначала пробуем загрузить из localStorage (локальные изменения)
      const localNews = localStorage.getItem('vmc-news');
      if (localNews) {
        data = JSON.parse(localNews);
      } else {
        // Если нет локальных данных, загружаем из файла
        const response = await fetch('/data/news.json');
        data = await response.json();
      }

      // Показываем только опубликованные новости, сортировка по дате
      const publishedNews = data
        .filter((item: News) => item.published)
        .sort((a: News, b: News) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
      setNews(publishedNews);
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = news.filter(newsItem => {
    const matchesSearch = newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         newsItem.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || newsItem.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredNews = filteredNews.filter(item => item.featured);
  const regularNews = filteredNews.filter(item => !item.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatReadTime = (content: string) => {
    // Примерная оценка времени чтения (250 слов в минуту)
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / 250);
    return `${readTime} мин чтения`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Загрузка новостей...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center relative">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
          <Newspaper className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
          Новости VMC
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Актуальные новости о продукции, событиях и обновлениях компании VMC
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mt-6"></div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Поиск новостей по названию или описанию..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 hover:bg-white transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap items-center">
            {Object.entries(categories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                  selectedCategory === key
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105'
                }`}
              >
                {label}
                {key !== 'all' && (
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                    selectedCategory === key 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {news.filter(n => n.category === key).length}
                  </span>
                )}
              </button>
            ))}
            
            {/* Refresh Button */}
            <RefreshNewsButton onRefresh={loadNews} />
          </div>
        </div>
      </div>

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                <Star className="h-4 w-4 text-white fill-current" />
              </div>
              Рекомендуемые новости
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {featuredNews.map((newsItem) => (
              <Link
                key={newsItem.id}
                to={`/news/${newsItem.id}`}
                className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Featured badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    РЕКОМЕНДУЕМ
                  </div>
                </div>

                {newsItem.image && (
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={newsItem.image}
                      alt={newsItem.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold ${categoryColors[newsItem.category]} border border-current border-opacity-20`}>
                      {categories[newsItem.category]}
                    </span>
                    <div className="flex items-center text-sm text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                      <Calendar className="mr-1.5 h-3.5 w-3.5" />
                      {formatDate(newsItem.publishDate)}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                    {newsItem.title}
                  </h3>
                  
                  <p className="text-slate-600 mb-5 line-clamp-3 leading-relaxed">
                    {newsItem.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center bg-blue-50 px-2 py-1 rounded-lg">
                        <Clock className="mr-1 h-3 w-3 text-blue-600" />
                        <span className="font-medium">{formatReadTime(newsItem.content)}</span>
                      </div>
                      {newsItem.document && (
                        <div className="flex items-center bg-green-50 px-2 py-1 rounded-lg">
                          <Download className="mr-1 h-3 w-3 text-green-600" />
                          <span className="font-medium">Документ</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-blue-600 group-hover:text-blue-700 font-semibold">
                      <span className="mr-2">Читать</span>
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Eye className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Regular News */}
      {regularNews.length > 0 && (
        <div className="space-y-6">
          {featuredNews.length > 0 && (
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-slate-900">Все новости</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
            </div>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularNews.map((newsItem) => (
              <Link
                key={newsItem.id}
                to={`/news/${newsItem.id}`}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200 transition-all duration-300 hover:-translate-y-0.5"
              >
                {newsItem.image && (
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={newsItem.image}
                      alt={newsItem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${categoryColors[newsItem.category]} border border-current border-opacity-20`}>
                      {categories[newsItem.category]}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                    {newsItem.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                    {newsItem.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                      <Calendar className="mr-1.5 h-3 w-3" />
                      <span className="font-medium">{formatDate(newsItem.publishDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {newsItem.document && (
                        <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                          <Download className="mr-1 h-3 w-3" />
                          <span className="font-medium">PDF</span>
                        </div>
                      )}
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Eye className="h-2.5 w-2.5 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Новости не найдены</h3>
          <p className="text-slate-600 mb-4">
            {searchTerm
              ? `По запросу "${searchTerm}" ничего не найдено`
              : 'В выбранной категории пока нет новостей'
            }
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Сбросить фильтры
          </button>
        </div>
      )}
    </div>
  );
} 