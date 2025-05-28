import { useState, useEffect, useCallback } from 'react';
import type { MotorcycleModel } from '@/types';
import { getModels } from '@/services/api';

// Глобальные события для обновления списка моделей
const MODEL_UPDATE_EVENT = 'models-updated';
const SUPABASE_UPDATE_EVENT = 'supabase-models-updated';

// Безопасная функция для работы с localStorage
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return null;
      }
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage недоступен:', error);
      return null;
    }
  },
  
  setItem: (key: string, value: string): boolean => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('Не удалось сохранить в localStorage:', error);
      return false;
    }
  },
  
  removeItem: (key: string): boolean => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Не удалось удалить из localStorage:', error);
      return false;
    }
  },
  
  clear: (): boolean => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Не удалось очистить localStorage:', error);
      return false;
    }
  }
};

export const useModels = () => {
  const [models, setModels] = useState<MotorcycleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadModels = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // Логируем информацию о браузере для отладки
      if (typeof window !== 'undefined') {
        console.log('🌐 Браузер:', navigator.userAgent.split(' ').pop());
        console.log('📱 Устройство:', /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'Mobile' : 'Desktop');
      }

      // Если принудительное обновление, очищаем все локальные данные
      if (forceRefresh) {
        console.log('🔄 Принудительное обновление данных...');
        safeLocalStorage.removeItem('vmc-models');
        safeLocalStorage.removeItem('vmc_models');
      }

      // Загружаем данные из Supabase (единственный источник истины)
      const data = await getModels();
      
      console.log('📊 Загружено моделей:', data.length);
      console.log('📋 Модели:', data.map(m => m.name).join(', '));
      
      setModels(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      console.error('❌ Ошибка загрузки моделей:', errorMessage);
      setError(errorMessage);
      setModels([]); // Устанавливаем пустой массив при ошибке
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Начальная загрузка
    loadModels();

    // Слушаем события обновления моделей
    const handleModelsUpdate = () => {
      console.log('🔄 Получено событие обновления моделей');
      loadModels();
    };

    // Слушаем real-time обновления от Supabase
    const handleSupabaseUpdate = (event: CustomEvent) => {
      console.log('🔄 Real-time обновление от Supabase:', event.detail);
      loadModels();
    };

    // Обработчик для видимости страницы (когда пользователь возвращается на вкладку)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ Страница стала видимой, обновляем данные');
        loadModels();
      }
    };

    // Обработчик для фокуса окна
    const handleWindowFocus = () => {
      console.log('🎯 Окно получило фокус, обновляем данные');
      loadModels();
    };

    // Подписываемся на события
    window.addEventListener(MODEL_UPDATE_EVENT, handleModelsUpdate);
    window.addEventListener(SUPABASE_UPDATE_EVENT, handleSupabaseUpdate as EventListener);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);
    
    return () => {
      window.removeEventListener(MODEL_UPDATE_EVENT, handleModelsUpdate);
      window.removeEventListener(SUPABASE_UPDATE_EVENT, handleSupabaseUpdate as EventListener);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [loadModels]);

  // Функция для принудительного обновления
  const forceRefresh = useCallback(() => {
    console.log('🔄 Принудительное обновление данных');
    loadModels(true);
  }, [loadModels]);

  return { 
    models, 
    loading, 
    error,
    refresh: loadModels,
    forceRefresh,
    safeLocalStorage // Экспортируем для использования в других компонентах
  };
};

// Функция для уведомления об обновлении моделей
export const notifyModelsUpdated = () => {
  console.log('📢 Отправляем событие обновления моделей');
  window.dispatchEvent(new CustomEvent(MODEL_UPDATE_EVENT));
};

// Функция для принудительной очистки всех данных
export const clearAllData = () => {
  console.log('🧹 Очищаем все локальные данные');
  safeLocalStorage.clear();
  notifyModelsUpdated();
}; 