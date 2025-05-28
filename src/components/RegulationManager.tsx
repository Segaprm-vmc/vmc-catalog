import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, ArrowUp, ArrowDown, BookOpen, Download, Calendar } from 'lucide-react';
import type { Regulation } from '@/types';
import { RegulationsAPI } from '@/api/regulations';

interface RegulationManagerProps {
}

/**
 * Компонент управления регламентами в админ-панели
 */
export function RegulationManager({}: RegulationManagerProps) {
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Regulation>>({});

  const categories = {
    maintenance: 'Техобслуживание',
    operation: 'Эксплуатация', 
    safety: 'Безопасность',
    warranty: 'Гарантия',
    technical: 'Технические'
  };

  useEffect(() => {
    loadRegulations();
  }, []);

  const loadRegulations = async () => {
    try {
      // Сначала пробуем загрузить из localStorage (локальные изменения)
      const localRegulations = localStorage.getItem('vmc-regulations');
      if (localRegulations) {
        const data = JSON.parse(localRegulations);
        setRegulations(data.sort((a: Regulation, b: Regulation) => (a.order || 999) - (b.order || 999)));
        setLoading(false);
        return;
      }

      // Если нет локальных данных, загружаем из файла
      const data = await RegulationsAPI.getAllRegulations();
      setRegulations(data.sort((a: Regulation, b: Regulation) => (a.order || 999) - (b.order || 999)));
    } catch (error) {
      console.error('Ошибка загрузки регламентов:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (regulation: Regulation) => {
    setEditingId(regulation.id);
    setEditForm(regulation);
    setIsCreating(false);
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingId(null);
    setEditForm({
      title: '',
      description: '',
      category: 'maintenance',
      content: '',
      screenshot: '',
      downloadLinks: {
        pdf: '',
        word: ''
      }
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setIsCreating(false);
    setEditForm({});
  };

  const saveRegulation = async () => {
    try {
      if (isCreating) {
        const regulationData = {
          title: editForm.title || '',
          description: editForm.description || '',
          category: editForm.category as any || 'maintenance',
          content: editForm.content || '',
          screenshot: editForm.screenshot || undefined,
          downloadLinks: editForm.downloadLinks?.pdf || editForm.downloadLinks?.word ? editForm.downloadLinks : undefined
        };

        const newRegulation = await RegulationsAPI.createRegulation(regulationData);
        if (newRegulation) {
          const updatedRegulations = [...regulations, newRegulation];
          setRegulations(updatedRegulations);
          alert('Регламент успешно создан и сохранен!');
        } else {
          alert('Ошибка при создании регламента');
          return;
        }
      } else if (editingId) {
        const updatedRegulation = await RegulationsAPI.updateRegulation(editingId, editForm);
        if (updatedRegulation) {
          const updatedRegulations = regulations.map(r =>
            r.id === editingId ? updatedRegulation : r
          );
          setRegulations(updatedRegulations);
          alert('Регламент успешно обновлен и сохранен!');
        } else {
          alert('Ошибка при обновлении регламента');
          return;
        }
      }

      cancelEditing();
    } catch (error) {
      console.error('Ошибка сохранения регламента:', error);
      alert('Ошибка при сохранении регламента');
    }
  };

  const deleteRegulation = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот регламент?')) {
      return;
    }

    try {
      const success = await RegulationsAPI.deleteRegulation(id);
      if (success) {
        const updatedRegulations = regulations.filter(r => r.id !== id);
        setRegulations(updatedRegulations);
        alert('Регламент успешно удален!');
      } else {
        alert('Ошибка при удалении регламента');
      }
    } catch (error) {
      console.error('Ошибка удаления регламента:', error);
      alert('Ошибка при удалении регламента');
    }
  };

  const moveRegulation = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = regulations.findIndex(r => r.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === regulations.length - 1)
    ) {
      return;
    }

    const newRegulations = [...regulations];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Обмениваем элементы
    [newRegulations[currentIndex], newRegulations[targetIndex]] = 
    [newRegulations[targetIndex], newRegulations[currentIndex]];

    // Обновляем порядок
    newRegulations.forEach((reg, index) => {
      reg.order = index + 1;
    });

    setRegulations(newRegulations);

    // Сохраняем новый порядок
    try {
      const regulationIds = newRegulations.map(r => r.id);
      await RegulationsAPI.reorderRegulations(regulationIds);
    } catch (error) {
      console.error('Ошибка сохранения порядка регламентов:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Загрузка регламентов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BookOpen className="mr-3 h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-slate-900">Управление регламентами</h2>
        </div>
        <button
          onClick={startCreating}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Добавить регламент
        </button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">
              {isCreating ? 'Создание регламента' : 'Редактирование регламента'}
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
                  Название регламента *
                </label>
                <input
                  type="text"
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите название регламента..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Описание *
                </label>
                <textarea
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Краткое описание регламента..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Категория *
                </label>
                <select
                  value={editForm.category || 'maintenance'}
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
                  Скриншот (URL)
                </label>
                <input
                  type="url"
                  value={editForm.screenshot || ''}
                  onChange={(e) => setEditForm({...editForm, screenshot: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Ссылки на документы */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ссылка на PDF
                </label>
                <input
                  type="text"
                  value={editForm.downloadLinks?.pdf || ''}
                  onChange={(e) => setEditForm({
                    ...editForm, 
                    downloadLinks: {...editForm.downloadLinks, pdf: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/documents/regulation.pdf"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ссылка на Word
                </label>
                <input
                  type="text"
                  value={editForm.downloadLinks?.word || ''}
                  onChange={(e) => setEditForm({
                    ...editForm, 
                    downloadLinks: {...editForm.downloadLinks, word: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/documents/regulation.docx"
                />
              </div>
            </div>
          </div>

          {/* Содержание */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Содержание регламента * (Markdown)
            </label>
            <textarea
              value={editForm.content || ''}
              onChange={(e) => setEditForm({...editForm, content: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={10}
              placeholder="## Заголовок

### Подзаголовок

- Пункт списка
- Еще один пункт

**Жирный текст**"
            />
            <p className="text-xs text-slate-500 mt-1">
              Используйте Markdown для форматирования: ## заголовки, **жирный**, - списки
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
              onClick={saveRegulation}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Save className="mr-2 h-4 w-4" />
              {isCreating ? 'Создать' : 'Сохранить'}
            </button>
          </div>
        </div>
      )}

      {/* Regulations List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">
            Всего регламентов: {regulations.length}
          </h3>
        </div>

        <div className="divide-y divide-slate-200">
          {regulations.map((regulation, index) => (
            <div key={regulation.id} className="p-4 hover:bg-slate-50">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-slate-900 truncate">
                      {regulation.title}
                    </h4>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {categories[regulation.category]}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {regulation.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      Обновлен: {formatDate(regulation.updatedAt)}
                    </div>
                    
                    {regulation.downloadLinks && (
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {regulation.downloadLinks.pdf && <span>PDF</span>}
                        {regulation.downloadLinks.pdf && regulation.downloadLinks.word && <span>•</span>}
                        {regulation.downloadLinks.word && <span>Word</span>}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {/* Сортировка */}
                  <div className="flex flex-col">
                    <button
                      onClick={() => moveRegulation(regulation.id, 'up')}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Переместить вверх"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => moveRegulation(regulation.id, 'down')}
                      disabled={index === regulations.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Переместить вниз"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Действия */}
                  <button
                    onClick={() => startEditing(regulation)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Редактировать"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => deleteRegulation(regulation.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {regulations.length === 0 && (
            <div className="p-8 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Нет регламентов</h3>
              <p className="text-slate-600 mb-4">Создайте первый регламент для начала работы</p>
              <button
                onClick={startCreating}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" />
                Добавить регламент
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 