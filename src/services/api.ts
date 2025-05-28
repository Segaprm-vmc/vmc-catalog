import type { MotorcycleModel } from '@/types';
import { SupabaseModelsAPI } from '@/api/supabaseModels';

// const API_BASE_URL = '/api';
const MODEL_UPDATE_EVENT = 'models-updated';

// Универсальная функция для выбора API
const getActiveAPI = () => {
  // Сначала пробуем использовать Supabase (по умолчанию)
  console.log('🚀 Используем Supabase API');
  return SupabaseModelsAPI;
  
  // Fallback на TabStateSync только если явно отключен Supabase
  // const supabaseUrl = localStorage.getItem('vmc_supabase_url');
  // const supabaseKey = localStorage.getItem('vmc_supabase_key');
  // 
  // if (supabaseUrl && supabaseKey) {
  //   console.log('🚀 Используем Supabase API');
  //   return SupabaseModelsAPI;
  // } else {
  //   console.log('🔄 Используем TabStateSync API');
  //   return SyncedModelsAPI;
  // }
};

// Вспомогательная функция для API запросов (не используется, но может пригодиться)
// const apiRequest = async (url: string, options: RequestInit = {}): Promise<any> => {
//   try {
//     const response = await fetch(API_BASE_URL + url, {
//       headers: {
//         'Content-Type': 'application/json',
//         ...options.headers,
//       },
//       ...options,
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('API запрос ошибка:', error);
//     throw error;
//   }
// };

/**
 * Загружает список моделей мотоциклов
 */
export const getModels = async (): Promise<MotorcycleModel[]> => {
  try {
    const API = getActiveAPI();
    const models = await API.getAllModels();
    return models.sort((a: MotorcycleModel, b: MotorcycleModel) => (a.order || 999) - (b.order || 999));
  } catch (error) {
    console.error('Ошибка загрузки моделей:', error);
    return [];
  }
};

/**
 * Получает модель по ID
 */
export const getModelById = async (id: string): Promise<MotorcycleModel | null> => {
  const API = getActiveAPI();
  return await API.getModelById(id);
};

/**
 * Поиск моделей по характеристикам
 */
export const searchModels = async (query: string): Promise<MotorcycleModel[]> => {
  const API = getActiveAPI();
  return await API.searchModels(query);
};

/**
 * Добавляет новую модель
 */
export const addModel = async (model: MotorcycleModel): Promise<{ success: boolean; message?: string; modelId?: string }> => {
  try {
    const API = getActiveAPI();
    const { id, createdAt, ...modelData } = model;
    const newModel = await API.createModel(modelData);
    
    if (newModel) {
      notifyModelsUpdated();
      console.log('Модель добавлена:', newModel.name, 'ID:', newModel.id);
      return { 
        success: true, 
        message: 'Модель успешно добавлена',
        modelId: newModel.id 
      };
    } else {
      return { 
        success: false, 
        message: 'Ошибка при создании модели' 
      };
    }
  } catch (error) {
    console.error('Ошибка добавления модели:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Ошибка сети или сервера' 
    };
  }
};

/**
 * Обновляет существующую модель
 */
export const updateModel = async (updatedModel: MotorcycleModel): Promise<{ success: boolean; message?: string }> => {
  try {
    const API = getActiveAPI();
    const result = await API.updateModel(updatedModel.id, updatedModel);
    
    if (result) {
      notifyModelsUpdated();
      console.log('Модель обновлена:', result.name);
      return { 
        success: true, 
        message: 'Модель успешно обновлена' 
      };
    } else {
      return { 
        success: false, 
        message: 'Ошибка при обновлении модели' 
      };
    }
  } catch (error) {
    console.error('Ошибка обновления модели:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Ошибка сети или сервера' 
    };
  }
};

/**
 * Удаляет модель
 */
export const deleteModel = async (id: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const API = getActiveAPI();
    const success = await API.deleteModel(id);
    
    if (success) {
      notifyModelsUpdated();
      console.log('Модель удалена:', id);
      return { 
        success: true, 
        message: 'Модель успешно удалена' 
      };
    } else {
      return { 
        success: false, 
        message: 'Ошибка при удалении модели' 
      };
    }
  } catch (error) {
    console.error('Ошибка удаления модели:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Ошибка сети или сервера' 
    };
  }
};

/**
 * Изменяет порядок модели
 */
export const updateModelOrder = async (modelId: string, newOrder: number): Promise<boolean> => {
  try {
    const API = getActiveAPI();
    const success = await API.updateModel(modelId, { order: newOrder });
    if (success) {
      notifyModelsUpdated();
      console.log('Порядок модели обновлен:', modelId, newOrder);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Ошибка изменения порядка модели:', error);
    return false;
  }
};

/**
 * Перемещает модель вверх в списке
 */
export const moveModelUp = async (modelId: string): Promise<boolean> => {
  try {
    const API = getActiveAPI();
    const success = await API.moveModel(modelId, 'up');
    if (success) {
      notifyModelsUpdated();
    }
    return success;
  } catch (error) {
    console.error('Ошибка перемещения модели вверх:', error);
    return false;
  }
};

/**
 * Перемещает модель вниз в списке
 */
export const moveModelDown = async (modelId: string): Promise<boolean> => {
  try {
    const API = getActiveAPI();
    const success = await API.moveModel(modelId, 'down');
    if (success) {
      notifyModelsUpdated();
    }
    return success;
  } catch (error) {
    console.error('Ошибка перемещения модели вниз:', error);
    return false;
  }
};

/**
 * Автоматически присваивает порядковые номера всем моделям
 */
export const reorderAllModels = async (): Promise<boolean> => {
  try {
    const API = getActiveAPI();
    const models = await getModels();
    const modelIds = models.map(m => m.id);
    const success = await API.reorderModels(modelIds);
    
    if (success) {
      notifyModelsUpdated();
    }
    
    return success;
  } catch (error) {
    console.error('Ошибка переупорядочивания моделей:', error);
    return false;
  }
};

/**
 * Получает базовые модели (теперь из Supabase)
 */
export const getBaseModels = async (): Promise<MotorcycleModel[]> => {
  // Теперь все модели хранятся в Supabase
  return await getModels();
};

/**
 * Проверяет, является ли модель базовой (теперь все модели из Supabase)
 */
export const isBaseModel = async (id: string): Promise<boolean> => {
  // Все модели теперь считаются базовыми, так как хранятся в Supabase
  const model = await getModelById(id);
  return model !== null;
};

// Функция для уведомления об обновлении моделей
const notifyModelsUpdated = () => {
  window.dispatchEvent(new CustomEvent(MODEL_UPDATE_EVENT));
};

// Экспорт события для подписки
export { MODEL_UPDATE_EVENT };