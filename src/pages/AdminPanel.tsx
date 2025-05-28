import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Home, Users, ArrowLeft, BookOpen, Newspaper, RefreshCw, AlertCircle } from 'lucide-react';
import { ModelManager } from '@/components/ModelManager';
import { RegulationManager } from '@/components/RegulationManager';
import { NewsManager } from '@/components/NewsManager';
import { useModels, clearAllData } from '@/hooks/useModels';

/**
 * Страница админ-панели с авторизацией по токену
 */
export function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'models' | 'regulations' | 'news'>('dashboard');
  
  // Используем хук для получения информации о моделях
  const { models, loading: modelsLoading, error: modelsError, forceRefresh } = useModels();

  useEffect(() => {
    checkAuth();
    
    // Слушаем сообщения для переключения view
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'SET_ADMIN_VIEW') {
        if (event.data.view === 'models') {
          setCurrentView('models');
        } else if (event.data.view === 'regulations') {
          setCurrentView('regulations');
        } else if (event.data.view === 'news') {
          setCurrentView('news');
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const checkAuth = () => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken === 'admin123') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (token === 'admin123') {
      localStorage.setItem('admin_token', token);
      setIsAuthenticated(true);
    } else {
      alert('Неверный токен доступа');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  // Функция для принудительного обновления всех данных
  const handleForceRefresh = () => {
    if (confirm('Очистить все локальные данные и перезагрузить из Supabase?')) {
      clearAllData();
      forceRefresh();
      alert('Данные обновлены из Supabase!');
    }
  };

  // Функция для отладочной информации
  const showDebugInfo = () => {
    const debugInfo = {
      browser: navigator.userAgent,
      localStorage: typeof localStorage !== 'undefined',
      modelsCount: models.length,
      modelsLoading,
      modelsError,
      supabaseUrl: localStorage.getItem('vmc_supabase_url'),
      supabaseKey: localStorage.getItem('vmc_supabase_key') ? '***скрыт***' : null
    };
    
    console.log('🔍 Отладочная информация:', debugInfo);
    alert(`Отладочная информация выведена в консоль (F12)\n\nМоделей загружено: ${models.length}\nОшибки: ${modelsError || 'нет'}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Админ-панель</h1>
            <p className="text-slate-600 mt-2">Введите токен доступа</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-slate-700 mb-2">
                Токен доступа
              </label>
              <input
                type="password"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите токен"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Войти
            </button>
          </form>
          
          <div className="mt-6 pt-4 border-t border-slate-200">
            <Link
              to="/"
              className="flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Рендер основного интерфейса админ-панели
  if (currentView === 'models') {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к панели
              </button>
              <h1 className="text-xl font-semibold text-slate-900">Управление моделями</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleForceRefresh}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Обновить данные
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
        <ModelManager />
      </div>
    );
  }

  if (currentView === 'regulations') {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к панели
              </button>
              <h1 className="text-xl font-semibold text-slate-900">Управление регламентами</h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
        <RegulationManager />
      </div>
    );
  }

  if (currentView === 'news') {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к панели
              </button>
              <h1 className="text-xl font-semibold text-slate-900">Управление новостями</h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
        <NewsManager />
      </div>
    );
  }

  // Dashboard view
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-slate-900">Админ-панель VMC</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Home className="mr-2 h-4 w-4" />
                На главную
              </Link>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Panel */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Статус системы</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${modelsLoading ? 'bg-yellow-500' : modelsError ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <div>
                <p className="text-sm font-medium text-slate-900">База данных</p>
                <p className="text-xs text-slate-600">
                  {modelsLoading ? 'Загрузка...' : modelsError ? 'Ошибка подключения' : `${models.length} моделей`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
              <div>
                <p className="text-sm font-medium text-slate-900">Supabase</p>
                <p className="text-xs text-slate-600">Подключено</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
              <div>
                <p className="text-sm font-medium text-slate-900">Авторизация</p>
                <p className="text-xs text-slate-600">Активна</p>
              </div>
            </div>
          </div>
          
          {modelsError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                <p className="text-sm text-red-800">Ошибка: {modelsError}</p>
              </div>
            </div>
          )}
          
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleForceRefresh}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Обновить данные
            </button>
            
            <button
              onClick={showDebugInfo}
              className="flex items-center px-3 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors text-sm"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Отладка
            </button>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Models Management */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Edit className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Управление моделями
                </h3>
                <p className="text-slate-600 text-sm">
                  Создание и редактирование моделей
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setCurrentView('models')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Открыть
            </button>
          </div>

          {/* Regulations Management */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Управление регламентами
                </h3>
                <p className="text-slate-600 text-sm">
                  Создание и редактирование регламентов
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setCurrentView('regulations')}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Открыть
            </button>
          </div>

          {/* News Management */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Newspaper className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Управление новостями
                </h3>
                <p className="text-slate-600 text-sm">
                  Создание и редактирование новостей
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setCurrentView('news')}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
            >
              Открыть
            </button>
          </div>
        </div>

        {/* Info Sections */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Current Features */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Доступные функции
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Edit className="mr-3 h-4 w-4 text-green-600" />
                <span className="text-slate-700">Управление моделями мототехники</span>
              </div>
              
              <div className="flex items-center">
                <BookOpen className="mr-3 h-4 w-4 text-green-600" />
                <span className="text-slate-700">Создание и редактирование регламентов</span>
              </div>
              
              <div className="flex items-center">
                <Newspaper className="mr-3 h-4 w-4 text-green-600" />
                <span className="text-slate-700">Управление новостями с медиафайлами</span>
              </div>
              
              <div className="flex items-center">
                <Plus className="mr-3 h-4 w-4 text-green-600" />
                <span className="text-slate-700">Сортировка и организация контента</span>
              </div>
            </div>
          </div>

          {/* Future Plans */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Планируемые улучшения
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Users className="mr-3 h-4 w-4 text-slate-500" />
                <div>
                  <span className="text-slate-700 block">Система авторизации с ролями</span>
                  <span className="text-slate-500 text-sm">Разграничение прав доступа</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <Edit className="mr-3 h-4 w-4 text-slate-500" />
                <div>
                  <span className="text-slate-700 block">Интеграция с базой данных</span>
                  <span className="text-slate-500 text-sm">Постоянное хранение данных</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <Plus className="mr-3 h-4 w-4 text-slate-500" />
                <div>
                  <span className="text-slate-700 block">Аналитика и отчеты</span>
                  <span className="text-slate-500 text-sm">Статистика использования</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 