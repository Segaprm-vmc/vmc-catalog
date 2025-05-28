import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Clock, Image as ImageIcon, AlertCircle } from 'lucide-react';
import type { Regulation } from '@/types';

/**
 * Страница детального просмотра регламента
 */
export function RegulationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [regulation, setRegulation] = useState<Regulation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = {
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
    if (id) {
      loadRegulation(id);
    }
  }, [id]);

  const loadRegulation = async (regulationId: string) => {
    try {
      setLoading(true);
      let regulations: Regulation[] = [];

      // Сначала пробуем загрузить из localStorage (локальные изменения)
      const localRegulations = localStorage.getItem('vmc-regulations');
      if (localRegulations) {
        regulations = JSON.parse(localRegulations);
      } else {
        // Если нет локальных данных, загружаем из файла
        const response = await fetch('/data/regulations.json');
        if (!response.ok) {
          throw new Error('Ошибка загрузки регламентов');
        }
        regulations = await response.json();
      }

      const foundRegulation = regulations.find(reg => reg.id === regulationId);
      
      if (!foundRegulation) {
        setError('Регламент не найден');
        return;
      }
      
      setRegulation(foundRegulation);
    } catch (err) {
      console.error('Ошибка загрузки регламента:', err);
      setError('Ошибка загрузки регламента');
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

  const renderMarkdown = (content: string) => {
    // Простой рендеринг markdown для демонстрации
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{line.replace('## ', '')}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">{line.replace('### ', '')}</h3>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={index} className="font-semibold text-gray-900 mt-4 mb-2">{line.replace(/\*\*/g, '')}</p>;
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="text-gray-700 mb-1">{line.replace('- ', '')}</li>;
        }
        if (line.trim() === '') {
          return <div key={index} className="my-3"></div>;
        }
        return <p key={index} className="text-gray-700 mb-2">{line}</p>;
      });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6 w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !regulation) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {error || 'Регламент не найден'}
          </h3>
          <p className="text-gray-600 mb-6">
            Возможно, регламент был удален или перемещен
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </button>
            <Link
              to="/regulations"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Все регламенты
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <Link
            to="/regulations"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            К регламентам
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          {/* Meta info */}
          <div className="flex items-center justify-between mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              categoryColors[regulation.category] || 'bg-gray-100 text-gray-800'
            }`}>
              {categories[regulation.category]}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="mr-1 h-4 w-4" />
              Обновлено: {formatDate(regulation.updatedAt)}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {regulation.title}
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-6">
            {regulation.description}
          </p>

          {/* Download links */}
          {regulation.downloadLinks && (
            <div className="flex flex-wrap gap-3">
              {regulation.downloadLinks.pdf && (
                <a
                  href={regulation.downloadLinks.pdf}
                  download
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Скачать PDF
                </a>
              )}
              {regulation.downloadLinks.word && (
                <a
                  href={regulation.downloadLinks.word}
                  download
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Скачать Word
                </a>
              )}
            </div>
          )}
        </div>

        {/* Screenshot */}
        {regulation.screenshot && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ImageIcon className="mr-2 h-5 w-5" />
              Иллюстрация
            </h3>
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <img
                src={regulation.screenshot}
                alt={`Иллюстрация к регламенту: ${regulation.title}`}
                className="w-full h-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div class="flex items-center justify-center h-64 bg-gray-100 text-gray-500">
                      <div class="text-center">
                        <svg class="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p>Изображение недоступно</p>
                      </div>
                    </div>
                  `;
                }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Содержание регламента
          </h3>
          <div className="prose prose-gray max-w-none">
            {renderMarkdown(regulation.content)}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <Link
          to="/regulations"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Все регламенты
        </Link>

        {regulation.downloadLinks && (
          <div className="flex gap-3">
            {regulation.downloadLinks.pdf && (
              <a
                href={regulation.downloadLinks.pdf}
                download
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <Download className="mr-2 h-4 w-4" />
                PDF
              </a>
            )}
            {regulation.downloadLinks.word && (
              <a
                href={regulation.downloadLinks.word}
                download
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download className="mr-2 h-4 w-4" />
                Word
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 