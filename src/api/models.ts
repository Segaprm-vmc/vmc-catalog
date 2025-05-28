import type { MotorcycleModel } from '@/types';

const MODELS_FILE_PATH = '/data/models.json';

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
  }
};

export class ModelsAPI {
  static async getAllModels(_forceFromJSON = false): Promise<MotorcycleModel[]> {
    try {
      // Больше не используем localStorage как основной источник данных
      // Всегда загружаем из JSON файла (fallback для старых версий)
      console.warn('⚠️ Используется устаревший ModelsAPI, рекомендуется переход на Supabase');
      
      const response = await fetch(MODELS_FILE_PATH, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📁 Загружено моделей из JSON файла:', data.length);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('❌ Ошибка загрузки моделей:', error);
      return [];
    }
  }

  static async saveAllModels(models: MotorcycleModel[]): Promise<boolean> {
    try {
      console.warn('⚠️ Попытка сохранения через устаревший ModelsAPI');
      
      // Пытаемся сохранить в localStorage как fallback
      const success = safeLocalStorage.setItem('vmc-models', JSON.stringify(models));
      
      if (success) {
        console.log('💾 Модели сохранены в localStorage (fallback):', models.length);
      } else {
        console.warn('⚠️ Не удалось сохранить в localStorage');
      }
      
      return success;
    } catch (error) {
      console.error('❌ Ошибка сохранения моделей:', error);
      return false;
    }
  }

  static async createModel(modelData: Omit<MotorcycleModel, 'id' | 'createdAt'>): Promise<MotorcycleModel | null> {
    try {
      console.warn('⚠️ Создание модели через устаревший ModelsAPI');
      
      // Получаем существующие модели
      const allModels = await this.getAllModels();

      const newModel: MotorcycleModel = {
        id: `vmc-${Date.now()}`,
        ...modelData,
        createdAt: new Date().toISOString(),
        order: Math.max(...allModels.map(m => m.order || 0), 0) + 1
      };

      const updatedModels = [...allModels, newModel];
      const success = await this.saveAllModels(updatedModels);
      
      return success ? newModel : null;
    } catch (error) {
      console.error('❌ Ошибка создания модели:', error);
      return null;
    }
  }

  static async updateModel(id: string, modelData: Partial<MotorcycleModel>): Promise<MotorcycleModel | null> {
    try {
      console.warn('⚠️ Обновление модели через устаревший ModelsAPI');
      
      const allModels = await this.getAllModels();
      const modelIndex = allModels.findIndex(m => m.id === id);
      
      if (modelIndex === -1) {
        console.error('❌ Модель не найдена:', id);
        return null;
      }

      const updatedModel = { ...allModels[modelIndex], ...modelData };
      allModels[modelIndex] = updatedModel;
      
      const success = await this.saveAllModels(allModels);
      return success ? updatedModel : null;
    } catch (error) {
      console.error('❌ Ошибка обновления модели:', error);
      return null;
    }
  }

  static async deleteModel(id: string): Promise<boolean> {
    try {
      console.warn('⚠️ Удаление модели через устаревший ModelsAPI');
      
      const allModels = await this.getAllModels();
      const filteredModels = allModels.filter(m => m.id !== id);
      
      if (filteredModels.length === allModels.length) {
        console.error('❌ Модель не найдена для удаления:', id);
        return false;
      }
      
      return await this.saveAllModels(filteredModels);
    } catch (error) {
      console.error('❌ Ошибка удаления модели:', error);
      return false;
    }
  }

  static async reorderModels(modelIds: string[]): Promise<boolean> {
    try {
      const allModels = await this.getAllModels();
      const reorderedModels = modelIds.map((id, index) => {
        const model = allModels.find(m => m.id === id);
        if (!model) throw new Error(`Модель с ID ${id} не найдена`);
        return { ...model, order: index + 1 };
      });

      return await this.saveAllModels(reorderedModels);
    } catch (error) {
      console.error('Ошибка изменения порядка моделей:', error);
      return false;
    }
  }

  static async moveModel(id: string, direction: 'up' | 'down'): Promise<boolean> {
    try {
      const allModels = await this.getAllModels();
      const sortedModels = allModels.sort((a, b) => (a.order || 999) - (b.order || 999));
      const currentIndex = sortedModels.findIndex(m => m.id === id);
      
      if (currentIndex === -1) {
        throw new Error('Модель не найдена');
      }

      if (
        (direction === 'up' && currentIndex === 0) ||
        (direction === 'down' && currentIndex === sortedModels.length - 1)
      ) {
        return false; // Модель уже в начале/конце списка
      }

      const newModels = [...sortedModels];
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      // Обмениваем элементы
      [newModels[currentIndex], newModels[targetIndex]] = 
      [newModels[targetIndex], newModels[currentIndex]];

      // Обновляем порядок
      newModels.forEach((model, index) => {
        model.order = index + 1;
      });

      return await this.saveAllModels(newModels);
    } catch (error) {
      console.error('Ошибка перемещения модели:', error);
      return false;
    }
  }

  static async searchModels(query: string): Promise<MotorcycleModel[]> {
    try {
      const allModels = await this.getAllModels();
      
      if (!query.trim()) {
        return allModels.sort((a, b) => (a.order || 999) - (b.order || 999));
      }

      const searchQuery = query.toLowerCase();
      return allModels.filter(model => 
        model.name.toLowerCase().includes(searchQuery) ||
        model.description.toLowerCase().includes(searchQuery) ||
        Object.values(model.specifications).some(spec => 
          spec.toLowerCase().includes(searchQuery)
        )
      ).sort((a, b) => (a.order || 999) - (b.order || 999));
    } catch (error) {
      console.error('Ошибка поиска моделей:', error);
      return [];
    }
  }

  static async getModelById(id: string): Promise<MotorcycleModel | null> {
    try {
      const allModels = await this.getAllModels();
      return allModels.find(m => m.id === id) || null;
    } catch (error) {
      console.error('❌ Ошибка получения модели:', error);
      return null;
    }
  }
} 