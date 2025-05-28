import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Search, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import type { MotorcycleModel } from '@/types';
import { addModel, updateModel, deleteModel, moveModelUp, moveModelDown, reorderAllModels } from '@/services/api';
import { ModelEditor } from './ModelEditor';
import { useModels } from '@/hooks/useModels';
import { RefreshModelsButton } from './RefreshModelsButton';

/**
 * Компонент для управления моделями в админ-панели
 */
export function ModelManager() {
  const { models, loading, refresh } = useModels();
  const [filteredModels, setFilteredModels] = useState<MotorcycleModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingModel, setEditingModel] = useState<MotorcycleModel | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    filterModels();
  }, [models, searchQuery]);

  const filterModels = () => {
    if (!searchQuery.trim()) {
      setFilteredModels(models);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = models.filter(model =>
      model.name.toLowerCase().includes(query) ||
      model.description.toLowerCase().includes(query)
    );
    setFilteredModels(filtered);
  };

  const handleAddModel = () => {
    setEditingModel(null);
    setShowEditor(true);
  };

  const handleEditModel = (model: MotorcycleModel) => {
    setEditingModel(model);
    setShowEditor(true);
  };

  const handleDeleteModel = async (model: MotorcycleModel) => {
    if (confirm(`Вы уверены, что хотите удалить модель "${model.name}"?\nЭто действие нельзя отменить.`)) {
      try {
        const result = await deleteModel(model.id);
        if (result.success) {
          alert(result.message || 'Модель успешно удалена');
        } else {
          alert(result.message || 'Ошибка при удалении модели');
        }
      } catch (error) {
        console.error('Ошибка при удалении модели:', error);
        alert('Произошла ошибка при удалении модели. Попробуйте еще раз.');
      }
    }
  };

  const handleSaveModel = async (modelData: Partial<MotorcycleModel>) => {
    try {
      if (editingModel) {
        // Редактирование существующей модели
        const result = await updateModel({ ...editingModel, ...modelData } as MotorcycleModel);
        if (result.success) {
          alert(result.message || 'Модель успешно обновлена');
          setShowEditor(false);
          setEditingModel(null);
        } else {
          throw new Error(result.message || 'Ошибка при обновлении модели');
        }
      } else {
        // Добавление новой модели
        const newModel = {
          ...modelData,
          createdAt: new Date().toISOString()
        } as MotorcycleModel;
        
        const result = await addModel(newModel);
        if (result.success) {
          alert(result.message || 'Модель успешно добавлена');
          setShowEditor(false);
          setEditingModel(null);
          console.log('Модель добавлена с ID:', result.modelId);
        } else {
          throw new Error(result.message || 'Неизвестная ошибка при добавлении модели');
        }
      }
    } catch (error) {
      console.error('Ошибка сохранения модели:', error);
      alert('Произошла ошибка при сохранении модели. Попробуйте еще раз.');
    }
  };

  const handleCancelEdit = () => {
    setShowEditor(false);
    setEditingModel(null);
  };

  const handleMoveUp = async (modelId: string) => {
    try {
      const success = await moveModelUp(modelId);
      if (!success) {
        alert('Модель уже находится в начале списка');
      }
    } catch (error) {
      console.error('Ошибка перемещения модели:', error);
      alert('Произошла ошибка при перемещении модели');
    }
  };

  const handleMoveDown = async (modelId: string) => {
    try {
      const success = await moveModelDown(modelId);
      if (!success) {
        alert('Модель уже находится в конце списка');
      }
    } catch (error) {
      console.error('Ошибка перемещения модели:', error);
      alert('Произошла ошибка при перемещении модели');
    }
  };

  const handleReorderAll = async () => {
    if (confirm('Автоматически присвоить порядковые номера всем моделям?\nТекущий порядок будет сброшен.')) {
      try {
        const success = await reorderAllModels();
        if (success) {
          alert('Порядок моделей обновлен');
        } else {
          alert('Ошибка при переупорядочивании моделей');
        }
      } catch (error) {
        console.error('Ошибка переупорядочивания:', error);
        alert('Произошла ошибка при переупорядочивании');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-12 bg-slate-200 rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Управление моделями
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReorderAll}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Переупорядочить
          </button>
          <button
            onClick={handleAddModel}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Добавить модель
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск моделей..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <RefreshModelsButton onRefresh={refresh} />
      </div>

      {/* Models list */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {filteredModels.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            {searchQuery ? 'Модели не найдены' : 'Нет моделей для отображения'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Порядок
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Модель
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Описание
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Дата создания
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredModels.map((model, index) => (
                  <tr key={model.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700 min-w-[2rem]">
                          {model.order || index + 1}
                        </span>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleMoveUp(model.id)}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded"
                            title="Переместить вверх"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleMoveDown(model.id)}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded"
                            title="Переместить вниз"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {model.images && model.images.length > 0 ? (
                            <img
                              className="h-10 w-10 rounded object-cover"
                              src={model.images[0]}
                              alt={model.name}
                              onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YxZjVmOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM5NGEzYjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JTUc8L3RleHQ+PC9zdmc+';
                              }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded bg-slate-200 flex items-center justify-center">
                              <span className="text-xs text-slate-500">IMG</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900 flex items-center">
                            {model.name}
                            {model.id.startsWith('test-') && (
                              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Базовая
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-slate-500">
                            ID: {model.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900 max-w-xs truncate">
                        {model.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(model.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditModel(model)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          title="Редактировать"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteModel(model)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Удалить"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Model Editor Modal */}
      {showEditor && (
        <ModelEditor
          model={editingModel || undefined}
          onSave={handleSaveModel}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
} 