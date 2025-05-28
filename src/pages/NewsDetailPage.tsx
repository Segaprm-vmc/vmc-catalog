import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Download, Share2, Clock, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { News } from '@/types';

/**
 * Страница детального просмотра новости
 */
export function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = {
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
    if (id) {
      loadNews(id);
    }
  }, [id]);

  const loadNews = async (newsId: string) => {
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

      const newsItem = data.find((item: News) => item.id === newsId && item.published);
      
      if (newsItem) {
        setNews(newsItem);
      } else {
        setError('Новость не найдена или не опубликована');
      }
    } catch (error) {
      console.error('Ошибка загрузки новости:', error);
      setError('Ошибка при загрузке новости');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatReadTime = (content: string) => {
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / 250);
    return `${readTime} мин`;
  };

  const handleShare = async () => {
    if (navigator.share && news) {
      try {
        await navigator.share({
          title: news.title,
          text: news.excerpt,
          url: window.location.href
        });
      } catch (error) {
        console.log('Ошибка при попытке поделиться:', error);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Ссылка скопирована в буфер обмена');
  };

  const downloadDocument = (doc: News['document']) => {
    if (doc) {
      const link = window.document.createElement('a');
      link.href = doc.url;
      link.download = doc.name;
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Загрузка новости...</p>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Новость не найдена</h1>
        <p className="text-slate-600 mb-6">
          {error || 'Запрашиваемая новость не существует или была удалена'}
        </p>
        <Link
          to="/news"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Вернуться к новостям
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/news"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к новостям
        </Link>
      </div>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${categoryColors[news.category]}`}>
            {categories[news.category]}
          </span>
          <div className="flex items-center text-sm text-slate-500">
            <Calendar className="mr-1 h-4 w-4" />
            {formatDate(news.publishDate)}
          </div>
          <div className="flex items-center text-sm text-slate-500">
            <Clock className="mr-1 h-4 w-4" />
            {formatReadTime(news.content)}
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
          {news.title}
        </h1>

        <p className="text-xl text-slate-600 leading-relaxed">
          {news.excerpt}
        </p>

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
          <div className="text-sm text-slate-500">
            Обновлено: {formatDate(news.updatedAt)}
          </div>
          
          <div className="flex items-center gap-3">
            {news.document && (
              <button
                onClick={() => downloadDocument(news.document)}
                className="inline-flex items-center px-3 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
              >
                <Download className="mr-2 h-4 w-4" />
                {news.document.name}
              </button>
            )}
            
            <button
              onClick={handleShare}
              className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Поделиться
            </button>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {news.image && (
        <div className="mb-8">
          <img
            src={news.image}
            alt={news.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-slate max-w-none mb-8">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-semibold text-slate-900 mt-4 mb-2">{children}</h3>,
            p: ({ children }) => <p className="text-slate-700 leading-relaxed mb-4">{children}</p>,
            ul: ({ children }) => <ul className="list-disc list-inside text-slate-700 mb-4 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside text-slate-700 mb-4 space-y-1">{children}</ol>,
            li: ({ children }) => <li className="ml-4">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            a: ({ href, children }) => (
              <a 
                href={href} 
                className="text-blue-600 hover:text-blue-800 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-200 pl-4 py-2 my-4 bg-blue-50 text-slate-700 italic">
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            )
          }}
        >
          {news.content}
        </ReactMarkdown>
      </div>

      {/* Document Download */}
      {news.document && (
        <div className="bg-slate-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Дополнительные материалы</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Download className="mr-3 h-5 w-5 text-slate-600" />
              <div>
                <p className="font-medium text-slate-900">{news.document.name}</p>
                <p className="text-sm text-slate-600">
                  {news.document.type.toUpperCase()} документ
                </p>
              </div>
            </div>
            <button
              onClick={() => downloadDocument(news.document)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Скачать
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="border-t border-slate-200 pt-8">
        <div className="flex items-center justify-between">
          <Link
            to="/news"
            className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Все новости
          </Link>
          
          <Link
            to={`/news?category=${news.category}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Другие новости в категории "{categories[news.category]}"
          </Link>
        </div>
      </div>
    </article>
  );
} 