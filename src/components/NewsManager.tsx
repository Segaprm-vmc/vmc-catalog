import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Save, X, ArrowUp, ArrowDown, Newspaper, Download, Calendar, Image, FileText, Eye, EyeOff, Star } from 'lucide-react';
import type { News } from '@/types';
import { NewsAPI } from '@/api/news';

interface NewsManagerProps {
}

/**
 * Компонент управления новостями в админ-панели
 */
export function NewsManager({}: NewsManagerProps) {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState<Partial<News>>({});
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

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
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      // Сначала пробуем загрузить из localStorage (локальные изменения)
      const localNews = localStorage.getItem('vmc-news');
      if (localNews) {
        const data = JSON.parse(localNews);
        setNews(data.sort((a: News, b: News) => (a.order || 999) - (b.order || 999)));
        setLoading(false);
        return;
      }

      // Если нет локальных данных, загружаем из файла
      const data = await NewsAPI.getAllNews();
      setNews(data.sort((a: News, b: News) => (a.order || 999) - (b.order || 999)));
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (newsItem: News) => {
    setEditingId(newsItem.id);
    setEditForm(newsItem);
    setIsCreating(false);
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingId(null);
    setEditForm({
      title: '',
      content: '',
      excerpt: '',
      category: 'company',
      featured: false,
      published: true,
      publishDate: new Date().toISOString().slice(0, 16)
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setIsCreating(false);
    setEditForm({});
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // В реальном приложении здесь был бы upload на сервер
      // Пока просто создаем локальный URL
      const imageUrl = URL.createObjectURL(file);
      setEditForm({...editForm, image: imageUrl});
    }
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // В реальном приложении здесь был бы upload на сервер
      const documentUrl = URL.createObjectURL(file);
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const documentType = fileExtension === 'pdf' ? 'pdf' : 
                          fileExtension === 'doc' ? 'doc' :
                          fileExtension === 'docx' ? 'docx' : 'other';
      
      setEditForm({
        ...editForm, 
        document: {
          name: file.name,
          url: documentUrl,
          type: documentType as any
        }
      });
    }
  };

  const saveNews = async () => {
    try {
      if (isCreating) {
        const newsData = {
          title: editForm.title || '',
          content: editForm.content || '',
          excerpt: editForm.excerpt || '',
          image: editForm.image,
          document: editForm.document,
          category: editForm.category as any || 'company',
          featured: editForm.featured || false,
          published: editForm.published || true,
          publishDate: editForm.publishDate || new Date().toISOString(),
          order: news.length + 1
        };

        const newNews = await NewsAPI.createNews(newsData);
        if (newNews) {
          const updatedNews = [...news, newNews];
          setNews(updatedNews);
          alert('Новость успешно создана и сохранена!');
        } else {
          alert('Ошибка при создании новости');
          return;
        }
      } else if (editingId) {
        const updatedNews = await NewsAPI.updateNews(editingId, editForm);
        if (updatedNews) {
          const updatedNewsList = news.map(n =>
            n.id === editingId ? updatedNews : n
          );
          setNews(updatedNewsList);
          alert('Новость успешно обновлена и сохранена!');
        } else {
          alert('Ошибка при обновлении новости');
          return;
        }
      }

      cancelEditing();
    } catch (error) {
      console.error('Ошибка сохранения новости:', error);
      alert('Ошибка при сохранении новости');
    }
  };

  const deleteNews = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту новость?')) {
      return;
    }

    try {
      const success = await NewsAPI.deleteNews(id);
      if (success) {
        const updatedNews = news.filter(n => n.id !== id);
        setNews(updatedNews);
        alert('Новость успешно удалена!');
      } else {
        alert('Ошибка при удалении новости');
      }
    } catch (error) {
      console.error('Ошибка удаления новости:', error);
      alert('Ошибка при удалении новости');
    }
  };

  const moveNews = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = news.findIndex(n => n.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === news.length - 1)
    ) {
      return;
    }

    const newNews = [...news];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    [newNews[currentIndex], newNews[targetIndex]] = 
    [newNews[targetIndex], newNews[currentIndex]];

    newNews.forEach((newsItem, index) => {
      newsItem.order = index + 1;
    });

    setNews(newNews);

    // Сохраняем новый порядок
    try {
      const newsIds = newNews.map(n => n.id);
      await NewsAPI.reorderNews(newsIds);
    } catch (error) {
      console.error('Ошибка сохранения порядка новостей:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    const newsItem = news.find(n => n.id === id);
    if (!newsItem) return;

    try {
      const updatedNews = await NewsAPI.updateNews(id, { featured: !newsItem.featured });
      if (updatedNews) {
        const updatedNewsList = news.map(n =>
          n.id === id ? updatedNews : n
        );
        setNews(updatedNewsList);
      }
    } catch (error) {
      console.error('Ошибка обновления статуса рекомендации:', error);
    }
  };

  const togglePublished = async (id: string) => {
    const newsItem = news.find(n => n.id === id);
    if (!newsItem) return;

    try {
      const updatedNews = await NewsAPI.updateNews(id, { published: !newsItem.published });
      if (updatedNews) {
        const updatedNewsList = news.map(n =>
          n.id === id ? updatedNews : n
        );
        setNews(updatedNewsList);
      }
    } catch (error) {
      console.error('Ошибка обновления статуса публикации:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Newspaper className="mr-3 h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-slate-900">Управление новостями</h2>
        </div>
        <button
          onClick={startCreating}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Добавить новость
        </button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">
              {isCreating ? 'Создание новости' : 'Редактирование новости'}
            </h3>
            <button
              onClick={cancelEditing}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Основная информация */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Заголовок новости *
                </label>
                <input
                  type="text"
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите заголовок новости..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Краткое описание *
                </label>
                <textarea
                  value={editForm.excerpt || ''}
                  onChange={(e) => setEditForm({...editForm, excerpt: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Краткое описание для списка новостей..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Категория *
                  </label>
                  <select
                    value={editForm.category || 'company'}
                    onChange={(e) => setEditForm({...editForm, category: e.target.value as any})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(categories).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Дата публикации *
                  </label>
                  <input
                    type="datetime-local"
                    value={editForm.publishDate?.slice(0, 16) || ''}
                    onChange={(e) => setEditForm({...editForm, publishDate: e.target.value + ':00.000Z'})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.featured || false}
                    onChange={(e) => setEditForm({...editForm, featured: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-slate-700">Рекомендуемая новость</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.published !== false}
                    onChange={(e) => setEditForm({...editForm, published: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-slate-700">Опубликована</span>
                </label>
              </div>
            </div>

            {/* Файлы */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Изображение новости
                </label>
                <div className="space-y-2">
                  {editForm.image && (
                    <div className="relative">
                      <img 
                        src={editForm.image} 
                        alt="Предпросмотр" 
                        className="w-full h-32 object-cover rounded-md border"
                      />
                      <button
                        onClick={() => setEditForm({...editForm, image: undefined})}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center"
                  >
                    <Image className="mr-2 h-4 w-4" />
                    {editForm.image ? 'Изменить изображение' : 'Загрузить изображение'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Прикрепленный документ
                </label>
                <div className="space-y-2">
                  {editForm.document && (
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-slate-600" />
                        <span className="text-sm text-slate-700">{editForm.document.name}</span>
                      </div>
                      <button
                        onClick={() => setEditForm({...editForm, document: undefined})}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={documentInputRef}
                    onChange={handleDocumentUpload}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => documentInputRef.current?.click()}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {editForm.document ? 'Изменить документ' : 'Прикрепить документ'}
                  </button>
                  <p className="text-xs text-slate-500">
                    Поддерживаются файлы: PDF, DOC, DOCX
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Содержание */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Содержание новости * (Markdown)
            </label>
            <textarea
              value={editForm.content || ''}
              onChange={(e) => setEditForm({...editForm, content: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={12}
              placeholder="## Заголовок

### Подзаголовок

Текст новости с **жирным выделением** и *курсивом*.

- Список пунктов
- Еще один пункт

[Ссылка на сайт](https://example.com)"
            />
            <p className="text-xs text-slate-500 mt-1">
              Используйте Markdown для форматирования: ## заголовки, **жирный**, *курсив*, [ссылки](url)
            </p>
          </div>

          {/* Действия */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={cancelEditing}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={saveNews}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Save className="mr-2 h-4 w-4" />
              {isCreating ? 'Создать' : 'Сохранить'}
            </button>
          </div>
        </div>
      )}

      {/* News List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">
            Всего новостей: {news.length} ({news.filter(n => n.published).length} опубликованных)
          </h3>
        </div>

        <div className="divide-y divide-slate-200">
          {news.map((newsItem, index) => (
            <div key={newsItem.id} className="p-4 hover:bg-slate-50">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-slate-900 truncate">
                      {newsItem.title}
                    </h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryColors[newsItem.category]}`}>
                      {categories[newsItem.category]}
                    </span>
                    {newsItem.featured && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                    {!newsItem.published && (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {newsItem.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {formatDate(newsItem.publishDate)}
                    </div>
                    
                    {newsItem.image && (
                      <div className="flex items-center">
                        <Image className="mr-1 h-3 w-3" />
                        Изображение
                      </div>
                    )}
                    
                    {newsItem.document && (
                      <div className="flex items-center">
                        <Download className="mr-1 h-3 w-3" />
                        {newsItem.document.name}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Статус переключатели */}
                  <button
                    onClick={() => toggleFeatured(newsItem.id)}
                    className={`p-1 rounded transition-colors ${
                      newsItem.featured ? 'text-yellow-600 hover:bg-yellow-50' : 'text-slate-400 hover:text-yellow-600'
                    }`}
                    title={newsItem.featured ? 'Убрать из рекомендуемых' : 'Сделать рекомендуемой'}
                  >
                    <Star className={`h-4 w-4 ${newsItem.featured ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => togglePublished(newsItem.id)}
                    className={`p-1 rounded transition-colors ${
                      newsItem.published ? 'text-green-600 hover:bg-green-50' : 'text-slate-400 hover:text-green-600'
                    }`}
                    title={newsItem.published ? 'Снять с публикации' : 'Опубликовать'}
                  >
                    {newsItem.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>

                  {/* Сортировка */}
                  <div className="flex flex-col">
                    <button
                      onClick={() => moveNews(newsItem.id, 'up')}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Переместить вверх"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => moveNews(newsItem.id, 'down')}
                      disabled={index === news.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Переместить вниз"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Действия */}
                  <button
                    onClick={() => startEditing(newsItem)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Редактировать"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => deleteNews(newsItem.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {news.length === 0 && (
            <div className="p-8 text-center">
              <Newspaper className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Нет новостей</h3>
              <p className="text-slate-600 mb-4">Создайте первую новость для начала работы</p>
              <button
                onClick={startCreating}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" />
                Добавить новость
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 