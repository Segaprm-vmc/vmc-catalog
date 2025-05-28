import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import type { MotorcycleModel } from '@/types';
import { searchModels } from '@/services/api';
import { useModels } from '@/hooks/useModels';
import { Tooltip } from './Tooltip';

/**
 * Боковая панель с поиском и навигацией по моделям
 */
export function Sidebar() {
  const { models: allModels, loading } = useModels();
  const [models, setModels] = useState<MotorcycleModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (searchQuery.trim()) {
      // Выполняем поиск
      searchModels(searchQuery).then(setModels);
    } else {
      // Показываем все модели
      setModels(allModels);
    }
  }, [allModels, searchQuery]);

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col h-full">
      {/* VMC Header - Показываем на всех устройствах */}
      <div className="p-4 border-b border-slate-200 min-h-[72px]">
        <Tooltip content="Нажмите для возврата на главную страницу" position="right">
          <Link to="/" className="block" id="vmc-logo">
            <div className="text-center">
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                VMC Каталог мототехники
              </h1>
              {/* Декоративная линия */}
              <div className="w-full h-0.5 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 rounded-full mt-2"></div>
            </div>
          </Link>
        </Tooltip>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-slate-200">
        <Tooltip content="Введите название модели для быстрого поиска" position="right">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="search-input"
              type="text"
              placeholder="Поиск моделей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </Tooltip>
      </div>

      {/* Models list */}
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-2"></div>
              <div className="text-sm text-slate-500">Загрузка моделей...</div>
            </div>
          </div>
        ) : models.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="h-6 w-6 text-slate-400" />
              </div>
              <div className="text-sm text-slate-500 mb-1">
                {searchQuery ? 'Модели не найдены' : 'Нет доступных моделей'}
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Сбросить поиск
                </button>
              )}
            </div>
          </div>
        ) : (
          <ul className="space-y-1">
            {models.map((model) => (
              <li key={model.id}>
                <Tooltip content={`Посмотреть характеристики ${model.name}`} position="right">
                  <Link
                    to={`/model/${model.id}`}
                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                      isActivePath(`/model/${model.id}`)
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-medium">{model.name}</div>
                  </Link>
                </Tooltip>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 